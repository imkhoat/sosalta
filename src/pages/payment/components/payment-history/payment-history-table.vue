<template>
  <q-card
    flat
    class="payment-history-table full-width"
  >
    <q-card-section>
      <div
        class="member-users-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >History list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select object.</span
        >
      </div>
      <payment-history-filter
        v-model="filterContent"
        @search="onPaginationRequest({ filter: filterContent, pagination })"
      ></payment-history-filter>
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
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              v-if="!props.row.isCompletedStatus"
              outline
              color="negative"
              size="sm"
              class="text-weight-bold text-body2"
              >{{ props.row.orderStatusString }}</q-chip
            >
            <q-btn
              v-else
              color="positive"
              unelevated
              size="sm"
              @click="onGenerateInvoice(props.row)"
              >Invoice</q-btn
            >
          </q-td>
        </template>
        <template v-slot:body-cell-payment-method="props">
          <td
            class="text-caption"
            v-html="props.row.payMethodString"
          ></td>
        </template>
        <template v-slot:body-cell-detail="props">
          <td
            class="text-caption"
            v-html="props.row.detailPayment"
          ></td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { computed, reactive } from 'vue'
import { PaymentHistory } from 'src/core/types/payment-history-types'
import { usePayment } from 'src/pages/payment/hooks/use-payment'
import PaymentHistoryFilter from 'src/pages/payment/components/payment-history/payment-history-filter.vue'

// composables
const { pagination } = usePayment()

// props & emits
const props = defineProps<{
  items: PaymentHistory[] | undefined
  loading: boolean
}>()
const emits = defineEmits(['select', 'request', 'invoice'])
// data
const filterContent = reactive<{
  status?: 'TRADE_SUCCESS' | ''
  keyword?: string
}>({
  status: '',
  keyword: '',
})

const columns = computed<QTableColumn[]>(() => {
  return [
    {
      name: 'date',
      field: 'gmtLoggingTimeString',
      label: 'Date',
      classes: 'operation-column operation-column__date-create',
      headerClasses:
        'operation-column-header operation-column-header__date-create',
      required: true,
      align: 'left',
    },
    {
      name: 'type',
      field: 'typeString',
      label: 'Type',
      classes: 'operation-column operation-column__ip',
      headerClasses: 'operation-column-header operation-column-header__ip',
      required: true,
      align: 'left',
    },
    {
      name: 'order-no',
      field: 'outTradeNo',
      label: 'Order No.',
      classes: 'operation-column operation-column__browser',
      headerClasses: 'operation-column-header operation-column-header__browser',
      required: true,
      align: 'left',
    },
    {
      name: 'detail',
      field: 'detailPayment',
      label: 'Detail',
      classes: 'operation-column operation-column__os',
      headerClasses: 'operation-column-header operation-column-header__os',
      required: true,
      align: 'left',
    },
    {
      name: 'payment-method',
      field: 'payMethodString',
      label: 'Payment methods',
      classes: 'operation-column operation-column__activities',
      headerClasses:
        'operation-column-header operation-column-header__activities',
      required: true,
      align: 'left',
    },
    {
      name: 'coins',
      field: 'coinString',
      label: 'Coins',
      classes: 'operation-column operation-column__activities',
      headerClasses:
        'operation-column-header operation-column-header__activities',
      required: true,
      align: 'left',
    },
    {
      name: 'status',
      field: 'orderStatusString',
      label: 'Status',
      classes: 'operation-column operation-column__activities',
      headerClasses:
        'operation-column-header operation-column-header__activities',
      required: true,
      align: 'left',
    },
    {
      name: 'original-price',
      field: 'originalPriceString',
      label: 'Original Price',
      classes: 'operation-column operation-column__activities',
      headerClasses:
        'operation-column-header operation-column-header__activities',
      required: true,
      align: 'left',
    },
    {
      name: 'actual-price',
      field: 'totalPriceString',
      label: 'Actual Price',
      classes: 'operation-column operation-column__activities',
      headerClasses:
        'operation-column-header operation-column-header__activities',
      required: true,
      align: 'left',
    },
  ]
})

// methods
function onGenerateInvoice(item: PaymentHistory) {
  emits('invoice', item)
}
function onPaginationRequest(props: {
  filter?: {
    status?: 'TRADE_SUCCESS' | ''
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
.payment-history-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
