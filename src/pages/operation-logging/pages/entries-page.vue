<template>
  <div
    class="column items-stretch justify-start full-height no-wrap operation-logging-page"
  >
    <q-page-header
      title="Operation logging"
      subtitle="Monitoring and managing the operation logging of user and members"
    >
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <operation-logging-table
      :loading="loading"
      :items="operationLoggings"
      @request="onFetchingData($event.pagination, $event.filter)"
    ></operation-logging-table>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useOperationLogging } from 'src/pages/operation-logging/hooks/use-operation-logging'
import OperationLoggingTable from 'src/pages/operation-logging/components/operation-logging-table.vue'
import { TablePagination } from 'src/core/types/pagging-types'

// composables
const $q = useQuasar()
const { loading, operationLoggings, handleFetchingData } = useOperationLogging()

// data

// method
async function onFetchingData(
  pagination?: TablePagination,
  filter?: {
    fromDate: string
    toDate: string
    userName: string
    keyword: string
  }
) {
  console.log(pagination)
  await handleFetchingData(pagination, filter)
}

onFetchingData()
</script>
