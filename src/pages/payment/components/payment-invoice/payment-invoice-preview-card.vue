<template>
  <q-card class="payment-invoice-preview-card">
    <q-card-section>
      <q-section-header title="Receipt"></q-section-header>
    </q-card-section>
    <q-card-section class="bg-grey-1">
      <div class="invoice-preview-content font-courier">
        <div
          class="invoice-preview-content__row invoice-preview-content__header"
        >
          <img
            class="invoice-preview-content__logo"
            src="~assets/common/shannon-genomics.png"
            alt=""
          />
          <h1 class="invoice-preview-content__title">RECEIPT</h1>
        </div>
        <div class="invoice-preview-content__row">
          <div
            class="invoice-preview-content__col invoice-preview-content__info"
          >
            <div class="invoice-preview-content__from">
              <strong class="invoice-preview-content__subtitle"
                >Shannon Genomics Inc.</strong
              >
              <p class="invoice-preview-content__content">
                786 Mountain Blvd,<br />
                Suite 204<br />
                Watchung, NJ 07069<br />
                USA<br />
                info@shannongenomics.com
              </p>
            </div>
            <span
              class="invoice-preview-content__separate text-disable text-caption"
              >Bill To:</span
            >
            <div class="invoice-preview-content__to">
              <strong class="invoice-preview-content__subtitle">{{
                item?.name
              }}</strong>
              <p class="invoice-preview-content__content">
                {{ item?.stress }}<br />
                {{ item?.city }}<br />
                {{ item?.city }}<br />
                {{ item?.country }}<br />
                {{ item?.zip }}<br />
                {{ item?.email }}
                {{ item?.phone }}
              </p>
            </div>
          </div>
          <div class="invoice-preview-content__col">
            <table class="invoice-preview-content__table">
              <tr>
                <td class="invoice-preview-content__table-header">
                  Receipt No.
                </td>
                <td>{{ receipt?.no }}</td>
              </tr>
              <tr>
                <td class="invoice-preview-content__table-header">
                  Receipt Date
                </td>
                <td>{{ receipt?.date }}</td>
              </tr>
              <tr>
                <td class="invoice-preview-content__table-header">Order No.</td>
                <td>{{ receipt?.order }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="invoice-preview-content__row full-width">
          <table class="invoice-preview-content__table full-width">
            <tr>
              <td class="invoice-preview-content__table-header">ITEM</td>
              <td class="invoice-preview-content__table-header">SG COINS</td>
              <td class="invoice-preview-content__table-header">
                ORIGINAL PRICE
              </td>
              <td class="invoice-preview-content__table-header">
                ACTUAL PRICE
              </td>
            </tr>
            <tr>
              <td>{{ receipt?.history?.subject }}</td>
              <td></td>
              <td>{{ receipt?.history?.originalPriceString }}</td>
              <td>{{ receipt?.history?.totalPriceString }}</td>
            </tr>
          </table>
        </div>
        <div class="invoice-preview-content__row">
          <div class="invoice-preview-content__col">
            <span>Notes</span>
          </div>
          <div
            class="invoice-preview-content__col invoice-preview-content__summary"
          >
            <span class="text-disable text-caption">Prices</span>
            <div class="invoice-preview-content__summary-table">
              <div>
                <span>Subtotal</span>
                <span>{{ receipt?.history?.originalPriceString }}</span>
              </div>
              <div><span>Tax</span> <span>-</span></div>
              <div>
                <span>Total</span>
                <span>{{ receipt?.history?.totalPriceString }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { Invoice } from 'src/core/types/invoice-types'
import { PaymentHistory } from 'src/core/types/payment-history-types'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  receipt: {
    no: string
    date: string
    order: string
    history?: PaymentHistory
  }
  item: Invoice
}>()
// composables
const { t } = useI18n()

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      unelevated: true,
      color: 'primary',
      name: t('textActions.Print'),
    },
  ]
})

// methods
function onClose() {
  emits('close')
}
</script>
<style lang="scss">
.payment-invoice-preview-card {
  min-width: 300px;
}

.invoice-preview-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;

  &__row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }

  &__table {
    border: 1px solid black;
    border-collapse: collapse;
    border-spacing: 0 !important;

    th,
    td {
      border: 1px solid black;
      border-collapse: collapse;
      border-spacing: 0 !important;
      padding: 4px 8px;
    }
  }

  &__table-header {
    background-color: #eee;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 16px;
  }

  &__logo {
    height: 46px;
  }

  &__header {
    align-items: center;
  }

  &__summary-table > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    gap: 48px;
  }
}
</style>
