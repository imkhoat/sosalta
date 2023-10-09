<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-entries-page"
  >
    <q-page-header
      title="Payment history"
      subtitle="Manager your payments"
    >
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <payment-history-table
      :loading="loading"
      :items="history"
      @request="onFetchingData"
      @invoice="onGenerateInvoice"
    ></payment-history-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { usePayment } from '../hooks/use-payment'
import { PaymentHistory } from 'src/core/types/payment-history-types'
import PaymentHistoryTable from 'src/pages/payment/components/payment-history/payment-history-table.vue'
import { TablePagination } from 'src/core/types/pagging-types'
import { useRouter } from 'vue-router'
import { PAYMENT_ROUTE_NAMES } from '../router'
import { useAuthStore } from 'src/core/stores/auth'
import { storeToRefs } from 'pinia'
import { Address } from 'src/core/types/user-info'

const history = ref<PaymentHistory[] | undefined>([])

// state
const { getUserInformation } = storeToRefs(useAuthStore())
// composable
const router = useRouter()
const { loading, handleGetPaymentHistory, onUpdateActiveHistory } = usePayment()

async function onFetchingData(payload?: {
  pagination?: TablePagination
  filter?: {
    status: 'TRADE_SUCCESS' | null
    keyword: string
  }
}) {
  history.value = await handleGetPaymentHistory(
    payload?.pagination,
    payload?.filter
  )
}

function onGenerateInvoice(item: PaymentHistory) {
  const { address, email, userName, phoneNumber } = getUserInformation.value
  const addressObj = JSON.parse(address?.toString()||'') as Address
  const { outTradeNo, gmtLoggingTimeString, subject, originalPriceString, totalPriceString } = item
  onUpdateActiveHistory(item)
  router.push({
    name: PAYMENT_ROUTE_NAMES.HISTORY_INVOICE,
    query: {
      address: address?.toString(),
      name: userName,
      phone: phoneNumber,
      email,
      po: '',
      stress: addressObj?.streetLine1,
      city: addressObj?.cityTown,
      state: addressObj?.state,
      apt: addressObj?.department,
      zip: addressObj?.zipCode,
      country: addressObj?.nation,
      no: outTradeNo,
      date: gmtLoggingTimeString,
      order: outTradeNo,
      subject, originalPriceString, totalPriceString
    },
  })
}
onFetchingData()
</script>
