import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import {
  MACHINE_INSTANCE_STATUS,
  MachineInstance,
  MachineInstanceStatus,
} from 'src/core/types/machine-instance-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { reactive, ref } from 'vue'
import { format } from 'date-fns'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import {
  httpsGetListTeamGroup,
  httpsGetMachineInstancesDetail,
  httpsGetMachineInstancesList,
  httpsPauseMachineInstances,
  httpsResumeMachineInstances,
  httpsShutdownMachineInstances,
  httpsStartdownMachineInstances,
} from 'src/core/services/machine-services'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { useSearchStore } from 'src/core/stores/search'
import { TablePagination } from 'src/core/types/pagging-types'
import { useAuthStore } from 'src/core/stores/auth'
import { useCloudPCMachineImages } from './use-machine-images'
import { MachineImage } from 'src/core/types/machine-image-types'
import { MACHINE_INSTANCE_STATUS_CONFIGURATIONS } from 'src/core/utils/machine-instance-status'
import { ShutdownMachineInstanceRequest } from 'src/core/types/services/machine-types'

const modal = reactive<{
  open: boolean
  type:
    | 'VIEW_MACHINE_INSTANCE_MODAL'
    | 'RUN_ANOTHER_MACHINE_MODAL'
    | 'SUCCESS_LAUNCH_MACHINE_MODAL'
    | 'SHOW_CONFIRM_SHUTDOWN_MODAL'
}>({
  open: false,
  type: 'VIEW_MACHINE_INSTANCE_MODAL',
})
const drawer = reactive<{
  type: 'VIEW_MACHINE_INSTANCE_MODAL'
}>({
  type: 'VIEW_MACHINE_INSTANCE_MODAL',
})

const activeMachineInstance = useStorage<MachineInstance>(
  'cloud-pc-activeMachineInstance',
  {} as MachineInstance,
  sessionStorage
)
const selectedMachineInstances = ref<MachineInstance[]>([])

export function useCloudPCMachineInstances() {
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

  function onShowConfirmShutdown() {
    modal.type = 'SHOW_CONFIRM_SHUTDOWN_MODAL'
    modal.open = true
  }

  function onViewDetail(MachineInstance: MachineInstance) {
    activeMachineInstance.value = MachineInstance
    modal.type = 'VIEW_MACHINE_INSTANCE_MODAL'
    modal.open = true
  }

  async function handleGetMachineInstances(
    category: 'History' | 'Current' | 'WaitingInQueue' | 'Paused' | 'Running',
    currentPaging?: TablePagination,
    keyword?: string,
    userName?: string
  ) {
    try {
      loading.value = true

      const data = await httpsGetMachineInstancesList({
        category,
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        instanceName: keyword ?? searchKeyword.value,
        createdBy: userName ?? '',
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })

        return data?.data?.list?.map((item) => {
          return {
            ...item,
            statusDetail: matchingMachineInstanceStatus(item.status),
            gmtStartByString: item.startTime
              ? format(
                  new Date(item.startTime * 1000 || ''),
                  'MMM dd, yyyy HH:mm:ss'
                ).toString()
              : '',
            gmtEndByString: item.endTime
              ? format(
                  new Date(item.endTime * 1000 || ''),
                  'MMM dd, yyyy HH:mm:ss'
                ).toString()
              : '',
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

  function matchingMachineInstanceStatus(status: MachineInstanceStatus) {
    return MACHINE_INSTANCE_STATUS_CONFIGURATIONS[
      MACHINE_INSTANCE_STATUS[status]
    ]
  }

  async function handleGetMachineInstanceDetail(instanceId: string) {
    try {
      loading.value = true

      const data = await httpsGetMachineInstancesDetail(instanceId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return {
          ...data?.data,
          startTimeString: data?.data.startTime
            ? format(
                new Date(Number(data?.data.startTime) * 1000 || ''),
                'MMM dd, yyyy HH:mm:ss'
              ).toString()
            : '',
          endTimeString: data?.data.endTime
            ? format(
                new Date(Number(data?.data.endTime) * 1000 || ''),
                'MMM dd, yyyy HH:mm:ss'
              ).toString()
            : '',
        }
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

  async function handleStartdownInstance(instanceId: string | undefined) {
    try {
      if (!instanceId) {
        errorHandler.notify('Missing machine instance id')
        return
      }
      loading.value = true

      const data = await httpsStartdownMachineInstances(instanceId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message:
            'This instance is now shuting down. Please check the Instance Info page again later to see if it has become "SHUTDOWN".',
          type: 'positive',
        })
        return true
      }
      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleShutdownInstance(
    payload: ShutdownMachineInstanceRequest
  ) {
    try {
      if (!payload?.machineInstanceId) {
        errorHandler.notify('Missing machine instance id')
        return
      }
      loading.value = true

      const data = await httpsShutdownMachineInstances(payload)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message:
            'This instance is now shuting down. Please check the Instance Info page again later to see if it has become "SHUTDOWN".',
          type: 'positive',
        })
        return true
      }
      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handlePauseInstance(instanceId: string | undefined) {
    try {
      if (!instanceId) {
        errorHandler.notify('Missing machine instance id')
        return
      }
      loading.value = true

      const data = await httpsPauseMachineInstances(instanceId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message:
            'This instance is now pausing. Please check the Instance Info page again later to see if it has become "PAUSED".',
          type: 'positive',
        })
        return true
      }
      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleResumeInstance(instanceId: string | undefined) {
    try {
      if (!instanceId) {
        errorHandler.notify('Missing machine instance id')
        return
      }
      loading.value = true

      const data = await httpsResumeMachineInstances(instanceId)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message:
            'This instance is now resuming.Please check the Instance Info page again later to see if it has become "RUNNING".',
          type: 'positive',
        })
        return true
      }
      return false
    } catch (error) {
      errorHandler.log(error)
      errorHandler.notify(error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleGetListTeamGroup() {
    try {
      loading.value = true

      const data = await httpsGetListTeamGroup()

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

  function onLaunchAnotherCloudPC(instance: MachineImage) {
    const { onRunMachineInstance } = useCloudPCMachineImages()

    onCloseModal()

    onRunMachineInstance(instance)
  }

  return {
    modal,
    loading,
    pagination,
    searchKeyword,
    activeMachineInstance,
    selectedMachineInstances,
    onViewDetail,
    onCloseModal,
    handlePauseInstance,
    handleResumeInstance,
    onShowConfirmShutdown,
    handleGetListTeamGroup,
    handleShutdownInstance,
    onLaunchAnotherCloudPC,
    handleStartdownInstance,
    handleGetMachineInstances,
    handleGetMachineInstanceDetail,
  }
}
