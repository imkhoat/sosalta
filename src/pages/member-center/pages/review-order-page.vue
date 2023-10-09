<template>
  <checkout-payment-form
    :subscription="selectedSubscription"
    :pack="selectedPack"
    class="full-height"
  ></checkout-payment-form>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, onMounted, reactive } from 'vue'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import { httpsGetSubscriptionRecords } from 'src/core/services/member-center-services'
import CheckoutPaymentForm from 'src/pages/member-center/components/checkout-payment-form.vue'

// composables
const route = useRoute()

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

// methods
async function fetchSubscriptions() {
  const data = await httpsGetSubscriptionRecords()
  if (data?.code === RESPONSE_CODE.SUCCESS) {
    subscriptionData.subscriptions = data?.data?.list
    subscriptionData.selector = data?.selector
  }
}

//hooks
onMounted(async () => {
  await fetchSubscriptions()
})
</script>
