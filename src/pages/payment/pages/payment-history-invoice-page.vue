<template>
  <div class="column items-stretch justify-start full-height no-wrap project-entries-page">
    <q-page-header title="Invoice detail" subtitle="Update your bill address and issue a recipe.">
      <template v-slot:action>
        <payment-invoice-actions></payment-invoice-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <div class="row q-col-gutter-md q-col-gutter-sm">
      <div class="col-12 col-sm-12 col-md-4 q-pb-md">
        <payment-company-card></payment-company-card>
      </div>
      <div class="col-12 col-sm-12 col-md-8 q-pb-md">
        <payment-invoice-card v-model="invoiceForm"></payment-invoice-card>
      </div>
      <div class="col-12 q-pb-md flex items-stretch">
        <payment-invoice-detail :item="invoiceForm" :receipt="receipt"></payment-invoice-detail>
      </div>
    </div>
  </div>
  <q-dialog full-width v-model="modal.open">
    <payment-invoice-preview-card :receipt="receipt" :item="invoiceForm"
      @close="onToggleModal"></payment-invoice-preview-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { Invoice } from 'src/core/types/invoice-types'
import { useReceipt } from 'src/pages/payment/hooks/use-receipt'
import PaymentInvoiceCard from 'src/pages/payment/components/payment-invoice/payment-invoice-card.vue'
import PaymentCompanyCard from 'src/pages/payment/components/payment-invoice/payment-company-card.vue'
import PaymentInvoiceDetail from 'src/pages/payment/components/payment-invoice/payment-invoice-detail.vue'
import PaymentInvoiceActions from 'src/pages/payment/components/payment-invoice/payment-invoice-actions.vue'
import PaymentInvoicePreviewCard from 'src/pages/payment/components/payment-invoice/payment-invoice-preview-card.vue'
import { storeToRefs } from 'pinia'
import { usePaymentHistoryStore } from 'src/core/stores/payment'
import { useRoute } from 'vue-router'
import { PaymentHistory } from 'src/core/types/payment-history-types'

const route = useRoute()
const { modal, onToggleModal } = useReceipt()
const { getPaymentHistory } = storeToRefs(usePaymentHistoryStore())

const invoiceForm = ref<Invoice>({
  name: '',
  phone: '',
  email: '',
  po: '',
  stress: '',
  city: '',
  state: '',
  apt: '',
  zip: '',
  country: ''
})

const receipt = ref({
  no: getPaymentHistory.value?.outTradeNo,
  date: getPaymentHistory.value?.gmtLoggingTimeString ?? getPaymentHistory?.value?.userName,
  order: getPaymentHistory.value?.outTradeNo,
  history: getPaymentHistory.value
})

watch(() => route.fullPath, () => {
  const { name,
    phone,
    email,
    po,
    stress,
    city,
    state,
    apt,
    zip,
    country,
    no, date, order, subject, originalPriceString, totalPriceString } = route.query
  invoiceForm.value = {
    name: name?.toString() ?? getPaymentHistory?.value?.userName,
    phone: phone?.toString()??'',
    email: email?.toString() ?? getPaymentHistory?.value?.userName,
    po: po?.toString() ?? getPaymentHistory?.value?.userName,
    stress: stress?.toString() ?? getPaymentHistory?.value?.userName,
    city: city?.toString() ?? getPaymentHistory?.value?.userName,
    state: state?.toString() ?? getPaymentHistory?.value?.userName,
    apt: apt?.toString() ?? getPaymentHistory?.value?.userName,
    zip: zip?.toString() ?? getPaymentHistory?.value?.userName,
    country: country?.toString() ?? getPaymentHistory?.value?.userName,
  }
  receipt.value = {
    no: no?.toString() ?? getPaymentHistory?.value?.userName, date: date?.toString() ?? getPaymentHistory?.value?.userName, order: order?.toString() ?? getPaymentHistory?.value?.userName, history: { subject, originalPriceString, totalPriceString } as PaymentHistory ?? getPaymentHistory.value
  }
},
  {
    immediate: true
  })
</script>
