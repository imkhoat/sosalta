import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { httpsGetImportProgressList } from 'src/core/services/storage-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { ImportStatus } from 'src/core/types/import-object-types'
import { TablePagination } from 'src/core/types/pagging-types'
import { storeToRefs } from 'pinia'
import { usePaginationStore } from 'src/core/stores/pagination'

export function useImportProgress() {
  const loading = ref(false)
  const { pagination } = storeToRefs(usePaginationStore())

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
    status?: string
  ) {
    try {
      loading.value = true
      const data = await httpsGetImportProgressList({
        limit: currentPaging?.rowsPerPage ?? pagination.value?.rowsPerPage,
        page: currentPaging?.page ?? pagination.value?.page,
        status: status,
      })

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        return (
          data?.data?.list.map((item) => {
            return {
              ...item,
              gmtStartTimeString: format(
                new Date(item.startTime || ''),
                'MMM dd, yyyy hh:mm'
              ).toString(),
              gmtEndTimeString: format(
                new Date(item.gmtCreate || ''),
                'MMM dd, yyyy hh:mm'
              ).toString(),
              statusString: importStatus.value.get(
                item?.status?.toString() as ImportStatus
              ),
            }
          }) ?? []
        )
      }
      return []
    } catch (error) {
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    handleFetchingData,
  }
}
