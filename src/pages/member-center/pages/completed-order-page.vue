<template>
  <stripe-payment-form
    v-if="selectedPaymentOption === 'STRIPE'"
    :amount="packageAmount"
    :payment-type="'CHECKOUT'"
    @cancel="onCancelStripePaymentProcess"
    @false="onShowFalseCard"
    @success="onShowSuccessCard"
  ></stripe-payment-form>
  <amazon-payment-form
    v-if="selectedPaymentOption === 'AMAZON_PAY'"
    :amount="packageAmount"
    :payment-type="'CHECKOUT'"
    @close="onCancelStripePaymentProcess"
    @false="onShowFalseCard"
    @success="onShowSuccessCard"
  ></amazon-payment-form>
  <bank-transfer-form
    v-if="selectedPaymentOption === 'BANK_TRANSFER'"
    @cancel="onCancelBankTransferProcess"
  ></bank-transfer-form>
  <coin-payment-form
    v-if="selectedPaymentOption === 'COIN'"
    :coin="packageCoinAmount"
    :expire-date-of-day="packageTotalDay"
    :member-info-id="subscriptionId"
    :status="1"
    @close="onCloseCoinPaymentProcess"
    @success="onShowSuccessCard"
  ></coin-payment-form>
  <wallet-payment-form
    v-if="selectedPaymentOption === 'WALLET'"
    :amount="packageAmount"
    :expire-date-of-day="packageTotalDay"
    :member-info-id="subscriptionId"
    @cancel="onCancelWalletPaymentProcess"
    @success="onShowSuccessCard"
  ></wallet-payment-form>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive } from 'vue'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { MEMBER_CENTER_ROUTE_NAMES } from 'src/core/router/routes'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import { httpsGetSubscriptionRecords } from 'src/core/services/member-center-services'
import CoinPaymentForm from 'src/pages/payment/components/coin-payment-form.vue'
import BankTransferForm from 'src/pages/payment/components/bank-transfer-form.vue'
import WalletPaymentForm from 'src/pages/payment/components/wallet-payment-form.vue'
import StripePaymentForm from 'src/pages/payment/components/stripe-payment-form.vue'
import AmazonPaymentForm from 'src/pages/payment/components/amazon-payment-form.vue'

// composables
const route = useRoute()
const router = useRouter()

// data
const subscriptionData: {
  subscriptions: Subscription[]
  selector: { [key: string | number]: SubscriptionPack[] }
} = reactive({
  subscriptions: [],
  selector: {},
})

const selectedSubscription = computed(() => {
  return subscriptionData.subscriptions.find((item) => {
    return item.mcMemberInfoId == route.query.subscription
  })
})

const selectedPack = computed(() => {
  return selectedSubscription.value?.subscriptionPackages?.find((item) => {
    return item.id == route.query.pack
  })
})

const packageAmount = computed(() => {
  return selectedPack.value?.price || 0
})

const selectedPaymentOption = computed(() => {
  return route.query?.payment
})

const packageCoinAmount = computed(() => {
  return selectedPack.value?.price
    ? parseFloat(selectedPack.value?.price.toString()) * 10
    : 0
})

const packageTotalDay = computed(() => {
  return selectedPack.value?.totalDay || 0
})

const subscriptionId = computed(() => {
  return selectedSubscription.value?.mcMemberInfoId || undefined
})

// methods
async function fetchSubscriptions() {
  const data = await httpsGetSubscriptionRecords()
  if (data?.code === RESPONSE_CODE.SUCCESS) {
    subscriptionData.subscriptions = data?.data?.list
    subscriptionData.selector = data?.selector
  }
}

function onCancelBankTransferProcess() {
  router.push({ name: MEMBER_CENTER_ROUTE_NAMES.SUBSCRIPTIONS })
}

function onCloseCoinPaymentProcess() {
  router.push({ name: MEMBER_CENTER_ROUTE_NAMES.SUBSCRIPTIONS })
}

function onCancelWalletPaymentProcess() {
  router.push({ name: MEMBER_CENTER_ROUTE_NAMES.SUBSCRIPTIONS })
}

function onCancelStripePaymentProcess() {
  router.push({ name: MEMBER_CENTER_ROUTE_NAMES.SUBSCRIPTIONS })
}

function onShowSuccessCard() {
  console.log('Close something')
}

function onShowFalseCard() {
  console.log('Close something')
}

//hooks
onMounted(async () => {
  await fetchSubscriptions()
})
</script>
