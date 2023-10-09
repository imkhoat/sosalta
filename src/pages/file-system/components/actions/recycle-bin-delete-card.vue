<template>
  <q-card class="recycle-bin-delete-card">
    <q-card-section>
      <q-section-header title="Delete file"></q-section-header>
    </q-card-section>
    <q-card-section>
      <span v-html="deleteAlertMessage"></span>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useFileSystemStore } from 'src/core/stores/file-system'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { errorHandler } from 'src/core/utils/error-handler'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  deleteType: 'RECYCLE_BIN_DELETE_MODAL' | 'RECYCLE_BIN_DELETE_ACTIVE_MODAL'
}>()
// composables
const { t } = useI18n()
const {
  handleRecycleBinDeleteActiveFile,
  handleRecycleBinDeleteFiles,
  loading,
} = useFiles()
const { getActiveObject, getSelectedObjects } = storeToRefs(
  useFileSystemStore()
)

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
      action: onDeleteObject,
      disable: disableConfirmButton.value,
      loading: loading.value,
    },
  ]
})

const disableConfirmButton = computed(() => {
  return props.deleteType === 'RECYCLE_BIN_DELETE_MODAL'
    ? getSelectedObjects.value?.length === 0
    : false
})

const deleteAlertMessage = computed(() => {
  if (props.deleteType === 'RECYCLE_BIN_DELETE_ACTIVE_MODAL') {
    return `Do you want to permanently delete <span class="text-weight-bold text-negative">${getActiveObject.value?.name}</span> file?`
  } else {
    return `Do you want to permanently delete those <span class="text-weight-bold text-negative">${getSelectedObjects.value?.length}</span> files?`
  }
})

function onClose() {
  emits('close')
}
async function onDeleteObject() {
  try {
    if (props.deleteType === 'RECYCLE_BIN_DELETE_ACTIVE_MODAL') {
      await handleRecycleBinDeleteActiveFile()
    } else {
      await handleRecycleBinDeleteFiles()
    }
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.recycle-bin-delete-card {
  min-width: 300px;
}
</style>
