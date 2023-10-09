<template>
  <q-card class="amazon-payment-widget">
    <q-card-section class="column justify-end full-height">
      <q-section-header
        :title="$t('pages.payment.checkout.Amazon pay')"
        :sub-title="
          isVerified
            ? $t('pages.payment.checkout.Click to select credit card')
            : $t(
                'pages.payment.checkout.Please verify captcha before input card'
              )
        "
      ></q-section-header>
    </q-card-section>
    <q-card-section
      v-if="!isVerified"
      class="column q-gutter-md"
    >
      <q-captcha-input
        ref="captchaEl"
        dense
        v-model="form.captcha"
        v-model:captcha-uuid="form.captchauuid"
        hide-bottom-space
        @submit="onSendVerification"
      ></q-captcha-input>
      <q-form-actions
        inline-class="justify-between"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
    <q-card-section v-show="isVerified">
      <div class="amazon-form q-mb-md full-width">
        <div
          id="amazon-payment-button-id"
          class="amazon-payment-button"
        ></div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

import { httpsCreateAmazonCheckoutSession } from 'src/core/services/payment-services'
import { CreateAmazonCheckoutSessionRequest } from 'src/core/types/services/payment-types'
import { QCaptchaInputElement } from 'src/core/types/q-captcha-input-element-types'
import { Subscription, SubscriptionPack } from 'src/core/types/subscription'

// composable
const { t } = useI18n()
const route = useRoute()

// props & emits
const props = defineProps<{
  paymentType: 'CHECKOUT' | 'DEPOSIT'
  amount: number | string
  memberOrder?: string
  subject?: string
  pack?: SubscriptionPack
  subscription?: Subscription
}>()
const emits = defineEmits(['close', 'success', 'false'])

// data
const isVerified = ref(false)
const amazonButtonSignature = ref('')
const amazonCheckoutSessionId = ref('')
const amazonMerchantId = ref(process.env.AMAZON_PAY_MERCHANT_ID)
const amazonPublicKeyId = ref(process.env.AMAZON_PUBLIC_KEY_ID)
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
})

const packId = computed(() => {
  return route.query?.pack || props.pack?.id
})

const subscriptionId = computed(() => {
  return route.query?.subscription || props.subscription?.mcMemberInfoId
})

const expireDateOfDay = computed(() => {
  return props.pack?.totalDay
})

// methods
function onCancelPayment() {
  emits('close')
}

async function renderAmazonButton(payload: any, signature: string) {
  if (window.amazon) {
    window.amazon.Pay.renderButton('#amazon-payment-button-id', {
      // set checkout environment
      merchantId: amazonMerchantId.value ?? process.env.AMAZON_PAY_MERCHANT_ID,
      publicKeyId: amazonPublicKeyId.value ?? process.env.AMAZON_PUBLIC_KEY_ID,
      ledgerCurrency: 'USD',
      // customize the buyer experience
      checkoutLanguage: 'en_US',
      productType: 'PayOnly',
      placement: 'Cart',
      buttonColor: 'Gold',
      estimatedOrderAmount: { amount: props.amount, currencyCode: 'USD' },
      // configure Create Checkout Session request
      createCheckoutSessionConfig: {
        payloadJSON: JSON.stringify(payload), // string generated in step 2
        signature: signature, // signature generated in step 3
        publicKeyId:
          amazonPublicKeyId.value ?? process.env.AMAZON_PUBLIC_KEY_ID,
      },
    })
  }
}

function _generateCheckoutReturnObject() {
  if (props.paymentType === 'CHECKOUT') {
    return {
      checkoutReviewReturnUrl: `http://localhost:9000/member-center/checkout/completed-order?pack=${packId.value}&subscription=${subscriptionId.value}&payment=AMAZON_PAY`,
      checkoutResultReturnUrl: `http://localhost:9000/member-center/checkout/completed-order?pack=${packId.value}&subscription=${subscriptionId.value}&payment=AMAZON_PAY`,
    }
  }
  return {
    checkoutReviewReturnUrl: `http://localhost:9000/payment/my-wallet`,
    checkoutResultReturnUrl: `http://localhost:9000/payment/my-wallet`,
  }
}

async function onSendVerification() {
  try {
    loading.value = true
    const customInformation = {
      memberInfoId: subscriptionId.value,
      expireDateOfDay: expireDateOfDay?.value,
      status: 1,
    }

    const params: CreateAmazonCheckoutSessionRequest = {
      captcha: {
        captchaCode: form.captcha,
        captchauuid: form.captchauuid,
      },
      amount: props.amount,
      webCheckoutDetails: _generateCheckoutReturnObject(),
      paymentType:
        props.paymentType === 'CHECKOUT' ? 'MEMBER_ORDER' : 'ADD_FUNDS',
      customInformation: JSON.stringify(customInformation),
    }

    const data = await httpsCreateAmazonCheckoutSession(params)
    if (data?.code === RESPONSE_CODE.SUCCESS && data?.data?.payload) {
      amazonButtonSignature.value = data?.data?.signature
      amazonCheckoutSessionId.value = data?.data?.checkoutSessionId
      amazonMerchantId.value = data?.data?.amazonPayInfo?.amazonPayMerchantId
      amazonPublicKeyId.value = data?.data?.amazonPayInfo?.amazonPublicKeyId

      renderAmazonButton(data?.data?.payload, data?.data?.signature)

      isVerified.value = true
    }

    loading.value = false
  } catch (error) {
    isVerified.value = false
    errorHandler.log(error)
  }
}
</script>
<style lang="scss">
.amazon-payment-widget {
  max-min-width: 300px;
  min-width: 300px;

  .amazon-payment-button {
    width: 100% !important;
  }
}
</style>
