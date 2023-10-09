<template>
  <q-card
    flat
    class="payment-history-table full-width"
  >
    <q-card-section class="q-pb-none">
      <div class="member-users-header__title column justify-center items-start">
        <span class="subtitle text-caption text-disable"
          >Overview payments.</span
        >
      </div>
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
        <template v-slot:body-cell-un-paid_string="props">
          <td
            class="text-caption text-negative"
            v-html="props.row.unPaidString"
          ></td>
        </template>
        <template v-slot:body-cell-payment_action="props">
          <td class="text-center">
            <q-btn
              flat
              round
              size="sm"
              class="text-normal text-primary"
              @click="onViewDetailPayment(props.row)"
            >
              <q-icon name="sym_o_info"></q-icon>
            </q-btn>
          </td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { computed } from 'vue'
import { PaymentDetailData } from 'src/core/types/payment-detail-data-types'
import { usePayment } from 'src/pages/payment/hooks/use-payment'

// composables
const { pagination } = usePayment()

// props & emits
defineProps<{
  items: PaymentDetailData[] | undefined
  loading: boolean
}>()
const emits = defineEmits(['select', 'request', 'view'])

// computed
const columns = computed<QTableColumn[]>(() => {
  return [
    {
      name: 'detail_month',
      field: 'monthString',
      label: 'Month',
      classes: 'payment-detail-column payment-detail-column__detail-month',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__detail-month',
      required: true,
      align: 'left',
    },
    {
      name: 'detail_monthly_total',
      field: 'managerMonthlyFeeString',
      label: 'Original Monthly Total',
      classes:
        'payment-detail-column payment-detail-column__detail-monthly-total',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__detail-monthly-total',
      required: true,
      align: 'left',
    },
    {
      name: 'already_paid_string',
      field: 'alreadyPaidString',
      label: 'Already Paid',
      classes:
        'payment-detail-column payment-detail-column__already-paid-string',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__already-paid-string',
      required: true,
      align: 'left',
    },
    {
      name: 'un-paid_string',
      field: 'unPaidString',
      label: 'Unpaid',
      classes: 'payment-detail-column payment-detail-column__un-paid-string',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__un-paid-string',
      required: true,
      align: 'left',
    },
    {
      name: 'payment_action',
      field: 'actions',
      label: 'Actions',
      classes: 'payment-detail-column payment-detail-column__payment-action',
      headerClasses:
        'payment-detail-column-header payment-detail-column-header__payment-action',
      required: true,
      align: 'center',
    },
  ]
})

// methods
function onViewDetailPayment(item: PaymentDetailData) {
  emits('view', item)
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
