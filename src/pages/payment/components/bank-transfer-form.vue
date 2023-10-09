<template>
  <q-card
    flat
    class="bank-transfer-form rounded-borders"
  >
    <q-card-section
      class="bank-transfer-form__header column justify-start items-start no-wrap"
    >
      <q-avatar
        icon="r_account_balance"
        color="grey-1"
        size="lg"
        text-color="primary"
        class="q-mr-sm"
      ></q-avatar>
      <q-section-header
        :title="$t('pages.payment.checkout.Bank transfer instruction')"
        :sub-title="
          $t(
            'pages.payment.checkout.Please following below instruction to completed your order'
          )
        "
      ></q-section-header>
    </q-card-section>
    <q-card-section class="bank-transfer-form__body">
      <q-timeline color="primary">
        <q-timeline-entry
          :subtitle="$t(`pages.payment.checkout.Step`, { step: `01` })"
        >
          <div>
            {{
              $t(
                `pages.payment.checkout.Please make your check money order or cashiers check payable to`
              )
            }}
            <br />
            <strong class="text-positive">Shannon Genomics Inc.</strong>
          </div>
        </q-timeline-entry>

        <q-timeline-entry
          :subtitle="$t(`pages.payment.checkout.Step`, { step: `02` })"
        >
          <div>
            {{
              $t(
                `pages.payment.checkout.Make sure your check or money order includes the following information`
              )
            }}
            <br />
            <strong class="text-positive">{{
              $t(`pages.payment.checkout.Your name and address`)
            }}</strong>
            <br />
            <strong class="text-positive">{{
              $t(
                `pages.payment.checkout.Your Atlas OS account name and registered e-mail address`
              )
            }}</strong>
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          :subtitle="$t(`pages.payment.checkout.Step`, { step: `03` })"
        >
          <div>
            {{
              $t(
                `pages.payment.checkout.Please also attach invoice(s) relevant to your payment`
              )
            }}
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          :subtitle="$t(`pages.payment.checkout.Step`, { step: `04` })"
        >
          <div>
            {{
              $t(
                `pages.payment.checkout.You can view and print your invoices in the Payments section on Atlas OS`
              )
            }}
          </div>
        </q-timeline-entry>
        <q-timeline-entry
          :subtitle="$t(`pages.payment.checkout.Step`, { step: `05` })"
        >
          <div>
            {{
              $t(
                `pages.payment.checkout.Please mail your check money order or cashiers check along with your invoice to the following adress`
              )
            }}
            <q-code
              :code="`Yazhou Sun\nShannon Genomics Inc.\n786 Mountain Blvd, Suite 204 Watchung, NJ 07069`"
            >
              Yazhou Sun
              <br />Shannon Genomics Inc. <br />786 Mountain Blvd, Suite 204
              Watchung, NJ 07069
            </q-code>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </q-card-section>
    <q-card-section class="q-px-lg">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

// composable
const { t } = useI18n()

// props & emits
const emits = defineEmits(['cancel', 'confirmed'])

// computeds
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Cancel'),
      action: onCancelTransfer,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Confirm'),
      action: onConfirmPurchase,
    },
  ]
})

// methods
function onCancelTransfer() {
  emits('cancel')
}
function onConfirmPurchase() {
  emits('confirmed')
  emits('cancel')
}
</script>
<style lang="scss">
.bank-transfer-form {
  position: relative;

  &__header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background-color: $white;
    z-index: 1;
  }

  &__body {
    max-height: 500px;
    overflow: auto;
  }

  &__header .section-header {
    background-color: $white;
  }

  .q-timeline__dot:before {
    width: 13px;
    height: 13px;
    top: 6px;
    left: 2px;
  }

  .q-timeline__dot:after {
    top: 18px;
    left: 7px;
    bottom: -6px;
    width: 3px;
    background-color: $grey-5;
  }

  .q-timeline__subtitle {
    margin-bottom: -12px;
  }
}
</style>
