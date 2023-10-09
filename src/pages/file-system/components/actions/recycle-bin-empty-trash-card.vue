<template>
  <q-card class="recycle-bin-empty-trash-card">
    <q-card-section>
      <q-section-header title="Empty trash"></q-section-header>
    </q-card-section>
    <q-card-section>
      <span
        >Do you want to
        <span class="text-weight-bold text-negative">empty trash</span>? <br />
        All files will be remove. This cannot be undone.</span
      >
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { errorHandler } from 'src/core/utils/error-handler'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
// composables
const { t } = useI18n()
const { handleRecycleBinEmptyTrash, loading } = useFiles()

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Confirm'),
      action: onEmptyTrash,
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onEmptyTrash() {
  try {
    await handleRecycleBinEmptyTrash()
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.recycle-bin-empty-trash-card {
  min-width: 300px;
}
</style>
