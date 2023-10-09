<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      push
      color="primary"
      @click="onViewReceipt"
    >
      <q-icon
        size="xs"
        name="sym_o_export_notes"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'Issue' : 'Issue a Receipt' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useReceipt } from 'src/pages/payment/hooks/use-receipt'
// composables
const $q = useQuasar()
const { onViewReceipt } = useReceipt()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
</script>
