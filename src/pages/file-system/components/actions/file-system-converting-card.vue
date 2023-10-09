<template>
  <q-card class="file-system-converting-card">
    <q-card-section>
      <q-section-header title="Converting file"></q-section-header>
    </q-card-section>
    <q-card-section>
      <span
        >The file <strong>{{ getActiveObject?.name }}</strong> is converting,
        please wait...</span
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
import { storeToRefs } from 'pinia'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useFileSystemStore } from 'src/core/stores/file-system'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { getActiveObject } = storeToRefs(useFileSystemStore())

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
  ]
})

function onClose() {
  emits('close')
}
</script>
<style lang="scss">
.file-system-converting-card {
  min-width: 300px;
}
</style>
