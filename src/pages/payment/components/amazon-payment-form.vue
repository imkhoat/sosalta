<template>
  <q-card
    flat
    class="amazon-completed-order column justify-between"
  >
    <q-card-section class="row justify-start items-start no-wrap">
      <q-section-header
        :title="$t('pages.payment.checkout.Amazon pay')"
        :sub-title="$t('pages.payment.checkout.Click confirm to completed')"
      ></q-section-header>
    </q-card-section>
    <q-space></q-space>
    <q-card-section>
      <q-card
        flat
        class="bg-grey-1 rounded-border"
      >
        <q-card-section class="q-pa-sm">
          <div
            class="text-weight-bold row no-wrap justify-between items-center q-pb-none"
          >
            <q-img
              src="~/assets/common/payment/icons8-visa.svg"
              spinner-color="white"
              style="height: 24px; max-width: 24px"
              class="q-mr-xs"
            />
            <strong>{{ creditcardInformation.cardHolder }}</strong>
            <q-space></q-space>
            <q-radio
              size="xs"
              class="subscription-pack-item__title-selector"
              v-model="selected"
              :val="'SELECTED'"
            />
          </div>
          <q-separator></q-separator>
          <div class="text-disable text-caption">
            {{ creditcardInformation.cardNumber }}
          </div>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-form-actions
        inline-class="justify-between"
        :actions="formActions"
      ></q-form-actions>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

import {
  AmazonCheckoutSession,
  AmazonCompletedOrderRequest,
  AmazonUpdatePaymentInformationRequest,
} from 'src/core/types/services/payment-types'
import {
  httpsGetAmazonCheckoutSession,
  httpsAmazonCompletedOrder,
  httpsAmazonUpdatePaymentInformation,
} from 'src/core/services/payment-services'
import { MEMBER_CENTER_ROUTE_NAMES } from 'src/core/router/routes'

// composable
const { t } = useI18n()

// data
const loading = ref(false)
const selected = ref('SELECTED')
const route = useRoute()
const router = useRouter()
const amazonCheckoutSession = ref<AmazonCheckoutSession>()

// computed
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
      color: 'primary',
      unelevated: true,
      unelevated: true,
      loading: loading.value,
      class: 'col-grow',
      name: t('textActions.Pay', { amount: '$10' }),
      action: onClickConfirmPay,
    },
  ]
})

const creditcardInformation = computed(() => {
  return {
    cardHolder: amazonCheckoutSession.value?.buyer.name,
    cardNumber:
      amazonCheckoutSession.value?.paymentPreferences[0].paymentDescriptor,
  }
})

const amazonCheckoutSessionId = computed(() => {
  return (
    amazonCheckoutSession.value?.checkoutSessionId ||
    route?.query?.amazonCheckoutSessionId?.toString()
  )
})

const amount = computed(() => {
  return amazonCheckoutSession.value?.paymentDetails?.chargeAmount?.amount
})

const packId = computed(() => {
  return route.query.packId
})

const subscriptionId = computed(() => {
  return route.query.subscriptionId
})
// methods
function onCancelPayment() {
  console.log('onCancelPayment')
}

async function onClickConfirmPay() {
  loading.value = true
  const updateResponse = await handleAmazonUpdatePaymentInformation()
  if (updateResponse) {
    await handleAmazonCompleteOrder()
  }
  loading.value = false
}

async function handleGetAmazonCheckoutSession(amazonCheckoutSessionId: string) {
  try {
    // loading.value = true
    const data = await httpsGetAmazonCheckoutSession(amazonCheckoutSessionId)
    if (data?.code === RESPONSE_CODE.SUCCESS) {
      amazonCheckoutSession.value = data?.data
      loading.value = false
    }
  } catch (error) {
    loading.value = false
    errorHandler.log(error)
  }
}

async function handleAmazonUpdatePaymentInformation() {
  try {
    if (!amazonCheckoutSessionId.value) {
      return
    }
    const params: AmazonUpdatePaymentInformationRequest = {
      checkoutSessionId: amazonCheckoutSessionId.value,
      webCheckoutDetails: {
        checkoutResultReturnUrl: `http://localhost:9000/member-center/checkout/completed-order?pack=${packId.value}&subscription=${subscriptionId.value}&payment=AMAZON_PAY`,
      },
      paymentDetails: {
        paymentIntent: 'AuthorizeWithCapture',
        chargeAmount: {
          amount: amount.value,
          currencyCode: 'USD',
        },
      },
    }
    const data = await httpsAmazonUpdatePaymentInformation(params)
    if (data?.code === RESPONSE_CODE.SUCCESS) {
      return true
    }
    return false
  } catch (error) {
    errorHandler.log(error)
    return false
  }
}

async function handleAmazonCompleteOrder() {
  try {
    const params: AmazonCompletedOrderRequest = {
      checkoutSessionId: amazonCheckoutSessionId.value || '',
      amount: amount.value,
    }
    const data = await httpsAmazonCompletedOrder(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      router.push({
        name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_THANKYOU,
        query: { ...route.query },
      })
    } else {
      router.push({
        name: MEMBER_CENTER_ROUTE_NAMES.CHECKOUT_ERROR,
        query: { ...route.query },
      })
    }
  } catch (error) {}
}
// hooks
onMounted(async () => {
  if (route.query?.amazonCheckoutSessionId) {
    await handleGetAmazonCheckoutSession(
      route.query?.amazonCheckoutSessionId.toString()
    )
  }
})
</script>
