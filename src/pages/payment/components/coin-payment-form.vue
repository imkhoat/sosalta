<template>
  <q-card class="q-py-md">
    <q-card-section class="row">
      <q-card-section class="column justify-center items-center full-width">
        <q-section-header
          title="Payment detail"
          :center="true"
          class="q-mb-lg"
        ></q-section-header>
        <q-avatar
          size="80px"
          color="green-1"
          text-color="positive"
          icon="r_monetization_on"
          class="q-mb-md"
        ></q-avatar>
        <strong class="text-h5 text-weight-bold">
          {{ coin }}
          <span class="text-disable text-caption -q-ml-xs">
            {{ $t('pages.payment.checkout.COIN') }}
          </span>
        </strong>
        <q-section-header
          sub-title="Press confirm to completed order"
          :center="true"
        ></q-section-header>
      </q-card-section>
    </q-card-section>
    <q-card-section class="q-pt-none q-px-lg">
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
  coin: number | string
}>()
const emits = defineEmits(['close', 'success'])

// data
const loading = ref(false)

// computeds
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Cancel'),
      action: onCancelPayment,
    },
    {
      color: 'primary',
      unelevated: true,
      loading: loading.value,
      name: t('textActions.Confirm'),
      action: onConfirmPayment,
    },
  ]
})

// methods
function onCancelPayment() {
  emits('close')
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
