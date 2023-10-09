<template>
  <q-card
    flat
    class="note-view-table q-pa-sm bg-grey-1 full-height rounded-borders"
  >
    <q-card-section>
      <q-table
        flat
        bordered
        :rows="noteContent?.rows"
        :columns="noteContent?.columns"
        hide-bottom
        row-key="id"
        binary-state-sort
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ props.row[col.name] }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar, QTableColumn } from 'quasar'
import { computed } from 'vue'
import { Note } from 'src/core/types/note-types'

interface TableContent {
  columns?: QTableColumn[]
  rows?: { id: number }[]
}
// composable
const $q = useQuasar()

// props
const props = defineProps<{
  item: Note
  expand: boolean
}>()

// computed
const noteContent = computed(() => {
  const content = JSON.parse(props?.item?.noteValue.toString()) as {
    value: string
  }
  return content?.value as TableContent
})
</script>
<style lang="scss">
.note-view-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
