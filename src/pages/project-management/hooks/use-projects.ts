import {
  httpsGetUserList,
  httpsGetGroupOwners,
} from 'src/core/services/user-services'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { UserInfo } from 'src/core/types/user-info'
import { errorHandler } from 'src/core/utils/error-handler'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import {
  httpsCreateNewProject,
  httpsDeleteProject,
  httpsGetProjectDetail,
  httpsGetProjects,
  httpsUpdateProjectInfo,
  httpsUpdateProjectProperties,
} from 'src/core/services/project-services'
import { Project } from 'src/core/types/project-types'
import { CreateNewProjectRequest } from 'src/core/types/services/project-types'
import { useStorage } from '@vueuse/core'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'
import { useProjectStore } from 'src/core/stores/projects'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_PROJECT_FILES'
    | 'VIEW_PROJECT_MEMBERS'
    | 'DELETE_PROJECT_MODAL'
    | 'DELETE_PROJECTS_MODAL'
    | 'NEW_PROJECT_MEMBERS'
    | 'RENAME_PROJECT_MODAL'
}>({
  open: false,
  type: 'VIEW_PROJECT_FILES',
})
const activeProject = useStorage<Project>(
  'project-management-activeProject',
  {} as Project,
  sessionStorage
)
const selectProjects = ref<Project[]>([])

export function useProjects() {
  // composable
  const $q = useQuasar()
  const router = useRouter()
  const { setActiveProject } = useProjectStore()
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
  const { resetSearchKeyword } = useSearchStore()
  const { resetPagination, updatePagination } = usePaginationStore()

  //reset state
  resetPagination()
  resetSearchKeyword()

  // data
  const projects = ref<Project[]>([])
  const projectMembers = ref<UserInfo[]>()
  const loading = ref(false)

  // methods
  function onCloseModal() {
    modal.open = false
  }

  function onCreateNewProject() {
    modal.open = true
    modal.type = 'NEW_PROJECT_MEMBERS'
  }

  function onRenameProject(project: Project | null) {
    activeProject.value = project
    setActiveProject(project)
    modal.open = true
    modal.type = 'RENAME_PROJECT_MODAL'
  }

  function onViewProjectMembers(project: Project | null) {
    activeProject.value = project
    setActiveProject(project)
    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.MEMBERS,
      params: { projectId: activeProject.value?.projectId },
    })
  }

  function onViewProjectFiles(project: Project | null) {
    activeProject.value = project
    setActiveProject(project)
    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.FILES,
      params: {
        projectId: activeProject.value.projectId,
        projectTeamId: activeProject.value?.projectTeamId,
      },
    })
  }

  function onViewProjectNotepages(project: Project | null) {
    activeProject.value = project
    setActiveProject(project)
    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.NOTEPAGES,
      params: {
        projectId: activeProject.value?.projectId,
        projectTeamId: activeProject.value?.projectTeamId,
      },
    })
  }

  function onViewProjectInfo(project: Project | null) {
    activeProject.value = project
    setActiveProject(project)
    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.SETTINGS,
      params: { projectId: activeProject.value?.projectId },
    })
  }

  function onDeleteProject(project: Project | null) {
    activeProject.value = project
    setActiveProject(project)
    modal.open = true
    modal.type = 'DELETE_PROJECT_MODAL'
  }

  function onDeleteProjects() {
    modal.open = true
    modal.type = 'DELETE_PROJECTS_MODAL'
  }

  function onToggleModal() {
    modal.open = !modal.open
  }

  async function handleFetchProjectList(
    currentPaging?: TablePagination,
    keyword?: string,
    owner?: string
  ) {
    try {
      loading.value = true

      const data = await httpsGetProjects({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        projectName: keyword ?? searchKeyword.value,
        owner: owner,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        projects.value =
          data?.data?.list.map((project) => {
            return _transformProjectData(project)
          }) ?? []

        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function fetchGroupOwner() {
    try {
      loading.value = true

      const data = await httpsGetGroupOwners()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data ?? []
      }
      return []
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchProjectMembers() {
    try {
      loading.value = true
      const data = await httpsGetUserList()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        projectMembers.value =
          data?.data.map((user) => {
            return {
              id: user.userName,
              ...user,
              gmtCreateAtString: format(
                new Date(user.gmtCreate || ''),
                'MMM dd, yyyy'
              ).toString(),
            }
          }) ?? []
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteActiveProject() {
    try {
      if (!activeProject.value) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await httpsDeleteProject(activeProject?.value?.projectId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Delete success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleDeleteSelectedProjects() {
    try {
      if (selectProjects.value?.length === 0) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await Promise.all(
        selectProjects?.value?.map((item) => httpsDeleteProject(item.projectId))
      )

      if (data?.every((item) => item?.code === RESPONSE_CODE.SUCCESS)) {
        $q.notify({
          message: 'Delete success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleCreateNewProject(name: string | undefined) {
    try {
      if (!name) {
        $q.notify({
          message: 'Please input project name',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const payload: CreateNewProjectRequest = {
        projectName: name,
      }

      const data = await httpsCreateNewProject(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleChangeProjectName(project: Project) {
    try {
      if (!project) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsUpdateProjectInfo(project)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Update success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleChangeProjectProperties(project: Project) {
    try {
      if (!project) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsUpdateProjectProperties(project)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Update properties success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleGetProjectDetail(projectId: string | undefined) {
    try {
      if (!projectId) {
        $q.notify({
          message: 'Please select project',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsGetProjectDetail(projectId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        activeProject.value = {
          ...activeProject.value,
          ..._transformProjectData(data?.data),
        }
        setActiveProject(activeProject.value)
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  function _transformProjectData(project: Project) {
    return {
      id: project.projectId,
      ...project,
      gmtCreateAtString: format(
        new Date(project.gmtCreate || ''),
        'MMM dd, yyyy'
      ).toString(),
      gmtUpdateAtString: format(
        new Date(project.gmtUpdate || ''),
        'MMM dd, yyyy'
      ).toString(),
    }
  }

  return {
    modal,
    projects,
    loading,
    pagination,
    activeProject,
    searchKeyword,
    projectMembers,
    selectProjects,
    onCloseModal,
    onToggleModal,
    onDeleteProject,
    fetchGroupOwner,
    onRenameProject,
    updatePagination,
    handleFetchProjectList,
    onDeleteProjects,
    onViewProjectInfo,
    onViewProjectFiles,
    onCreateNewProject,
    fetchProjectMembers,
    onViewProjectMembers,
    onViewProjectNotepages,
    handleGetProjectDetail,
    handleCreateNewProject,
    handleChangeProjectName,
    handleDeleteActiveProject,
    handleDeleteSelectedProjects,
    handleChangeProjectProperties,
  }
}
