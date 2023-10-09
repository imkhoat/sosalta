import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { PaymentHistory } from '../types/payment-history-types'

export const usePaymentHistoryStore = defineStore('application-search', () => {
  // state
  const activePaymentHistory = useStorage<PaymentHistory>(
    'payment-history-activePaymentHistory',
    null,
    sessionStorage
  )

  // getter
  const getPaymentHistory = computed(() => {
    return activePaymentHistory.value
  })

  // actions
  function updatePaymentHistory(key: PaymentHistory | null) {
    activePaymentHistory.value = key
  }

  function resetPaymentHistory() {
    updatePaymentHistory(null)
  }

  return {
    getPaymentHistory,
    resetPaymentHistory,
    updatePaymentHistory,
  }
})
