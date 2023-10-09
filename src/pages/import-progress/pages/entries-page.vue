<template>
  <div
    class="column items-stretch justify-start full-height no-wrap import-progress-page"
  >
    <q-page-header
      title="Importing progress"
      subtitle="Monitoring and managing the progress of document import."
    >
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <import-progress-table
      :items="files"
      @request="onFetchingData($event.pagination)"
      @select="onFetchingData(undefined, $event)"
    ></import-progress-table>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useImportProgress } from 'src/pages/import-progress/hooks/use-import-progress'
import ImportProgressTable from 'src/pages/import-progress/components/import-progress-table.vue'
import { ImportObject } from 'src/core/types/import-object-types'
import { TablePagination } from 'src/core/types/pagging-types'

// composables
const $q = useQuasar()
const { loading, handleFetchingData } = useImportProgress()

// data
const files = ref<ImportObject[]>([])

// method
async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string
) {
  files.value = await handleFetchingData(pagination, searchValue)
}

onFetchingData()
</script>
