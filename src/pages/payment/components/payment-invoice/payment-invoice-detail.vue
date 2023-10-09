<template>
  <q-card
    flat
    class="payment-history-table full-width"
  >
    <q-card-section>
      <q-table
        flat
        bordered
        class="full-width"
        :columns="columns"
        :rows="rows"
      >
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { computed } from 'vue'
import { usePayment } from 'src/pages/payment/hooks/use-payment'
import { Invoice } from 'src/core/types/invoice-types'
import { PaymentHistory } from 'src/core/types/payment-history-types'

// composables
const { pagination } = usePayment()

// props & emits
const props = defineProps<{
  item: Invoice,
  receipt: {
    no: string
    date: string
    order: string
    history?: PaymentHistory
  }
}>()
const emits = defineEmits(['select', 'request', 'view'])

// computed
const columns = computed<QTableColumn[]>(() => {
  return [
    {
      name: 'detail_month',
      field: 'subject',
      label: 'DESCRIPTION',
      classes: 'payment-detail-column payment-detail-column__detail-month',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__detail-month',
      required: true,
      align: 'left',
    },
    {
      name: 'detail_monthly_total',
      field: 'managerMonthlyFeeString',
      label: 'SG COINS',
      classes:
        'payment-detail-column payment-detail-column__detail-monthly-total',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__detail-monthly-total',
      required: true,
      align: 'left',
    },
    {
      name: 'already_paid_string',
      field: 'originalPriceString',
      label: 'ORIGINAL PRICE',
      classes:
        'payment-detail-column payment-detail-column__already-paid-string',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__already-paid-string',
      required: true,
      align: 'left',
    },
    {
      name: 'un-paid_string',
      field: 'totalPriceString',
      label: 'TOTAL',
      classes: 'payment-detail-column payment-detail-column__un-paid-string',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__un-paid-string',
      required: true,
      align: 'left',
    },
  ]
})

const rows = computed(() => {
  return [props.receipt?.history]
})

// methods
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
