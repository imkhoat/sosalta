<template>
  <q-card
    flat
    class="wallet-payment-form column justify-end"
  >
    <q-card-section class="row">
      <q-card-section class="column justify-center items-center full-width">
        <q-avatar
          size="80px"
          color="green-1"
          text-color="positive"
          icon="r_account_balance_wallet"
          class="q-mb-md"
        ></q-avatar>
        <strong class="text-h5 text-weight-bold">
          {{ amount }}
          <span class="text-disable text-caption -q-ml-xs">$</span>
        </strong>
        <q-section-header
          sub-title="Press confirm to completed order"
          :center="true"
        ></q-section-header>
      </q-card-section>
    </q-card-section>
    <q-card-section class="q-pt-none q-px-lg q-pb-lg">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsPayWithBalance } from 'src/core/services/payment-services'

import { PayWithBalanceRequest } from 'src/core/types/services/payment-types'

// composable
const $q = useQuasar()
const { t } = useI18n()

// props & emits
const props = defineProps<{
  memberInfoId: number | string | undefined
  expireDateOfDay: number | string
  amount: number | string
}>()
const emits = defineEmits(['cancel', 'success'])

// data
const loading = ref(false)

// computeds
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
      loading: loading.value,
      class: 'col-grow',
      name: t('textActions.Confirm'),
      action: onConfirmPayment,
    },
  ]
})

// methods
function onCancelPayment() {
  emits('cancel')
}

function onConfirmPayment() {
  handlePayWithCoin()
}

async function handlePayWithCoin() {
  try {
    loading.value = true
    const params: PayWithBalanceRequest = {
      memberOrder: {
        memberInfoId: props.memberInfoId,
        expireDateOfDay: props.expireDateOfDay,
      },
    }

    const data = await httpsPayWithBalance(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: t('pages.payment.checkout.Payment success'),
        type: 'positive',
      })
      emits('success')
    }
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}
</script>
