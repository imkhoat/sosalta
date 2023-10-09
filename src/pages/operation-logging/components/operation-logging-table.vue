<template>
  <q-card
    flat
    class="operation-logging-table full-width"
  >
    <q-card-section>
      <div
        class="member-users-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Logging list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select object.</span
        >
      </div>
      <operation-logging-filter
        v-model="filterContent"
        @search="onPaginationRequest({ filter, pagination })"
      ></operation-logging-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        flat
        bordered
        class="full-width"
        :columns="columns"
        :rows="items"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-operation_name="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <div class="row justify-start items-center no-wrap">
              <q-avatar
                size="lg"
                color="grey-1"
              >
                <q-avatar
                  size="md"
                  color="grey-3"
                  icon="sym_o_description"
                ></q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.fileName }}</strong>
                <span class="text-caption text-disable">{{
                  props.row.fileURL
                }}</span>
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-user_role="props">
          <q-td :props="props">
            <q-chip
              outline
              :color="props.row.roleName === 'orgUser' ? 'primary' : 'positive'"
              size="sm"
              class="text-weight-bold text-body2"
              >{{ props.row.roleNameString }}</q-chip
            >
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { computed, reactive } from 'vue'
import { OperationLogging } from 'src/core/types/operation-logging-types'
import { useOperationLogging } from 'src/pages/operation-logging/hooks/use-operation-logging'
import OperationLoggingFilter from 'src/pages/operation-logging/components/operation-logging-filter.vue'
// composables
const { pagination, loading } = useOperationLogging()

// props & emits
const props = defineProps<{
  items: OperationLogging[] | undefined
}>()
const emits = defineEmits(['select', 'request'])
// data
const filterContent = reactive<{
  fromDate?: string
  toDate?: string
  userName?: string
  keyword?: string
}>({
  fromDate: '',
  toDate: '',
  userName: '',
  keyword: '',
})

const columns = computed<QTableColumn[]>(() => {
  return [
    {
      name: 'create_at',
      field: 'gmtLoggingTimeString',
      label: 'Logging time',
      classes: 'operation-column operation-column__date-create',
      headerClasses:
        'operation-column-header operation-column-header__date-create',
      required: true,
      align: 'left',
    },
    {
      name: 'operation_ip',
      field: 'ip',
      label: 'IP',
      classes: 'operation-column operation-column__ip',
      headerClasses: 'operation-column-header operation-column-header__ip',
      required: true,
      align: 'left',
    },
    {
      name: 'operation_browser',
      field: 'browserName',
      label: 'Browser',
      classes: 'operation-column operation-column__browser',
      headerClasses: 'operation-column-header operation-column-header__browser',
      required: true,
      align: 'left',
    },
    {
      name: 'operation_os',
      field: 'os',
      label: 'OS',
      classes: 'operation-column operation-column__os',
      headerClasses: 'operation-column-header operation-column-header__os',
      required: true,
      align: 'left',
    },
    {
      name: 'operation_activities',
      field: 'actionString',
      label: 'Activities',
      classes: 'operation-column operation-column__activities',
      headerClasses:
        'operation-column-header operation-column-header__activities',
      required: true,
      align: 'left',
    },
  ]
})

// methods
function onPaginationRequest(props: {
  filter?: {
    fromDate?: string
    toDate?: string
    userName?: string
    keyword?: string
  }
  pagination?: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
  }
  getCellValue: (col: any, row: any) => any
}) {
  emits('request', props)
}
</script>
<style lang="scss">
.operation-logging-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
