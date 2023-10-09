<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-entries-page"
  >
    <q-page-header
      title="Payment detail"
      subtitle="Manager your payments"
    >
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <div class="row q-col-gutter-md items-stretch">
      <div class="col-12 col-sm-12 col-md-3 q-pb-md flex items-stretch">
        <total-unpaid-card
          :item="balance"
          class="full-height full-width"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-3 q-pb-md flex items-stretch">
        <total-billed-card
          :item="billedTotal"
          class="full-height full-width"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-6 q-pb-md flex items-stretch">
        <total-cash-card
          :item="balance"
          :coin="coin"
          class="full-height full-width"
        />
      </div>
      <div class="col-12">
        <payment-detail-table
          :items="details"
          :loading="loading"
          @view="onViewInvoice"
        ></payment-detail-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { usePayment } from 'src/pages/payment/hooks/use-payment'
import { Balance } from 'src/core/types/services/payment-types'
import TotalCashCard from 'src/pages/payment/components/payment-detail/total-cash-card.vue'
import TotalBilledCard from 'src/pages/payment/components/payment-detail/total-billed-card.vue'
import TotalUnpaidCard from 'src/pages/payment/components/payment-detail/total-unpaid-card.vue'
import PaymentDetailTable from 'src/pages/payment/components/payment-detail/payment-detail-table.vue'
import { PaymentDetailData } from 'src/core/types/payment-detail-data-types'
import { useRouter } from 'vue-router'
import { PAYMENT_ROUTE_NAMES } from '../router'

// computed
const router = useRouter()
const {
  handleGetTotalBalance,
  handleGetTotalCoinAmount,
  handleGetBilledTotal,
  handleGetPaymentDetails,
  loading,
} = usePayment()

// data
const coin = ref<string | number>(0)
const balance = ref<Balance>()
const billedTotal = ref<string | number>()
const details = ref<PaymentDetailData[]>([])
// computed

async function onFetchingData() {
  coin.value = await handleGetTotalCoinAmount()
  balance.value = await handleGetTotalBalance()
  billedTotal.value = await handleGetBilledTotal()
  details.value = await handleGetPaymentDetails()
}

function onViewInvoice() {
  router.push({ name: PAYMENT_ROUTE_NAMES.HISTORY_INVOICE })
}
onFetchingData()
</script>
