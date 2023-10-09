<template>
  <q-card
    flat
    class="checkout-subscription-detail q-px-md"
  >
    <q-card-section
      class="checkout-subscription-detail__title column row-md no-wrap justify-start items-start items-start-md"
    >
      <div class="column justify-start items-start">
        <strong class="text-weight-bold text-h5">
          {{ subscriptionName }}
          <q-badge
            color="grey-1"
            text-color="primary"
            >{{ $t('pages.memberCenter.checkout.Recommend') }}</q-badge
          >
        </strong>
        <span class="text-caption text-disable">{{
          $t('pages.memberCenter.checkout.Our most popular plan for small team')
        }}</span>
      </div>
      <q-space></q-space>
      <!-- <div class="row justify-start items-end">
        <strong class="text-h4 text-weight-bold"
          >${{ subscriptionPackPrice }}</strong
        >
        <span class="text-caption q-ml-xs"
          >/{{
            $t('pages.memberCenter.checkout.ExpiredDay', {
              days: subscriptionPackExpired,
            })
          }}</span
        >
      </div> -->
    </q-card-section>
    <q-card-section class="column no-wrap justify-between items-stretch">
      <div class="column justify-start items-start">
        <strong class="text-caption text-weight-bold">{{
          $t('pages.memberCenter.checkout.FEATURES')
        }}</strong>
        <span class="text-caption">
          {{ $t('pages.memberCenter.checkout.Everything in our') }}
          <strong>{{ $t('pages.memberCenter.checkout.FREE plan') }}</strong>
          {{ $t('pages.memberCenter.checkout.plus') }}
        </span>
      </div>
      <div class="row q-mt-md">
        <div
          v-for="(feature, index) in features"
          :key="index + '_subscription_feature'"
          class="col-12 col-md-6 q-py-xs text-caption"
        >
          <q-avatar
            size="xs"
            color="positive"
            text-color="white"
            icon="r_check"
            class="q-mr-xs text-weight-bold"
          ></q-avatar>
          {{ feature }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'

// props & emits
const props = defineProps<{
  subscription?: Subscription
  pack: SubscriptionPack | undefined
  packs?: SubscriptionPack[]
}>()

// computed
const features = computed(() => {
  return [
    `${props.subscription?.hardDiskSize} Hard Disk Size`,
    `${props.subscription?.maxCloudpcsNumber} Max Cloudpcs Number`,
    `${props.subscription?.maxAllowedUnpaidFee} Max Allowed Unpaid Fee`,
    `${props.subscription?.maxAnalysisAppsNumber} Max Analysis Apps Number`,
    `${props.subscription?.maxCloudpcHourlyCharge} Max Cloudpc Hourly Charge`,
    `${props.subscription?.maxCloudpcsNumber} Max Cloudpcs Number`,
    `${props.subscription?.maxMemberAccountNumber} Max Member Account Number`,
    `${props.subscription?.maxStorageCapacity} Max Storage Capacity`,
    `${props.subscription?.serviceCharge} Service Charge`,
    `${props.subscription?.support} Support`,
  ]
})

const subscriptionName = computed(() => {
  return `${props.subscription?.typeNote} subscription level`
})
</script>
<style lang="scss">
.checkout-subscription-detail {
  &__title {
    border-bottom: 1px solid $primary-05;
  }

  &__title-selector {
    margin-top: -8px;
  }
}
</style>
