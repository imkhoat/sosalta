<template>
  <div
    class="subscriptions-page rounded-borders q-pa-md-xl"
    :class="{ 'bg-background': isMobile, 'bg-white': !isMobile }"
  >
    <div
      class="subscriptions-page__by-feature row q-pb-xl no-wrap items-stretch"
    >
      <div
        class="subscriptions-page__title q-pb-xl col-md-3 col-lg-3 col-xl-2 gt-sm q-pa-xs"
      >
        <subscription-feature-title></subscription-feature-title>
      </div>
      <div
        class="subscriptions-page__feature q-pb-xl col-12 col-md-9 col-lg-9 col-xl-10 row no-wrap-md items-stretch"
      >
        <div
          class="col-12 col-md-3 col-lg-3 col-xl-2 q-pa-sm"
          v-for="(subscription, index) in subscriptionData.subscriptions"
          :key="index + 'subscriptions-page__feature-item'"
        >
          <subscription-feature
            :item="subscription"
            :packs="subscriptionData.selector[subscription.mcMemberInfoId]"
            :dark="
              subscription?.typeNote?.toString()?.toUpperCase() === 'BASIC'
            "
            :class="{
              selected:
                subscription.mcMemberInfoId ===
                subscriptionData.viewingSubscription?.mcMemberInfoId,
            }"
            @select="onSelectSubscription"
            @view-pack="onViewSubscriptionPacks(subscription)"
          ></subscription-feature>
        </div>
      </div>
    </div>
  </div>
  <q-dialog
    v-model="subscriptionPacksModal"
    :full-width="isMobile"
  >
    <subscription-packs
      class="subscriptions-page__packs-card"
      :packs="subscriptionData.viewingPacks"
      :subscription="subscriptionData.viewingSubscription"
      @checkout="onCheckout"
      @close="onCloseDialog"
    ></subscription-packs>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetSubscriptionRecords } from 'src/core/services/member-center-services'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import SubscriptionFeature from 'src/pages/member-center/components/subscription-feature.vue'
import SubscriptionFeatureTitle from 'src/pages/member-center/components/subscription-feature-title.vue'
import SubscriptionPacks from 'src/pages/member-center/components/subscription-packs.vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { MEMBER_CENTER_ROUTE_NAMES } from 'src/core/router/routes'

// composalbe
const $q = useQuasar()
const router = useRouter()

// data
const subscriptionPacksModal = ref(false)
const subscriptionData: {
  subscriptions: Subscription[]
  selector: { [key: string | number]: SubscriptionPack[] }
  viewingSubscription?: Subscription
  viewingPacks?: SubscriptionPack[]
} = reactive({
  subscriptions: [],
  selector: {},
})

//computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
async function fetchSubscriptions() {
  const data = await httpsGetSubscriptionRecords()
  if (data?.code === RESPONSE_CODE.SUCCESS) {
    subscriptionData.subscriptions = data?.data?.list
    subscriptionData.selector = data?.selector
    subscriptionData.viewingSubscription = data?.data?.list[0]
  }
}

function onSelectSubscription(subscription: Subscription) {
  subscriptionData.viewingSubscription = subscription
  router.push({
    name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_REVIEW_ORDER,
    query: {
      subscription: subscriptionData.viewingSubscription?.mcMemberInfoId,
    },
  })
}

function onViewSubscriptionPacks(subscription: Subscription) {
  subscriptionData.viewingSubscription = subscription
  subscriptionData.viewingPacks = subscription.subscriptionPackages
  subscriptionPacksModal.value = true
}

function onCheckout(selectedPack: SubscriptionPack) {
  router.push({
    name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_REVIEW_ORDER,
    query: {
      pack: selectedPack?.id,
      subscription: subscriptionData.viewingSubscription?.mcMemberInfoId,
    },
  })
}

function onCloseDialog() {
  subscriptionPacksModal.value = false
}
//hooks
onMounted(async () => {
  await fetchSubscriptions()
})
</script>
<style lang="scss">
.subscriptions-page {
  &__by-feature {
    gap: map-get($map: $space-md, $key: x);
  }

  &__feature {
    overflow-x: scroll;
    gap: map-get($map: $space-md, $key: x);
  }
  &__packs-card {
    max-width: 80vw !important;
    width: 900px;
  }
}
</style>
