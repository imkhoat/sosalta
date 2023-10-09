<template>
  <q-card
    flat
    outlined
    class="rounded-borders font-opensan bg-amber-1"
  >
    <q-card-section
      class="column justify-start items-stretch rounded-borders bg-amber-1"
    >
      <div class="row justify-between items-start q-mt-none q-mb-md">
        <q-avatar
          size="36px"
          color="amber-1"
          text-color="primary"
          class="q-mt-none"
        >
          <q-avatar
            size="28px"
            color="amber-1"
            text-color="primary-4"
          >
            <q-icon
              size="24px"
              name="monetization_on"
            ></q-icon>
          </q-avatar>
        </q-avatar>
        <q-btn
          size="sm"
          rounded
          round
          flat
        >
          <q-icon
            size="22px"
            name="more_vert"
          ></q-icon>
          <q-menu class="menus-context">
            <q-list>
              <q-item
                clickable
                class="row justify-start"
                :to="{ name: PAYMENT_ROUTE_NAMES.DISCOUNT_VOUCHER }"
              >
                <q-item-section class="col-grow text-weight-medium q-ml-none"
                  >Get more coin</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <span class="text-body2 text-weight-bold q-mb-md">Total coins</span>
      <div class="q-mb-md">
        <strong class="text-h4 text-weight-bold">{{
          totalCoinFormated
        }}</strong>
        <span class="text-caption text-disable q-ml-sm"
          >({{ totalCoinByMoney }})</span
        >
        <q-btn
          size="xs"
          rounded
          round
          flat
          class="q-px-xs"
          href="https://github.com/atlas-os-team/doc"
          target="_blank"
        >
          <q-icon
            size="16px"
            name="sym_o_help"
          ></q-icon>
          <q-tooltip>1coin = $0.01</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { PAYMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { computed } from 'vue'

const props = defineProps<{
  item: number | string
}>()

const totalCoinFormated = computed(() => {
  return props.item?.toLocaleString()
})

const totalCoinByMoney = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(props.item) * 0.01)
})
</script>
