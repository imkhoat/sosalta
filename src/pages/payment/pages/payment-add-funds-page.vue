<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-entries-page"
  >
    <q-page-header
      title="Add funds"
      subtitle="Manager your payments"
    >
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-9">
        <div class="row items-stretch q-col-gutter-sm">
          <div class="col-12 col-md-6 items-stretch">
            <my-cash-card
              :item="balance"
              class="full-width full-height"
            ></my-cash-card>
          </div>
          <div class="col-12 col-md-6 items-stretch">
            <my-coin-card
              :item="coin"
              class="full-width full-height"
            ></my-coin-card>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3 flex items-stretch justify-end">
        <add-fund-card></add-fund-card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { usePayment } from 'src/pages/payment/hooks/use-payment'
import { Balance } from 'src/core/types/services/payment-types'
import MyCashCard from 'src/pages/payment/components/my-wallet/my-cash-card.vue'
import MyCoinCard from 'src/pages/payment/components/my-wallet/my-coin-card.vue'
import MyUnpaidCard from 'src/pages/payment/components/my-wallet/my-unpaid-card.vue'
import AddFundCard from 'src/pages/payment/components/add-fund/add-fund-card.vue'

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
