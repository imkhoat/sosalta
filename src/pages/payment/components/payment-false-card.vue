<template>
  <q-card
    flat
    class="payment-success-card"
  >
    <q-card-section class="full-height column justify-center items-center">
      <icon-payment-false
        width="80px"
        height="80px"
        class="q-mb-md"
      ></icon-payment-false>
      <strong class="q-mb-md text-subtitle2">{{ title }}</strong>
      <span class="q-mb-md text-caption text-disable text-center">{{
        subTitle
      }}</span>
      <q-btn
        unelevated
        type="primary"
        color="primary"
        class="q-mb-md"
        @click="onTryAgain"
        >Try again</q-btn
      >
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import IconPaymentFalse from 'src/core/components/atoms/icon/icon-payment-false.vue'

withDefaults(
  defineProps<{
    title: string
    subTitle: string
    amount: string | number
  }>(),
  {
    title: 'Payment failed',
    subTitle: 'Invalid transaction, please check and submit card again',
    amount: 258,
  }
)

const emits = defineEmits(['back', 'click'])
// methods
function onTryAgain() {
  emits('back')
  emits('click')
}
</script>
