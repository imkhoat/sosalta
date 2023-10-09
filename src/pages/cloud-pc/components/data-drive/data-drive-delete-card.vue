<template>
  <q-card class="data-drive-delete-card">
    <q-card-section>
      <q-section-header
        title="Delete data drive"
        sub-title="Check data drive name and click confirm button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p
        class="q-mb-sm"
        v-html="deleteAlertMessage"
      ></p>
      <q-alert type="warning"
        >Note: This delete action cannot be undone once confirmed.</q-alert
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
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useCloudPCDataDrives } from 'src/pages/cloud-pc/hooks/use-data-drive'
import { DataDrive } from 'src/core/types/data-drive-types'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  deleteType: 'DELETE_DATA_DRIVE_MODAL' | 'DELETE_DATA_DRIVES_MODAL'
  user?: DataDrive | null
}>()

// composables
const { t } = useI18n()
const {
  handleDeleteActiveDataDrive,
  handleDeleteSelectedDataDrives,
  loading,
  activeDataDrive,
  selectedDataDrives,
} = useCloudPCDataDrives()

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
      loading: loading.value,
    },
  ]
})

const deleteAlertMessage = computed(() => {
  if (props.deleteType === 'DELETE_DATA_DRIVE_MODAL') {
    return `Do you want to delete <span class="text-weight-bold text-negative">${activeDataDrive.value?.driveName}</span> drive?`
  } else {
    return `Do you want to delete those <span class="text-weight-bold text-negative">${selectedDataDrives.value?.length}</span> drives?`
  }
})

// methods
function onClose() {
  emits('close')
}

async function onDeleteObject() {
  try {
    let result: boolean | undefined = false
    if (props.deleteType === 'DELETE_DATA_DRIVES_MODAL') {
      result = await handleDeleteSelectedDataDrives()
    } else {
      result = await handleDeleteActiveDataDrive()
    }
    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.data-drive-delete-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
