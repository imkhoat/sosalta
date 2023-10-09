import { reactive, ref } from 'vue'

const modal = reactive<{
  open: boolean
  type: 'VIEW_RECEIPT_MODAL'
}>({
  open: false,
  type: 'VIEW_RECEIPT_MODAL',
})

export function useReceipt() {
  const loading = ref(false)

  function onToggleModal() {
    modal.open = !modal.open
  }

  function onViewReceipt() {
    modal.type = 'VIEW_RECEIPT_MODAL'
    modal.open = true
  }

  return {
    loading,
    modal,
    onToggleModal,
    onViewReceipt,
  }
}
