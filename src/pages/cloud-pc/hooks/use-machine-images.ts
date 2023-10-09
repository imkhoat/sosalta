import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { MachineImage } from 'src/core/types/machine-image-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import {
  httpsEstimateLaunchCloudPCInstance,
  httpsGetMachineImageDetail,
  httpsGetMachineImages,
  httpsGetMachineInstanceCount,
  httpsGetMachineInstanceLimit,
  httpsGetMachineInstanceTypes,
  httpsGetMemberList,
  httpsGetTeamList,
  httpsLaunchCloudPCInstance,
} from 'src/core/services/machine-services'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'
import { useAuthStore } from 'src/core/stores/auth'
import {
  EstimateLauchCloudPCInstanceRequest,
  GetMachineImageDetailRequest,
  LauchCloudPCInstanceRequest,
} from 'src/core/types/services/machine-types'
import { httpsCheckAvailableBalance } from 'src/core/services/user-services'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_MACHINE_IMAGE'
    | 'RUN_MACHINE_IMAGE_MODAL'
    | 'SUCCESS_MACHINE_IMAGE_MODAL'
}>({
  open: false,
  type: 'VIEW_MACHINE_IMAGE',
})
const drawer = reactive<{
  type: 'VIEW_MACHINE_IMAGE'
}>({
  type: 'VIEW_MACHINE_IMAGE',
})

const activeMachineImage = useStorage<MachineImage>(
  'cloud-pc-activeMachineImage',
  {} as MachineImage,
  sessionStorage
)
const selectedMachineImages = ref<MachineImage[]>([])

export function useCloudPCMachineImages() {
  // data
  const $q = useQuasar()
  const route = useRoute()
  const router = useRouter()
  const { getUserInformation } = storeToRefs(useAuthStore())
  const { pagination } = storeToRefs(usePaginationStore())
  const { searchKeyword } = storeToRefs(useSearchStore())
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

  function onRunMachineInstance(machineImage: MachineImage) {
    activeMachineImage.value = machineImage
    modal.open = true
    modal.type = 'RUN_MACHINE_IMAGE_MODAL'
  }

  function onViewDetail(machineImage: MachineImage) {
    activeMachineImage.value = machineImage
    modal.type = 'VIEW_MACHINE_IMAGE'
    modal.open = true
  }

  function onShowSuccessModal() {
    modal.type = 'SUCCESS_MACHINE_IMAGE_MODAL'
    modal.open = true
  }

  async function handleGetCloudPCMachineImages(
    type: 'public' | 'private' | 'team',
    currentPaging?: TablePagination,
    keyword?: string,
    userName?: string,
    groupId?: number | string
  ) {
    try {
      loading.value = true

      const data = await httpsGetMachineImages({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        imageName: keyword ?? searchKeyword.value,
        username: userName ?? '',
        type,
        groupId,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })

        return data?.data?.list
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

  async function handleGetTeamList() {
    try {
      loading.value = true

      const data = await httpsGetTeamList()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data?.map((item) => {
          return { label: item.groupName, value: item.groupId }
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

  async function handleGetMemberList() {
    let users = [
      {
        label: getUserInformation.value?.userName,
        value: getUserInformation.value?.userName,
      },
    ]
    try {
      loading.value = true

      const data = await httpsGetMemberList()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        users = [
          ...users,
          ...data?.data?.map((item) => {
            return { label: item.userName, value: item.userName }
          }),
        ]
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
      return users
    }
  }

  async function handleGetMachineImageDetail(
    payload: GetMachineImageDetailRequest
  ) {
    try {
      loading.value = true
      const data = await httpsGetMachineImageDetail(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        activeMachineImage.value = data?.data
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
    } finally {
      loading.value = false
    }
  }

  async function handleGetMachineInstanceLimit() {
    try {
      loading.value = true

      const data = await httpsGetMachineInstanceLimit()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
      return null
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function handleGetMachineInstanceCount() {
    try {
      loading.value = true

      const data = await httpsGetMachineInstanceCount()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
      }
      return null
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function handleGetMachineInstanceTypes(id: string) {
    try {
      loading.value = true

      const data = await httpsGetMachineInstanceTypes(id)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return data?.data
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

  async function handleCheckAvailableBalance() {
    try {
      const data = await httpsCheckAvailableBalance()

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return true
      }
    } catch (error) {
      return false
    }
  }

  async function handleLaunchCloudPCInstance(
    payload: LauchCloudPCInstanceRequest
  ) {
    try {
      loading.value = true

      const data = await httpsLaunchCloudPCInstance(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return {
          result: true,
          data: data?.data,
        }
      }
      return {
        result: false,
        data: data?.data,
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return {
        result: true,
        data: error,
      }
    } finally {
      loading.value = false
    }
  }

  async function handleEstimateLaunchCloudPCInstance(
    payload: EstimateLauchCloudPCInstanceRequest
  ) {
    try {
      loading.value = true

      const data = await httpsEstimateLaunchCloudPCInstance(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return {
          result: true,
        }
      }
      return {
        result: false,
        duration: data?.duration ?? 0,
      }
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return {
        result: false,
        duration: 0,
      }
    } finally {
      loading.value = false
    }
  }

  return {
    modal,
    loading,
    pagination,
    searchKeyword,
    activeMachineImage,
    selectedMachineImages,
    onViewDetail,
    onCloseModal,
    updatePagination,
    handleGetTeamList,
    onShowSuccessModal,
    handleGetMemberList,
    onRunMachineInstance,
    handleLaunchCloudPCInstance,
    handleCheckAvailableBalance,
    handleGetMachineImageDetail,
    handleGetCloudPCMachineImages,
    handleGetMachineInstanceLimit,
    handleGetMachineInstanceCount,
    handleGetMachineInstanceTypes,
    handleEstimateLaunchCloudPCInstance,
  }
}
