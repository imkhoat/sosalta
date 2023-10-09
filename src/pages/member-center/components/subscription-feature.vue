<template>
  <q-card
    class="subscription-feature full-height no-box-shadow"
    :class="{
      'text-white bg-positive subscription-feature__dark': dark,
      'text-accent': !dark,
    }"
  >
    <q-card-section v-if="loading">
      <q-skeleton
        type="text"
        width="30%"
        class="text-caption"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1 q-mb-md"
      />
      <q-skeleton
        type="text"
        width="30%"
        class="text-caption"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1 q-mb-md"
      />
      <q-skeleton
        type="text"
        width="30%"
        class="text-caption"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1 q-mb-md"
      />
    </q-card-section>
    <template v-else>
      <q-card-section class="subscription-feature__title">
        <div class="column items-center justify-center text-center q-mb-md">
          <q-avatar
            size="54px"
            color="grey-1"
          >
            <q-avatar
              size="44px"
              color="grey-2"
            >
              <q-avatar
                size="32px"
                color="grey-3"
              >
                <q-icon
                  name="sym_o_diamond"
                  size="sm"
                  color="accent"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-avatar>
          <strong>{{ `${typeNote} Level` }}</strong>
          <strong class="text-h4 text-weight-bold">
            {{ monthPriceText }}
          </strong>
          <span class="text-disable">{{
            isVipOrFree ? '&nbsp;' : 'Best for your team'
          }}</span>
        </div>
        <q-btn
          v-if="!isFree"
          unelevated
          :color="dark ? 'white' : 'positive'"
          :text-color="dark ? 'positive' : 'white'"
          class="full-width text-normal"
          @click="onSelectSubscription"
          >{{ subscriptionFeatureButtonText }}</q-btn
        >
      </q-card-section>
      <q-card-section class="subscription-feature__body q-px-md-none">
        <div class="row subscription-feature__group">
          <div class="col-12 text-caption lt-md">Subscription pricing</div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{
              $t('pages.memberCenter.subscription.Subscription Annually Price')
            }}
          </div>
          <div
            class="subscription-feature__value col-4 col-md-12 row column-md justify-end justify-md-start items-baseline items-md-center q-gutter-xs"
          >
            {{ discountAnnuallyPriceText }}
            <q-badge
              v-if="totalDiscountByAnnually"
              :color="dark ? 'white' : 'positive'"
              :text-color="dark ? 'positive' : 'white'"
              class="text-weight-bold"
              >{{ totalDiscountByAnnually }}% off</q-badge
            >
          </div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Subscription Month Price') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ discountMonthPriceText }}
          </div>
        </div>
        <div class="row subscription-feature__group">
          <div class="col-12 text-caption lt-md">Analysis Apps</div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Max Analysis Apps Number') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ maxAnalysisAppsNumber }}
          </div>
        </div>
        <div class="row subscription-feature__group">
          <div class="col-12 text-caption lt-md">Clouds PC</div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{
              $t('pages.memberCenter.subscription.Max Cloudpc Hourly Charge')
            }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ maxCloudpcHourlyCharge }}
          </div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Max Cloudpcs Number') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ maxCloudpcsNumber }}
          </div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Hard Disk Size') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ hardDiskSize }}
          </div>
        </div>
        <div class="row subscription-feature__group">
          <div class="col-12 text-caption lt-md">File system & Member</div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Max Storage Capacity') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ maxStorageCapacity }}
          </div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{
              $t('pages.memberCenter.subscription.Max Member Account Number')
            }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ maxMemberAccountNumber }}
          </div>
        </div>
        <div class="row subscription-feature__group">
          <div class="col-12 text-caption lt-md">Fees & Supports</div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Service Charge') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ serviceCharge }}
          </div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-8 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Max Allowed Unpaid Fee') }}
          </div>
          <div class="subscription-feature__value col-4 col-md-12">
            {{ maxAllowedUnpaidFeeText }}
          </div>
        </div>
        <div class="row subscription-feature__item">
          <div
            class="subscription-feature__item-text text-weight-bold col-4 lt-md"
          >
            {{ $t('pages.memberCenter.subscription.Support') }}
          </div>
          <div class="subscription-feature__value col-8 col-md-12">
            <q-badge
              color="primary-05"
              text-color="primary"
              >{{ support }}</q-badge
            >
          </div>
        </div>
      </q-card-section>
      <q-card-section
        v-if="!isFree"
        class="subscription-feature__action column justify-center items-stretch"
      >
        <q-btn
          v-if="!isFree"
          unelevated
          :color="dark ? 'white' : 'positive'"
          :text-color="dark ? 'positive' : 'white'"
          class="full-width text-normal"
          @click="onSelectSubscription"
          >{{ subscriptionFeatureButtonText }}</q-btn
        >
        <span class="text-disable full-width text-center q-py-sm">or</span>
        <q-btn
          v-if="!isFree"
          unelevated
          color="primary-05"
          text-color="primary"
          class="full-width text-normal"
          @click="onViewSubscriptionPacks"
          >View packs</q-btn
        >
      </q-card-section>
    </template>
  </q-card>
