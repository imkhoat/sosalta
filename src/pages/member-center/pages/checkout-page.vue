<template>
  <div class="row justify-center items-stretch checkout-page">
    <div class="column col-md-10 col-lg-8">
      <q-stepper
        v-model="currentStep"
        :contracted="$q.screen.lt.md"
        color="primary"
        animated
        class="shadow-0 bg-transparent q-mx-md-xl"
      >
        <q-step
          :name="STEPS.REVIEW_ORDER"
          :title="$t('pages.memberCenter.checkout.Review order')"
          icon="r_admin_panel_settings"
          :done="currentCheckoutStep > STEPS.REVIEW_ORDER"
        ></q-step>

        <q-step
          :name="STEPS.COMPLETED_ORDER"
          :title="$t('pages.memberCenter.checkout.Completed order')"
          icon="r_password"
          :done="currentCheckoutStep > STEPS.COMPLETED_ORDER"
        ></q-step>

        <q-step
          :name="STEPS.THANK_YOU"
          :title="$t('pages.memberCenter.checkout.Thank you')"
          icon="r_verified"
          :done="currentCheckoutStep === STEPS.THANK_YOU"
        ></q-step>
      </q-stepper>
      <div class="checkout-page row items-stretch rounded-borderd">
        <div class="col-12 col-md-8 q-pa-sm">
          <checkout-subscription-detail
            :subscription="selectedSubscription"
            :pack="selectedPack"
            class="full-height"
          ></checkout-subscription-detail>
        </div>
        <div class="col-12 col-md-4 q-pa-sm">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import { httpsGetSubscriptionRecords } from 'src/core/services/member-center-services'
import CheckoutSubscriptionDetail from 'src/pages/member-center/components/checkout-subscription-detail.vue'
import { MEMBER_CENTER_ROUTE_NAMES } from 'src/core/router/routes'

// composables
const route = useRoute()

// data
const STEPS = {
  REVIEW_ORDER: 1,
  COMPLETED_ORDER: 2,
  THANK_YOU: 3,
}
const currentStep = ref(1)
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

const currentRouteName = computed(() => {
  return route.name
})

const currentCheckoutStep = computed(() => {
  switch (route.name) {
    case MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_REVIEW_ORDER:
      return STEPS.REVIEW_ORDER
    case MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_COMPLETED_ORDER:
      return STEPS.COMPLETED_ORDER
    default:
      return STEPS.THANK_YOU
  }
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

watch(
  currentRouteName,
  () => {
    currentStep.value = currentCheckoutStep.value
  },
  { immediate: true, deep: true }
)
</script>
<style lang="scss">
.checkout-page {
  min-height: 70vh;
  .q-stepper__content {
    display: none;
  }
  .q-stepper__header {
    border: none;
  }
}
</style>
