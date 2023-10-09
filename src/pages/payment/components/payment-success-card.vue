<template>
  <q-card
    flat
    class="payment-success-card"
  >
    <q-card-section class="full-height column justify-center items-center">
      <icon-payment-success
        width="80px"
        height="80px"
        class="q-mb-md"
      ></icon-payment-success>
      <strong class="q-mb-md text-subtitle2">{{ title }}</strong>
      <strong class="q-mb-md text-h4 text-weight-bold"
        >{{ amount }} <span class="text-subtitle2">USD</span></strong
      >
      <q-btn
        unelevated
        type="primary"
        color="primary"
        class="q-mb-md"
        @click="onBackTo"
        >{{ actionText }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import IconPaymentSuccess from 'src/core/components/atoms/icon/icon-payment-success.vue'

withDefaults(
  defineProps<{
    title: string
    subTitle: string
    amount: string | number
    actionText: string
  }>(),
  {
    title: 'Payment successful',
    subTitle: 'Please view detail on order history',
    amount: 258,
    actionText: 'Back to subscription page',
  }
)

const emits = defineEmits(['back', 'click'])
// methods
function onBackTo() {
  emits('back')
  emits('click')
}
</script>
<style lang="scss">
.payment-success-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
