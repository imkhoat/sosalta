<template>
  <q-card
    flat
    class="project-note-table"
  >
    <q-card-section class="q-px-none q-pb-none">
      <q-table
        flat
        bordered
        :rows="tableData.rows"
        :columns="tableData.columns"
        hide-bottom
        row-key="id"
        selection="multiple"
        v-model:selected="selectedRows"
        binary-state-sort
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th class="text-left">
              <q-checkbox
                v-model="props.selected"
                @click="props.selected = !props.selected"
              />
            </q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
              <q-btn
                rounded
                round
                flat
                size="sm"
                icon="sym_o_delete"
                @click="onDeleteColumn(col)"
              ></q-btn>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox
                v-model="props.selected"
                :val="props.row.id"
                @click="props.selected = !props.selected"
              />
            </q-td>
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ props.row[col.name] }}
              <q-popup-edit
                v-model="props.row[col.name]"
                v-slot="scope"
                :offset="[0, 10]"
              >
                <q-input
                  label="Value"
                  outlined
                  v-model="scope.value"
                  dense
                  autofocus
                  hint="Input and press enter"
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions
      class="q-px-none row justify-end items-center q-gutter-x-xs"
    >
      <q-btn
        size="sm"
        class="bg-grey-1"
        flat
        @click="onUndo"
        >Undo</q-btn
      >
      <q-btn
        size="sm"
        class="bg-grey-1"
        flat
        @click="onRedo"
        >Redo</q-btn
      >
      <q-separator
        inset
        vertical
      ></q-separator>
      <q-btn
        size="sm"
        class="bg-grey-1"
        flat
        @click="onAddNewRow"
        >Add row</q-btn
      >
      <q-btn
        size="sm"
        class="bg-grey-1"
        flat
        @click="onAddNewColumn"
        >Add column</q-btn
      >
      <q-separator
        inset
        vertical
      ></q-separator>
      <q-btn
        size="sm"
        class="bg-grey-1"
        flat
        @click="onDeleteRowColumn"
        >Delete</q-btn
      >
      <q-separator
        inset
        vertical
      ></q-separator>
      <q-btn
        size="sm"
        class="bg-grey-1"
        flat
        @click="onSumColumn"
        >Sum</q-btn
      >
      <q-btn
        flat
        size="sm"
        class="text-normal text-primary bg-grey-1"
        @click="onShowContextMenu()"
      >
        <q-icon
          size="xs"
          name="more_vert"
        ></q-icon>
        <q-menu
          v-if="!isMobile"
          class="menus-context"
        >
          <q-list dense>
            <q-item
              clickable
              class="row justify-start"
              @click="onSumColumn"
            >
              <q-item-section class="col-grow text-weight-medium q-ml-none"
                >Sum</q-item-section
              >
            </q-item>
            <q-item
              clickable
              class="row justify-start"
              @click="onAverageColumn"
            >
              <q-item-section class="col-grow text-weight-medium q-ml-none"
                >Average</q-item-section
              >
            </q-item>
            <q-separator></q-separator>
            <q-item
              disable
              clickable
              class="row justify-start"
            >
              <q-item-section class="col-grow text-weight-medium q-ml-none"
                >Variance</q-item-section
              >
            </q-item>
            <q-separator></q-separator>
            <q-item
              clickable
              class="row justify-start"
              @click="onQuantityColumn"
            >
              <q-item-section class="col-grow text-weight-medium q-ml-none"
                >Quantity</q-item-section
              >
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useRefHistory } from '@vueuse/core'
import { useQuasar, QTableColumn } from 'quasar'
import { computed, ref, watch } from 'vue'

// composable
const $q = useQuasar()

// props
const props = defineProps<{
  modelValue: {
    value: string
  }[]
}>()
const emits = defineEmits(['update:modelValue'])

//data
const menusDialog = ref(false)
const selectedColumns = ref<string[]>([])
const selectedRows = ref<{ id: number }[]>([])

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const tableData = ref<{
  columns?: QTableColumn[]
  rows?: { id: number }[]
}>({
  columns: [
    {
      name: 'col_1',
      required: true,
      label: 'Column 1',
      align: 'left',
      field: (row: any) => row.name,
    },
    {
      name: 'col_2',
      required: true,
      label: 'Column 2',
      field: (row: any) => row.name,
      align: 'left',
    },
  ],
  rows: [{ id: 0 }, { id: 1 }],
})