</template>
<script lang="ts" setup>
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import { computed } from 'vue'
import { useRound } from '@vueuse/math'

// props & emits
const props = defineProps<{
  item: Subscription
  packs?: SubscriptionPack[]
  dark?: boolean
  loading?: boolean
}>()
const emits = defineEmits(['select', 'view-pack'])

// computed
const discountAnnuallyPrice = computed(() => {
  return isVipOrFree.value
    ? 0
    : parseFloat(props.item?.discountAnnuallyPrice.toString())
})
const discountAnnuallyPriceText = computed(() => {
  return isVIP.value
    ? 'Contact Us'
    : isFree.value
    ? 'Free'
    : `$${parseFloat(props.item?.discountAnnuallyPrice.toString())}`
})
const discountMonthPriceText = computed(() => {
  return isVIP.value
    ? 'Contact Us'
    : isFree.value
    ? 'Free'
    : `$${props.item?.discountMonthPrice}`
})
const totalDiscountByAnnually = computed(() => {
  return isVipOrFree.value
    ? false
    : useRound(
        ((monthPrice.value * 12 - discountAnnuallyPrice.value) /
          (monthPrice.value * 12)) *
          100
      )
})
const hardDiskSize = computed(() => {
  return props.item?.hardDiskSize
})
const maxAllowedUnpaidFeeText = computed(() => {
  return isVIP.value
    ? 'Contact Us'
    : isFree.value
    ? 'Free'
    : `$${props.item?.maxAllowedUnpaidFee}`
})
const maxAnalysisAppsNumber = computed(() => {
  return props.item?.maxAnalysisAppsNumber
})
const maxCloudpcHourlyCharge = computed(() => {
  return props.item?.maxCloudpcHourlyCharge
})
const maxCloudpcsNumber = computed(() => {
  return props.item?.maxCloudpcsNumber
})
const maxMemberAccountNumber = computed(() => {
  return props.item?.maxMemberAccountNumber
})
const maxStorageCapacity = computed(() => {
  return props.item?.maxStorageCapacity
})
const monthPrice = computed(() => {
  return isVIP.value
    ? 0
    : isFree.value
    ? 0
    : parseFloat(props.item?.monthPrice.toString())
})
const monthPriceText = computed(() => {
  const monthPriceWithUpperCase = props.item?.monthPrice
    .toString()
    .toUpperCase()
  return monthPriceWithUpperCase === 'FREE'
    ? 'Free'
    : monthPriceWithUpperCase === 'CONTACT US'
    ? '-----'
    : `$${props.item?.monthPrice}/mth`
})
const serviceCharge = computed(() => {
  return props.item?.serviceCharge
})
const support = computed(() => {
  return props.item?.support
})
const typeNote = computed(() => {
  return props.item?.typeNote
})
const isVIP = computed(() => {
  return typeNote.value?.toString().toUpperCase() === 'VIP'
})
const isFree = computed(() => {
  return typeNote.value?.toString().toUpperCase() === 'FREE'
})
const isVipOrFree = computed(() => {
  return isVIP.value || isFree.value
})
const subscriptionFeatureButtonText = computed(() => {
  return isVIP.value ? 'Contact Us' : 'Get started'
})

// methods
function onSelectSubscription() {
  emits('select', props.item)
}
function onViewSubscriptionPacks() {
  emits('view-pack')
}
</script>
<style lang="scss">
.subscription-feature {
  border: 6px solid transparent;
  outline: 1px solid $grey-1;
  border-radius: $generic-border-radius * 2;

  &__dark {
    outline: 8px solid $positive-05;
    border: 6px solid $positive-1;
  }

  &:hover,
  &.selected {
    border: 6px solid $positive-4;
    outline: 8px solid $positive-05;
  }

  &__dark:hover,
  &__dark.selected {
    outline: 8px solid $positive-1;
    border: 6px solid $positive-2;
  }

  &__title {
    height: 200px;
    min-height: 200px;
  }

  &__action {
    height: 150px;
  }

  &__item {
    height: 44px !important;
    border-bottom: 1px solid $grey-1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__group {
    height: 42px !important;
    margin-top: 20px;
  }

  &__value {
    max-height: 50px !important;
    min-height: 50px !important;
    text-align: right;
    font-size: $body-font-size;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;

    @media (min-width: $breakpoint-md-min) {
      text-align: center;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
