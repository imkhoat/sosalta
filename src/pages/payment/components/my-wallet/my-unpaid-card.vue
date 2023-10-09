<template>
  <q-card
    flat
    outlined
    class="rounded-borders font-opensan bg-teal-1"
  >
    <q-card-section
      class="column justify-start items-stretch rounded-borders bg-teal-1"
    >
      <div class="row justify-between items-start q-mt-none q-mb-md">
        <q-avatar
          size="36px"
          color="teal-1"
          text-color="primary"
          class="q-mt-none"
        >
          <q-avatar
            size="28px"
            color="teal-1"
            text-color="primary-4"
          >
            <q-icon
              size="24px"
              name="hourglass_top"
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
                  >Pay now</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <span class="text-body2 text-weight-bold q-mb-md">Total unpaid</span>
      <div class="q-mb-md">
        <div>
          <strong class="text-h4 text-weight-bold text-negative">{{
            totalUnpaidFormated
          }}</strong>
          <q-btn
            size="xs"
            rounded
            round
            flat
            class="q-px-xs q-mb-xs"
            href="https://github.com/atlas-os-team/doc"
            target="_blank"
          >
            <q-icon
              size="16px"
              name="sym_o_help"
            ></q-icon>
            <q-tooltip
              >Total Unpaid = Current Bill + Previously Unpaid Bills - Account
              Cash Balance - Atlas OS Coin Amount * 1%</q-tooltip
            >
          </q-btn>
        </div>
        <span class="text-caption text-disable"
          >Max Allowed Unpaid Fee = $1</span
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

const totalUnpaidFormated = computed(() => {
  return Math.sign(props.item?.totalUnpaid ?? 0) === -1
    ? '0'
    : props.item?.totalUnpaid ?? 0
})
</script>
