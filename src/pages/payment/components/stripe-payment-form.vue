<template>
  <q-card
    flat
    class="stripe-payment-form"
  >
    <q-card-section
      v-if="!isVerified"
      class="column justify-end full-height"
    >
      <q-section-header
        :title="$t('pages.payment.checkout.Stripe payment')"
        :sub-title="
          $t('pages.payment.checkout.Please verify captcha before input card')
        "
      ></q-section-header>
      <q-space></q-space>
      <q-captcha-input
        ref="captchaEl"
        dense
        v-model="form.captcha"
        v-model:captcha-uuid="form.captchauuid"
        hide-bottom-space
        class="q-my-md"
        @submit="onSendVerification"
      ></q-captcha-input>
      <q-form-actions
        inline-class="justify-between"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
    <q-card-section
      v-show="isVerified"
      class="column q-gutter-md"
    >
      <div class="stripe-form q-mb-md">
        <icon-stripe-logo></icon-stripe-logo>
        <div
          id="payment-element"
          class="payment-element"
        ></div>
      </div>
      <q-form-actions
        inline-class="justify-between"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

import IconStripeLogo from 'src/core/components/atoms/icon/icon-stripe-logo.vue'
import { httpsCreateStripePaymentIntent } from 'src/core/services/payment-services'
import { CreateStripePaymentIntentRequest } from 'src/core/types/services/payment-types'
import { QCaptchaInputElement } from 'src/core/types/q-captcha-input-element-types'

const appearance = {
  theme: 'flat',
  variables: {
    fontFamily: ' "inter-font", sans-serif',
    fontLineHeight: '1.5',
    borderRadius: '8px',
    colorBackground: '#F6F8FA',
    colorPrimaryText: '#000000',
  },
  rules: {
    '.Block': {
      backgroundColor: 'var(--colorBackground)',
      boxShadow: 'none',
      padding: '12px',
    },
    '.Input': {
      border: '1px solid rgba(0, 0, 0, 0.24)',
      padding: '12px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    '.Input:disabled, .Input--invalid:disabled': {
      color: 'lightgray',
    },
    '.Input:hover': {
      border: '1px solid #000000',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '2px solid #000000',
      boxShadow: 'none',
    },
    '.Tab': {
      padding: '10px 12px 8px 12px',
      border: 'none',
    },
    '.Tab:hover': {
      border: 'none',
      boxShadow:
        '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
      border: 'none',
      backgroundColor: '#fff',
      boxShadow:
        '0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
    },
    '.Label': {
      fontWeight: '500',
      fontSize: '14px',
    },
  },
}

// composable
const $q = useQuasar()
const { t } = useI18n()

// props & emits
const props = defineProps<{
  paymentType: 'CHECKOUT' | 'DEPOSIT'
  amount: number | string
  memberOrder?: string
  subject?: string
}>()
const emits = defineEmits(['cancel', 'success', 'false'])

// data
const stripe = ref()
const element = ref()
const paymentElement = ref()
const isVerified = ref(false)
const loading = ref(false)
const form = reactive({
  captcha: '',
  captchauuid: '',
})
const captchaEl = ref<InstanceType<QCaptchaInputElement> | null>(null)

// computed
const isActiveVerifyButton = computed(() => {
  return form.captcha && form.captchauuid
})

const formActions = computed((): ActionProp[] => {
  if (isVerified.value) {
    return [
      {
        type: 'primary',
        color: 'primary',
        flat: true,
        class: 'col-grow',
        name: t('textActions.Cancel'),
        action: onCancelPayment,
      },
      {
        color: isVerified.value ? 'primary' : 'disable',
        push: isVerified.value,
        disable: !isVerified.value,
        unelevated: true,
        loading: loading.value,
        class: 'col-grow',
        name: t('textActions.Pay', { amount: `$${props.amount}` }),
        action: onClickPay,
      },
    ]
  } else {
    return [
      {
        type: 'primary',
        color: 'primary',
        flat: true,
        class: 'col-grow',
        name: t('textActions.Cancel'),
        action: onCancelPayment,
      },
      {
        color: isActiveVerifyButton.value ? 'primary' : 'disable',
        push: isVerified.value,
        disable: !isActiveVerifyButton.value,
        unelevated: true,
        loading: loading.value,
        class: 'col-grow',
        name: t('textActions.Verify'),
        action: onSendVerification,
      },
    ]
  }
})

// methods
function onCancelPayment() {
  emits('cancel')
}

async function renderStripe(publicKey: string, clientSecret: string) {
  if (window.Stripe) {
    stripe.value = window.Stripe(`${publicKey}`)
    element.value = stripe.value.elements({
      clientSecret: `${clientSecret}`,
      appearance,
    })
    paymentElement.value = element.value.create('payment')
    paymentElement.value.mount('#payment-element')
  }
}

async function onSendVerification() {
  try {
    loading.value = true
    const params: CreateStripePaymentIntentRequest = {
      captchaCode: form.captcha,
      captchauuid: form.captchauuid,
      currency: 'usd',
      amount: parseFloat(props.amount.toString()) * 100,
    }

    if (props.memberOrder) {
      params.memberOrder = props.memberOrder
    }
    if (props.subject) {
      params.subject = props.subject
    }
    const data = await httpsCreateStripePaymentIntent(params)

    if (
      data?.code === RESPONSE_CODE.SUCCESS &&
      data?.data?.publishableKey &&
      data?.data?.clientSecret
    ) {
      isVerified.value = true
      await renderStripe(data?.data?.publishableKey, data?.data?.clientSecret)
    } else {
      refreshCaptcha()
    }
    loading.value = false
  } catch (error) {
    resetPaymentForm()
    refreshCaptcha()
    errorHandler.log(error)
  }
}

async function onClickPay() {
  loading.value = true
  const result = await stripe.value.confirmPayment({
    elements: element.value,
    redirect: 'if_required',
  })

  if (result.error) {
    handlePaymentFalse(result.error)
  } else {
    handlePaymentSuccess()
  }
}

function resetPaymentForm() {
  form.captcha = ''
  loading.value = false
  isVerified.value = false
  paymentElement.value?.destroy()
}

function handlePaymentSuccess() {
  $q.notify({
    message: 'Order completed',
    type: 'positive',
  })
  resetPaymentForm()
  emits('success')
}

function handlePaymentFalse(error: { message: string; type: string }) {
  $q.notify({
    message: error.message,
    type: 'negative',
  })
  loading.value = false
  if (error.type !== 'validation_error') {
    paymentElement.value?.destroy()
  }
  emits('false')
}

function refreshCaptcha() {
  captchaEl?.value?.refresh()
}
</script>
<style lang="scss">
.stripe-payment-form {
  max-min-width: 300px;
  min-width: 300px;
}
</style>
