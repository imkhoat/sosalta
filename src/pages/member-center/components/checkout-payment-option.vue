<template>
  <div class="flex checkout-payment-option justify-start">
    <!-- <div
      class="q-pa-xs"
      @click="selectOption('COIN')"
    >
      <q-avatar
        rounded
        color="grey-1"
        text-color="primary"
        icon="r_monetization_on"
        class="checkout-payment-option__item"
        :class="{
          'checkout-payment-option__selected': selectedOption === 'COIN',
        }"
      >
        <q-badge
          color="positive"
          floating
          icon="r_info"
        >
          <q-tooltip>330 AtlasCoin in your wallet</q-tooltip>
        </q-badge>
      </q-avatar>
    </div> -->
    <div
      class="q-pa-xs"
      @click="selectOption('WALLET')"
    >
      <q-avatar
        rounded
        color="grey-1"
        text-color="primary"
        icon="r_account_balance_wallet"
        class="checkout-payment-option__item"
        :class="{
          'checkout-payment-option__selected': selectedOption === 'WALLET',
        }"
      >
        <q-badge
          color="positive"
          floating
        >
          <q-tooltip>{{
            $t('pages.memberCenter.checkout.You have in your wallet', {
              balance: 250,
            })
          }}</q-tooltip>
        </q-badge>
      </q-avatar>
    </div>
    <div
      class="q-pa-xs"
      @click="selectOption('BANK_TRANSFER')"
    >
      <q-avatar
        rounded
        color="grey-1"
        text-color="primary"
        icon="r_account_balance"
        class="checkout-payment-option__item"
        :class="{
          'checkout-payment-option__selected':
            selectedOption === 'BANK_TRANSFER',
        }"
      ></q-avatar>
    </div>
    <div
      class="q-pa-xs"
      @click="selectOption('STRIPE')"
    >
      <q-avatar
        rounded
        color="grey-1"
        text-color="positive"
        class="checkout-payment-option__item"
        :class="{
          'checkout-payment-option__selected': selectedOption === 'STRIPE',
        }"
      >
        <icon-stripe
          width="40px"
          height="40px"
        ></icon-stripe>
      </q-avatar>
    </div>
    <div
      class="q-pa-xs"
      @click="selectOption('AMAZON_PAY')"
    >
      <q-avatar
        rounded
        color="grey-1"
        text-color="positive"
        class="checkout-payment-option__item"
        :class="{
          'checkout-payment-option__selected': selectedOption === 'AMAZON_PAY',
        }"
      >
        <icon-amazon
          width="24px"
          height="24px"
        ></icon-amazon>
      </q-avatar>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import IconStripe from 'src/core/components/atoms/icon/icon-stripe.vue'
import IconAmazon from 'src/core/components/atoms/icon/icon-amazon.vue'

export type Option =
  | 'WALLET'
  | 'COIN'
  | 'BANK_TRANSFER'
  | 'STRIPE'
  | 'AMAZON_PAY'

// props & emits
const props = defineProps<{
  modelValue?: Option
}>()
const emits = defineEmits(['update:modelValue'])

// data
const selectedOption = ref(props.modelValue)

function selectOption(option: Option) {
  selectedOption.value = option
  emits('update:modelValue', option)
}
</script>
<style lang="scss">
.checkout-payment-option {
  &__item {
    cursor: pointer;
    border: 2px solid transparent;
    box-sizing: content-box;
    border-radius: $generic-border-radius;
    background-color: $grey-1 !important;
  }
  &__item .q-badge {
    box-sizing: border-box;
  }

  &__selected {
    border-color: $primary;
    background-color: $grey-3 !important;
  }
}
</style>
