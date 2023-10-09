import { computed, ref } from 'vue'
import { format } from 'date-fns'
import {
  httpsGetOperationLogging,
  httpsGetMemberUsers,
} from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { ImportStatus } from 'src/core/types/import-object-types'
import { TablePagination } from 'src/core/types/pagging-types'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'
import { errorHandler } from 'src/core/utils/error-handler'
import { useAuthStore } from 'src/core/stores/auth'
import { OperationLogging } from 'src/core/types/operation-logging-types'

export function useOperationLogging() {
  const loading = ref(false)
  const { pagination } = storeToRefs(usePaginationStore())
  const { getUserInformation } = storeToRefs(useAuthStore())
  const { resetPagination, updatePagination } = usePaginationStore()

  //reset state
  resetPagination()

  // data
  const operationLoggings = ref<OperationLogging[]>([])

  const importStatus = computed(() => {
    const colorMap = new Map<ImportStatus, string>([
      ['1', 'Importing'],
      ['2', 'Imported'],
      ['3', 'Fail'],
      ['4', 'Cancelled'],
    ])

    return colorMap
  })

  async function handleFetchingData(
    currentPaging?: TablePagination,
    filter?: {
      fromDate: string
      toDate: string
      userName: string
      keyword: string
    }
  ) {
    try {
      loading.value = true
      const data = await httpsGetOperationLogging({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        ...filter,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        operationLoggings.value =
          data?.data?.list.map((item) => {
            return {
              ...item,
              gmtLoggingTimeString: format(
                new Date(Number(item.timeStamp) * 100 || ''),
                'MMM dd, yyyy hh:mm'
              ).toString(),
            }
          }) ?? []

        updatePagination({
          rowsPerPage: data?.data.pageSize,
          page: data?.data?.currPage,
          rowsNumber: data?.data?.totalCount,
        })
      }
    } catch (error) {
      errorHandler.log(error)
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

  return {
    loading,
    pagination,
    operationLoggings,
    handleFetchingData,
    handleGetManagingUsersWithMe,
  }
}
