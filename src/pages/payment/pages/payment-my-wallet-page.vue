<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-entries-page"
  >
    <q-page-header
      title="My wallet"
      subtitle="Manager your payments"
    >
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <div class="row q-col-gutter-md items-stretch">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 q-pb-md flex items-stretch">
        <my-cash-card
          :item="balance"
          class="full-height full-width"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 q-pb-md flex items-stretch">
        <my-coin-card
          :item="coin"
          class="full-height full-width"
        />
      </div>
      <div
        class="col-12 col-sm-12 col-md-8 col-lg-6 q-pb-md flex items-stretch"
      >
        <my-unpaid-card
          :item="balance"
          class="full-height full-width"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { usePayment } from 'src/pages/payment/hooks/use-payment'
import { Balance } from 'src/core/types/services/payment-types'
import MyCashCard from 'src/pages/payment/components/my-wallet/my-cash-card.vue'
import MyCoinCard from 'src/pages/payment/components/my-wallet/my-coin-card.vue'
import MyUnpaidCard from 'src/pages/payment/components/my-wallet/my-unpaid-card.vue'

const { handleGetTotalBalance, handleGetTotalCoinAmount } = usePayment()

// data
const coin = ref<string | number>(0)
const balance = ref<Balance>()

// computed

async function onFetchingData() {
  coin.value = await handleGetTotalCoinAmount()
  balance.value = await handleGetTotalBalance()
}

onFetchingData()
</script>
