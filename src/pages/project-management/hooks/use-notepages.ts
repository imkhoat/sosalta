import {
  httpsCopyNotepage,
  httpsCreateProjectNotepage,
  httpsDeleteNotepage,
  httpsGetOtherProjectNotepages,
  httpsGetProjectNotepages,
  httpsUpdateProjectNotepage,
} from 'src/core/services/project-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { Notepage } from 'src/core/types/notepage-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { reactive, ref } from 'vue'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useStorage } from '@vueuse/core'
import { useDrawer } from 'src/core/composables/use-drawer'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'
import { GetProjectNotepagesRequest } from 'src/core/types/services/project-types'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_NOTES'
    | 'DELETE_NOTEPAGE_MODAL'
    | 'DELETE_NOTEPAGES_MODAL'
    | 'NEW_NOTEPAGE_MODAL'
    | 'RENAME_NOTEPAGE_MODAL'
    | 'COPY_NOTEPAGE_MODAL'
    | 'EXPORT_NOTEPAGE_MODAL'
    | 'VIEW_NOTEPAGE_MODAL'
}>({
  open: false,
  type: 'VIEW_NOTES',
})
const drawer = reactive<{
  type: 'VIEW_NOTES'
}>({
  type: 'VIEW_NOTES',
})

const activeNotepage = useStorage<Notepage>(
  'project-management-activeNotepage',
  {} as Notepage,
  sessionStorage
)
const selectedNotepages = ref<Notepage[]>([])

export function useProjectNotepages() {
  // data
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { onShowDrawer } = useDrawer()
  const { pagination } = storeToRefs(usePaginationStore())
  const { resetSearchKeyword } = useSearchStore()
  const { resetPagination, updatePagination } = usePaginationStore()

  //reset state
  resetPagination()
  resetSearchKeyword()

  //data
  const loading = ref(false)

  // function
  function onSetActiveNotepage(notepage: Notepage) {
    handleSetActiveNotepage(notepage)
  }
  function onCloseModal() {
    modal.open = false
  }

  function onCreateNewNotepage() {
    modal.open = true
    modal.type = 'NEW_NOTEPAGE_MODAL'
  }

  function onDeleteNotepage(notepage: Notepage) {
    handleSetActiveNotepage(notepage)
    modal.open = true
    modal.type = 'DELETE_NOTEPAGE_MODAL'
  }

  function onDeleteNotepages() {
    modal.open = true
    modal.type = 'DELETE_NOTEPAGES_MODAL'
  }

  function onCleanSelectedNotepages() {
    selectedNotepages.value = []
  }
  function onViewNotes(notepage: Notepage) {
    handleSetActiveNotepage(notepage)
    router.push({
      name: PROJECT_MANAGEMENT_ROUTE_NAMES.NOTES,
      params: { ...route.params, notePageId: activeNotepage.value?.notePageId },
    })
  }

  function onDrawerViewNotes(notepage: Notepage) {
    handleSetActiveNotepage(notepage)
    drawer.type = 'VIEW_NOTES'
    onShowDrawer()
  }

  function onRenameNotepage(notepage: Notepage | null) {
    handleSetActiveNotepage(notepage)
    modal.open = true
    modal.type = 'RENAME_NOTEPAGE_MODAL'
  }

  function onCopyNotepage(notepage: Notepage | null) {
    handleSetActiveNotepage(notepage)
    modal.open = true
    modal.type = 'COPY_NOTEPAGE_MODAL'
  }

  function onExportNotepage(notepage: Notepage | null) {
    handleSetActiveNotepage(notepage)
    modal.open = true
    modal.type = 'EXPORT_NOTEPAGE_MODAL'
  }

  function onViewInfoNotepage(notepage: Notepage | null) {
    handleSetActiveNotepage(notepage)
    modal.open = true
    modal.type = 'VIEW_NOTEPAGE_MODAL'
  }

  function handleSetActiveNotepage(notepage: Notepage | null) {
    activeNotepage.value = notepage
  }

  async function handleFetchProjectNotepages(
    projectId: string | number | undefined,
    currentPaging?: TablePagination,
    keyword?: string,
    type?: string
  ) {
    try {
      loading.value = true

      const payload: GetProjectNotepagesRequest = {
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        projectId,
        page: currentPaging?.page ?? pagination.value?.page,
        value: keyword,
        type,
      }

      const data = await httpsGetProjectNotepages(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data?.pageSize || pagination.value?.rowsPerPage,
          page: data?.data?.currPage || pagination.value?.page,
          rowsNumber: data?.data?.totalCount || pagination.value?.rowsNumber,
          totalPage: data?.data?.totalCount / data?.data?.pageSize,
        })
        return data?.data?.list?.map((item) => {
          return {
            id: item.notePageId,
            ...item,
            gmtCreateAtString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtUpdateAtString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy'
            ).toString(),
          }
        })
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

  async function handleFetchLinkProjectNotepages(projectId: string | number) {
    try {
      loading.value = true

      const data = await httpsGetOtherProjectNotepages(projectId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data.map((item) => {
          return {
            id: item.notePageId,
            ...item,
            gmtCreateAtString: format(
              new Date(item.gmtCreate || ''),
              'MMM dd, yyyy'
            ).toString(),
            gmtUpdateAtString: format(
              new Date(item.gmtUpdate || ''),
              'MMM dd, yyyy'
            ).toString(),
          }
        })
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

  async function handleCreateNewNotepage(
    name: string | undefined,
    projectId: string | number
  ) {
    try {
      if (!name) {
        $q.notify({
          message: 'Please input project name',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const payload = {
        pageName: name,
        projectId,
      }

      const data = await httpsCreateProjectNotepage(payload)

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

  async function handleDeleteActiveNotepage() {
    try {
      if (!activeNotepage.value) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await httpsDeleteNotepage([
        activeNotepage?.value?.notePageId,
      ])

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

  async function handleDeleteSelectedNotepages() {
    try {
      if (selectedNotepages.value?.length === 0) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const notepageIds = selectedNotepages.value.map((item) => item.notePageId)

      const data = await httpsDeleteNotepage(notepageIds)

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

  async function handleChangeNotepageName(notepage: Notepage) {
    try {
      if (!notepage) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsUpdateProjectNotepage(notepage)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Rename success',
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

  async function handleCopyActiveNotepage() {
    try {
      if (!activeNotepage.value) {
        $q.notify({
          message: 'Please select project to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await httpsCopyNotepage(activeNotepage?.value?.notePageId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Copy success',
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

  return {
    modal,
    loading,
    pagination,
    activeNotepage,
    selectedNotepages,
    onViewNotes,
    onCloseModal,
    onCopyNotepage,
    updatePagination,
    onExportNotepage,
    onDeleteNotepage,
    onRenameNotepage,
    onDrawerViewNotes,
    onDeleteNotepages,
    onViewInfoNotepage,
    onSetActiveNotepage,
    onCreateNewNotepage,
    handleFetchProjectNotepages,
    handleSetActiveNotepage,
    handleCreateNewNotepage,
    onCleanSelectedNotepages,
    handleCopyActiveNotepage,
    handleChangeNotepageName,
    handleDeleteActiveNotepage,
    handleDeleteSelectedNotepages,
    handleFetchLinkProjectNotepages,
  }
}