const { history, undo, redo } = useRefHistory(tableData, {
  deep: true,
})

//method
function onShowContextMenu() {
  menusDialog.value = !menusDialog.value
}

function onAddNewRow() {
  const newRow = { id: tableData?.value?.rows?.length ?? 0 }
  if (tableData?.value?.rows) {
    tableData.value.rows = [...tableData.value.rows, newRow]
  } else {
    tableData.value.rows = [newRow]
  }
}

function onAddNewColumn() {
  const totalCol = tableData?.value?.columns?.length ?? 0
  const newCol = {
    name: `col_${totalCol + 1}`,
    label: `Column ${totalCol + 1}`,
    required: true,
    field: (row: any) => row.name,
    align: 'left',
  } as QTableColumn

  if (tableData.value?.columns) {
    tableData.value.columns = [...tableData.value.columns, newCol]
  } else {
    tableData.value.columns = [newCol]
  }
}

function onDeleteRowColumn() {
  onDeleteColumns()
  onDeleteRows()
}

function onDeleteRows() {
  if (tableData.value.rows) {
    tableData.value.rows = tableData.value.rows.filter(
      (row) => !selectedRows.value.some((item) => item.id === row.id)
    )
    selectedRows.value = []
  }
}

function onDeleteColumns() {
  if (tableData.value.columns) {
    tableData.value.columns = tableData.value.columns.filter(
      (column) => !selectedColumns.value.includes(column.name)
    )
    selectedColumns.value = []
  }
}

function onDeleteColumn(selectedColumn: QTableColumn) {
  if (tableData.value.columns) {
    tableData.value.columns = tableData.value.columns.filter(
      (column) => selectedColumn.name !== column.name
    )
  }
}

function onUndo() {
  undo()
}

function onRedo() {
  redo()
}

function onSumColumn() {
  if (!tableData?.value?.rows) {
    return
  } else {
    const newSum = new Map()
    newSum.set('id', tableData?.value?.rows?.length ?? 0)

    tableData.value?.columns?.forEach((item) => {
      const summary = _calculateSum(tableData?.value?.rows, item.name)
      newSum.set(item.name, summary)
    })

    tableData.value.rows = [...tableData.value.rows, Object.fromEntries(newSum)]
  }
}

function onAverageColumn() {
  if (!tableData?.value?.rows) {
    return
  } else {
    const newSum = new Map()
    newSum.set('id', tableData?.value?.rows?.length ?? 0)

    tableData.value?.columns?.forEach((item) => {
      const summary = _calculateSum(tableData?.value?.rows, item.name)
      console.log(summary)
      newSum.set(item.name, summary / tableData?.value?.rows?.length ?? 1)
    })

    tableData.value.rows = [...tableData.value.rows, Object.fromEntries(newSum)]
  }
}

function onQuantityColumn() {
  if (!tableData?.value?.rows) {
    return
  } else {
    const newSum = new Map()
    newSum.set('id', tableData?.value?.rows?.length ?? 0)

    tableData.value?.columns?.forEach((item) => {
      const summary = _totalRowCount(tableData?.value?.rows, item.name)
      console.log(summary)
      newSum.set(item.name, summary ?? 0)
    })

    tableData.value.rows = [...tableData.value.rows, Object.fromEntries(newSum)]
  }
}

function _calculateSum(array, property) {
  const total = array.reduce((accumulator, object) => {
    return (
      accumulator + (isNaN(object[property]) ? 0 : Number(object[property]))
    )
  }, 0)

  return total
}

function _totalRowCount(array, property) {
  const total = array.reduce((accumulator, object) => {
    return accumulator + (isNaN(object[property]) ? 0 : 1)
  }, 0)

  return total
}

watch(
  () => tableData.value,
  () => {
    emits('update:modelValue', { value: tableData.value })
  },
  {
    deep: true,
  }
)
</script>
<style lang="scss">
.project-note-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
