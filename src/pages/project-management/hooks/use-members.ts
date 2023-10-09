import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { httpsUpdateTeamUserPermission } from 'src/core/services/user-services'
import { useStorage } from '@vueuse/core'
import { UpdateTeamUserPermissionRequest } from 'src/core/types/services/user-types'
import { useRoute, useRouter } from 'vue-router'
import { UserInfo } from 'src/core/types/user-info'
import { UserMenu } from 'src/core/types/user-menu'
import {
  ProjectMember,
  PROJECT_MEMBER_TYPE,
} from 'src/core/types/project-member-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { ProjectPermissionCodeType } from 'src/core/types/project-permission-code-types'
import {
  httpsAddProjectMember,
  httpsGetProjectMembers,
  httpsGetProjectUserPermissionDetail,
  httpsGetUnProjectMembers,
  httpsRemoveProjectMember,
  httpsUpdateProjectPermission,
} from 'src/core/services/project-services'
import {
  AddProjectMemberRequest,
  RemoveProjectMemberRequest,
  UpdateProjectPermissionRequest,
} from 'src/core/types/services/project-types'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'
import { useProjectStore } from 'src/core/stores/projects'

const modal = reactive<{
  open: boolean
  type:
    | 'NEW_MEMBER_MODAL'
    | 'ASSIGN_ROLE_MODAL'
    | 'DELETE_MEMBER_MODAL'
    | 'DELETE_MEMBERS_MODAL'
}>({
  open: false,
  type: 'NEW_MEMBER_MODAL',
})
const selectUsers = ref<ProjectMember[]>([])
const activeUser = useStorage<ProjectMember>(
  'project-management-activeUser',
  {} as ProjectMember,
  sessionStorage
)
const activeUserPermission = ref<Map<ProjectPermissionCodeType, UserMenu[]>>(
  new Map<ProjectPermissionCodeType, UserMenu[]>()
)

export function useProjectMembers() {
  // composables
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const { activeProject } = storeToRefs(useProjectStore())
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
  const { resetSearchKeyword } = useSearchStore()
  const { updatePagination } = usePaginationStore()

  // reset state
  updatePagination({ ...pagination.value, rowsPerPage: 10000 })
  resetSearchKeyword()

  // methods
  function onCloseModal() {
    modal.open = false
  }
  function onDeleteMembers() {
    modal.type = 'DELETE_MEMBERS_MODAL'
    modal.open = true
  }
  function onDeleteMember(user: ProjectMember | null | undefined) {
    if (!user) {
      throw new Error('Select user not exist')
    }
    activeUser.value = user
    modal.type = 'DELETE_MEMBER_MODAL'
    modal.open = true
  }

  function onAddNewMember() {
    modal.type = 'NEW_MEMBER_MODAL'
    modal.open = true
  }

  function onAssignRole() {
    if (selectUsers?.value?.length === 0) {
      $q.notify({
        message: 'Please select users to assign',
        type: 'negative',
      })
      return
    }
    modal.type = 'ASSIGN_ROLE_MODAL'
    modal.open = true
  }

  function onViewUser(user: ProjectMember) {
    activeUser.value = user

    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.MEMBERS_DETAIL,
      params: { ...route.params, userName: activeUser.value?.userName },
    })
  }

  async function handleAddNewMembers(
    users: string[],
    projectId: string | number
  ) {
    try {
      loading.value = true

      const payload: AddProjectMemberRequest = {
        projectId,
        users,
      }

      const data = await httpsAddProjectMember(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Add new members success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleRemoveProjectMembers(
    users: string[],
    projectId: number
  ) {
    try {
      loading.value = true

      const payload: RemoveProjectMemberRequest = {
        projectId,
        users,
      }
      const data = await httpsRemoveProjectMember(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Remove members success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleFetchProjectMembers(
    projectId: string,
    currentPaging?: TablePagination,
    keyword?: string
  ) {
    try {
      loading.value = true

      const data = await httpsGetProjectMembers({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        projectId,
        userName: keyword,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })

        return data?.data?.list.map((item) => {
          return {
            id: item.userName,
            ...item,
            gmtCreateString: format(
              new Date(item.gmtCreated || ''),
              'MMM dd, yyyy'
            ).toString(),
            managerString:
              item?.userName === activeProject?.value?.owner
                ? 'Owner'
                : item?.managerUser
                ? 'Manager'
                : 'Member',
            type:
              item?.userName === activeProject?.value?.owner
                ? PROJECT_MEMBER_TYPE.OWNER
                : item?.managerUser
                ? PROJECT_MEMBER_TYPE.PROJECT_MANAGER
                : PROJECT_MEMBER_TYPE.MEMBER,
          }
        })
      }
      return []
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function handleGetUnProjectMembers(projectId: string) {
    try {
      loading.value = true
      const data = await httpsGetUnProjectMembers(projectId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data.data.map((item) => {
          return {
            ...item,
            projectId: projectId,
          }
        })
      }
      return [] as UserInfo[]
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchUserDetailMenusByUser(
    projectId: string,
    userName: string
  ) {
    let menus = new Map<ProjectPermissionCodeType, UserMenu[]>()

    try {
      loading.value = true
      const data = await httpsGetProjectUserPermissionDetail(
        projectId,
        userName
      )
      if (data?.code === RESPONSE_CODE.SUCCESS) {
        const checkingDatas = handleFormatPermissionByAdmin(data?.data)
        menus = handleFlatingMenus(checkingDatas)
      }
    } catch (error) {
      throw error
    } finally {
      loading.value = false
      return menus
    }
  }

  async function handleGetTeamUserPermissionDetail(
    projectId: string,
    userName: string
  ) {
    try {
      activeUserPermission.value = await fetchUserDetailMenusByUser(
        projectId,
        userName
      )
    } catch (error) {
      throw error
    }
  }

  async function handleUpdateProjectUserPermission(
    payload: UpdateProjectPermissionRequest
  ) {
    try {
      const data = await httpsUpdateProjectPermission(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Update user permission success',
          type: 'positive',
        })
        return true
      }

      return false
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  function handleFlatingMenus(menus: UserMenu[] | undefined) {
    const menuMap = new Map<ProjectPermissionCodeType, UserMenu[]>()
    menus?.forEach((menu) => {
      if (menu?.authType) {
        const currentMenus = menuMap.get(menu.authType)?.values() ?? []
        menuMap.set(menu.authType, [
          ...currentMenus,
          { ...menu, title: menu.name },
        ])
      }
    })

    return menuMap
  }

  function handleFormatPermissionByAdmin(menus: UserMenu[]) {
    if (activeUser.value?.manager) {
      return menus.map((item) => {
        return { ...item, checked: true }
      })
    }
    return menus
  }

  return {
    modal,
    loading,
    pagination,
    activeUser,
    selectUsers,
    searchKeyword,
    activeUserPermission,
    onViewUser,
    onCloseModal,
    onAssignRole,
    onAddNewMember,
    onDeleteMember,
    onDeleteMembers,
    updatePagination,
    handleAddNewMembers,
    handleFetchProjectMembers,
    handleGetUnProjectMembers,
    handleRemoveProjectMembers,
    handleUpdateProjectUserPermission,
    handleGetTeamUserPermissionDetail,
  }
}
