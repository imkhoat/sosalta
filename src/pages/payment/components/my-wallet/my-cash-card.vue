<template>
  <q-card
    flat
    outlined
    class="rounded-borders font-opensan bg-purple-1"
  >
    <q-card-section
      class="flex-col justify-start items-stretch rounded-borders bg-purple-1"
    >
      <div class="row justify-between items-start q-mt-none q-mb-md">
        <q-avatar
          size="36px"
          color="purple-1"
          text-color="primary"
          class="q-mt-none"
        >
          <q-avatar
            size="28px"
            color="purple-1"
            text-color="primary-4"
          >
            <q-icon
              size="24px"
              name="request_quote"
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
                :to="{ name: PAYMENT_ROUTE_NAMES.ADD_FUND }"
                clickable
                class="row justify-start"
              >
                <q-item-section class="col-grow text-weight-medium q-ml-none"
                  >Add cash</q-item-section
                >
              </q-item>
              <q-item
                :to="{ name: PAYMENT_ROUTE_NAMES.DETAIL }"
                clickable
                class="row justify-start"
              >
                <q-item-section class="col-grow text-weight-medium q-ml-none"
                  >Usage Details</q-item-section
                >
              </q-item>
              <q-item
                :to="{ name: PAYMENT_ROUTE_NAMES.HISTORY }"
                clickable
                class="row justify-start"
              >
                <q-item-section class="col-grow text-weight-medium q-ml-none"
                  >Payment History</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <span class="text-body2 text-weight-bold q-mb-md">Total cashs</span>
      <div class="row justify-between items-end q-mb-md">
        <strong class="text-h4 text-weight-bold">{{ usdAmount }}</strong>
        <q-btn
          outline
          unelevated
          size="sm"
          rounded
          class="q-mb-sm text-normal text-weight-bold"
          :to="{ name: PAYMENT_ROUTE_NAMES.ADD_FUND }"
          >Add cash</q-btn
        >
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { PAYMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { Balance } from 'src/core/types/services/payment-types'
import { computed } from 'vue'

const props = defineProps<{
  item: Balance | undefined
}>()

const usdAmount = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.item?.balance ?? 0)
})
</script>
