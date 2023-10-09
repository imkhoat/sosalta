import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { DataDrive } from 'src/core/types/data-drive-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { reactive, ref } from 'vue'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { CLOUD_PC_ROUTE_NAMES } from 'src/core/router/routes'
import { useStorage } from '@vueuse/core'
import { useDrawer } from 'src/core/composables/use-drawer'
import {
  httpsCheckDataDriveName,
  httpsCreateDataDrive,
  httpsGetDataDrivesByUserName,
  httpsDeleteDataDrive,
  httpsRenameDataDrive,
  httpsGetDataDrives,
} from 'src/core/services/machine-services'
import { httpsGetMemberUsers } from 'src/core/services/user-services'
import { useAuthStore } from 'src/core/stores/auth'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_DATA_DRIVE'
    | 'DELETE_DATA_DRIVE_MODAL'
    | 'DELETE_DATA_DRIVES_MODAL'
    | 'NEW_DATA_DRIVE_MODAL'
    | 'RENAME_DATA_DRIVE_MODAL'
}>({
  open: false,
  type: 'VIEW_DATA_DRIVE',
})
const drawer = reactive<{
  type: 'VIEW_DATA_DRIVE'
}>({
  type: 'VIEW_DATA_DRIVE',
})

const activeDataDrive = useStorage<DataDrive>(
  'cloud-pc-activeDataDrive',
  {} as DataDrive,
  sessionStorage
)
const selectedDataDrives = ref<DataDrive[]>([])

export function useCloudPCDataDrives() {
  // data
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
  const { getUserInformation } = storeToRefs(useAuthStore())
  const { resetSearchKeyword } = useSearchStore()
  const { updatePagination, resetPagination } = usePaginationStore()

  //reset state
  resetPagination()
  resetSearchKeyword()
  //data
  const loading = ref(false)

  // function
  function onCloseModal() {
    modal.open = false
  }

  function onCreateNewDataDrive() {
    modal.open = true
    modal.type = 'NEW_DATA_DRIVE_MODAL'
  }

  function onDeleteDataDrive(dataDrive: DataDrive) {
    activeDataDrive.value = dataDrive
    modal.open = true
    modal.type = 'DELETE_DATA_DRIVE_MODAL'
  }

  function onDeleteDataDrives() {
    modal.open = true
    modal.type = 'DELETE_DATA_DRIVES_MODAL'
  }

  function onViewDrive(dataDrive: DataDrive) {
    activeDataDrive.value = dataDrive
    router.push({
      name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE,
      params: {
        ...route.params,
        dataDriveId: activeDataDrive.value?.dataDriveId,
      },
    })
  }

  function onViewDriveFile(dataDrive: DataDrive) {
    activeDataDrive.value = dataDrive
    router.push({
      name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE_FILE,
      params: {
        ...route.params,
        fileSystemId: activeDataDrive.value?.fileSystemId,
      },
    })
  }

  function onRenameDataDrive(dataDrive: DataDrive | null) {
    activeDataDrive.value = dataDrive
    modal.open = true
    modal.type = 'RENAME_DATA_DRIVE_MODAL'
  }

  async function handleGetCloudPCDataDrives(
    currentPaging?: TablePagination,
    keyword?: string,
    userName?: string,
    locked?: 0 | 1
  ) {
    try {
      loading.value = true

      const data = await httpsGetDataDrives({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        dataDriveName: keyword ?? searchKeyword.value,
        userName: userName ?? '',
        locked,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })

        return data?.data?.list.map((item) => {
          return {
            id: item.dataDriveId,
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

  async function handleGetManagingUsersWithMe() {
    try {
      loading.value = true
      const data = await httpsGetMemberUsers()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return [getUserInformation.value, ...data?.data]
      }

      return [getUserInformation.value]
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return [getUserInformation.value]
    } finally {
      loading.value = false
    }
  }

  async function handleCreateNewDataDrive(driveName: string, userName: string) {
    try {
      if (!driveName) {
        $q.notify({
          message: 'Please input drive name',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsCreateDataDrive(driveName, userName)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: 'Create data drive success',
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

  async function handleDeleteActiveDataDrive() {
    try {
      if (!activeDataDrive.value) {
        $q.notify({
          message: 'Please select data drive to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await httpsDeleteDataDrive(
        activeDataDrive?.value?.dataDriveId
      )

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

  async function handleCheckDataDriveName(driveName: string, userName: string) {
    try {
      if (!driveName || !userName) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await httpsCheckDataDriveName(driveName, userName)

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

  async function handleDeleteSelectedDataDrives() {
    try {
      if (selectedDataDrives.value?.length === 0) {
        $q.notify({
          message: 'Please select data drive to delete',
          type: 'negative',
        })
        return
      }
      loading.value = true

      const data = await Promise.all(
        selectedDataDrives?.value?.map((item) =>
          httpsDeleteDataDrive(item.dataDriveId)
        )
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

  async function handleChangeDataDriveName(
    dataDriveId: string | number,
    driveName: string
  ) {
    try {
      if (!dataDriveId || !driveName) {
        $q.notify({
          message: 'Field required',
          type: 'negative',
        })
        return
      }

      loading.value = true

      const data = await httpsRenameDataDrive(dataDriveId, driveName)

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

  return {
    modal,
    loading,
    pagination,
    searchKeyword,
    activeDataDrive,
    selectedDataDrives,
    onViewDrive,
    onCloseModal,
    onViewDriveFile,
    updatePagination,
    onDeleteDataDrive,
    onRenameDataDrive,
    onDeleteDataDrives,
    onCreateNewDataDrive,
    handleCheckDataDriveName,
    handleCreateNewDataDrive,
    handleChangeDataDriveName,
    handleDeleteActiveDataDrive,
    handleGetManagingUsersWithMe,
    handleDeleteSelectedDataDrives,
    handleGetCloudPCDataDrives,
  }
}
