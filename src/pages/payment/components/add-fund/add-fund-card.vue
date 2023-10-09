<template>
  <q-card
    flat
    class="add-fund-card full-width full-height"
  >
    <q-card-section>
      <q-section-header
        title="Add fund."
        sub-title="Input amount and click pay button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <q-input
        dense
        type="number"
        id="amount"
        label="Amount"
        stack-label
        outlined
        v-bind="$attrs"
        v-model="amount"
        class="q-mb-md"
      >
      </q-input>
      <payment-options v-model="selectedPaymentOption"></payment-options>
    </q-card-section>
    <q-card-section>
      <q-alert type="positive">
        Note: ${{ amount }} will be topup in your wallet by
        {{ paymentOptionText }}
      </q-alert>
    </q-card-section>
    <q-card-actions class="q-pb-lg">
      <q-form-actions
        v-model="selected"
        :actions="formActions"
      ></q-form-actions>
    </q-card-actions>
  </q-card>
  <q-dialog
    :no-backdrop-dismiss="true"
    :no-esc-dismiss="true"
    v-model="checkoutModal"
    :full-width="isMobileScreen"
  >
    <amazon-payment-widget
      v-if="selectedPaymentOption === 'AMAZON_PAY'"
      :amount="amount"
      :payment-type="'DEPOSIT'"
      @close="onCloseStripePaymentProcess"
      @false="onShowFalseCard"
      @success="onShowSuccessCard"
    ></amazon-payment-widget>
  </q-dialog>
  <q-dialog v-model="paymentModal">
    <template v-if="paymentStep === 'SELECT_STEP'">
      <bank-transfer-form
        v-if="selectedPaymentOption === 'BANK_TRANSFER'"
        @cancel="onTogglePaymentModal"
      ></bank-transfer-form>
      <stripe-payment-form
        v-if="selectedPaymentOption === 'STRIPE'"
        :amount="amount"
        :payment-type="'DEPOSIT'"
        @cancel="onTogglePaymentModal"
        @false="onShowFalseCard"
        @success="onShowSuccessCard"
      ></stripe-payment-form>

      <amazon-payment-form
        v-if="selectedPaymentOption === 'AMAZON_PAY'"
        :amount="amount"
        :payment-type="'DEPOSIT'"
        @close="onTogglePaymentModal"
        @false="onShowFalseCard"
        @success="onShowSuccessCard"
      ></amazon-payment-form>
    </template>
    <template v-else>
      <payment-success-card
        v-if="isSuccess"
        :amount="amount"
        action-text="Thankyou."
        @click="onSuccessClick"
      ></payment-success-card>
      <payment-false-card
        v-else
        @click="onFalseClick"
      ></payment-false-card>
    </template>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'

import PaymentOptions, {
  Option,
} from 'src/pages/payment/components/add-fund/payment-options.vue'
import PaymentFalseCard from 'src/pages/payment/components/payment-false-card.vue'
import BankTransferForm from 'src/pages/payment/components/bank-transfer-form.vue'
import StripePaymentForm from 'src/pages/payment/components/stripe-payment-form.vue'
import AmazonPaymentForm from 'src/pages/payment/components/amazon-payment-form.vue'
import PaymentSuccessCard from 'src/pages/payment/components/payment-success-card.vue'
import AmazonPaymentWidget from 'src/pages/payment/components/amazon-payment-widget.vue'

// composable
const $q = useQuasar()
const { t } = useI18n()

// data
const loading = ref(false)
const selected = ref(false)
const isSuccess = ref(false)
const isFalse = ref(false)
const checkoutModal = ref(false)
const selectedPaymentOption = ref<Option>('BANK_TRANSFER')
const paymentStep = ref<'SELECT_STEP' | 'PAID_STEP'>('SELECT_STEP')
const amount = ref(10)
const paymentModal = ref(false)

// computed
const suggestOptions = computed(() => {
  return [
    { name: '10$', value: 1000 },
    { name: '20$', value: 2000 },
    { name: '50$', value: 5000 },
    { name: '100$', value: 10000 },
    { name: '500$', value: 50000 },
    { name: '1000$', value: 100000 },
    { name: '5000$', value: 500000 },
  ]
})
const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      unelevated: true,
      name: formActionButtonText.value,
      class: ['full-width'],
      action: onStartAddFund,
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
    case 'BANK_TRANSFER':
      return t('textActions.Get instruction')
    default:
      return t('textActions.Confirm')
  }
})

const paymentOptionText = computed(() => {
  switch (selectedPaymentOption?.value) {
    case 'AMAZON_PAY':
      return 'Amazon Pay'
    case 'STRIPE':
      return 'Stripe pay'
    default:
      return 'transfer to wallet'
  }
})
// methods

function onStartAddFund() {
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
    default:
      break
  }
}

function onSuccessClick() {
  onTogglePaymentModal()
  paymentStep.value = 'SELECT_STEP'
}

function onFalseClick() {
  paymentStep.value = 'SELECT_STEP'
}

function onTogglePaymentModal() {
  paymentModal.value = !paymentModal.value
}

function handlePayWithBankTransfer() {
  onTogglePaymentModal()
}

function handlePayWithStripe() {
  onTogglePaymentModal()
}

function handlePayWithAmazonPay() {
  checkoutModal.value = true
}

function onCloseStripePaymentProcess() {
  checkoutModal.value = false
}

function onShowSuccessCard() {
  isFalse.value = false
  isSuccess.value = true
  paymentStep.value = 'PAID_STEP'
}

function onShowFalseCard() {
  isSuccess.value = false
  isFalse.value = true
  paymentStep.value = 'PAID_STEP'
}
</script>
