<template>
  <q-card
    flat
    class="checkout-payment-form no-box-shadow"
  >
    <!-- <q-card-section>
      <checkout-pack-item
        :subscription-name="subscriptionName"
        :expired-date="expiredDate"
      ></checkout-pack-item>
    </q-card-section> -->
    <q-card-section>
      <strong class="text-caption text-disable text-weight-bold">
        {{ $t(`pages.memberCenter.checkout.PRICE`) }}
      </strong>
      <div class="row q-py-md justify-between">
        <div class="col-9 text-left flex column">
          <strong>{{ subscriptionPackName }}</strong>
          <span class="text-disable text-caption">{{ expiredDate }}</span>
        </div>
        <div class="col-3 text-right">${{ subscriptionPackPrice }}</div>
      </div>
      <q-separator></q-separator>
      <div class="row q-py-md justify-between">
        <div class="col-8 text-subtitle1 text-weight-bold text-left">
          {{ $t(`pages.memberCenter.checkout.Total`) }}
        </div>
        <div class="col-4 text-subtitle1 text-weight-bold text-right">
          ${{ subscriptionPackPrice }}
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <strong class="text-caption text-disable text-weight-bold">
        {{ $t(`pages.memberCenter.checkout.PAYMENT METHODS`) }}
      </strong>
      <checkout-payment-option
        v-model="selectedPaymentOption"
      ></checkout-payment-option>
    </q-card-section>
    <q-card-section class="q-pb-lg">
      <q-form-actions
        v-model="selected"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
  </q-card>
  <q-dialog
    :no-backdrop-dismiss="true"
    :no-esc-dismiss="true"
    v-model="checkoutModal"
    :full-width="isMobileScreen"
  >
    <amazon-payment-widget
      v-if="selectedPaymentOption === 'AMAZON_PAY'"
      :amount="packageAmount"
      :payment-type="'CHECKOUT'"
      :pack="pack"
      :subscription="subscription"
      @close="onCloseStripePaymentProcess"
      @false="onShowFalseCard"
      @success="onShowSuccessCard"
    ></amazon-payment-widget>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { ActionProp } from 'src/core/types/action-prop-types'

import { MEMBER_CENTER_ROUTE_NAMES } from 'src/core/router/routes'
import CheckoutPaymentOption, {
  Option,
} from 'src/pages/member-center/components/checkout-payment-option.vue'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'
import AmazonPaymentWidget from 'src/pages/payment/components/amazon-payment-widget.vue'

// composable
const $q = useQuasar()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

// props & emits
const props = defineProps<{
  subscription?: Subscription
  pack?: SubscriptionPack
}>()

// data
const loading = ref(false)
const selected = ref(false)
const isSuccess = ref(false)
const isFalse = ref(false)
const checkoutModal = ref(false)
const selectedPaymentOption = ref<Option>('WALLET')

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const subscriptionPackName = computed(() => {
  return `${props.pack?.name}`
})

const subscriptionPackPrice = computed(() => {
  return props.pack?.price
})

const expiredDate = computed(() => {
  const d = new Date()
  if (props?.pack?.day) {
    d.setDate(d.getDate() + parseInt(props?.pack?.day?.toString()))
  }
  return `Expires On ${useDateFormat(d, 'YYYY-MM-DD HH:MM').value}`
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      unelevated: true,
      name: formActionButtonText.value,
      class: ['full-width'],
      action: onGetThisPack,
      loading: loading.value,
    },
  ]
})

const formActionButtonText = computed(() => {
  switch (selectedPaymentOption?.value) {
    case 'AMAZON_PAY':
      return t('textActions.Pay with Amazon')
    case 'STRIPE':
      return t('textActions.Pay with Stripe')
    case 'WALLET':
      return t('textActions.Pay with balance')
    case 'COIN':
      return t('textActions.Pay with wallet coin')
    case 'BANK_TRANSFER':
      return t('textActions.Get instruction')
    default:
      return t('textActions.Confirm')
  }
})

const packageAmount = computed(() => {
  return props.pack?.price || 0
})
// methods

function onGetThisPack() {
  switch (selectedPaymentOption.value) {
    case 'AMAZON_PAY':
      handlePayWithAmazonPay()
      break
    case 'BANK_TRANSFER':
      handlePayWithBankTransfer()
      break
    case 'STRIPE':
      handlePayWithStripe()
      break
    case 'COIN':
      handlePayWithBankTransfer()
      break
    case 'WALLET':
      handlePayWithBalance()
      break
    default:
      break
  }
}

function handlePayWithBankTransfer() {
  router.push({
    name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_COMPLETED_ORDER,
    query: { ...route.query, payment: selectedPaymentOption.value },
  })
}

function handlePayWithStripe() {
  router.push({
    name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_COMPLETED_ORDER,
    query: { ...route.query, payment: selectedPaymentOption.value },
  })
}

function handlePayWithAmazonPay() {
  checkoutModal.value = true
}

function handlePayWithBalance() {
  router.push({
    name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_COMPLETED_ORDER,
    query: { ...route.query, payment: selectedPaymentOption.value },
  })
}

function onCloseStripePaymentProcess() {
  checkoutModal.value = false
}

function onShowSuccessCard() {
  isSuccess.value = true
}

function onShowFalseCard() {
  isFalse.value = true
}
</script>
