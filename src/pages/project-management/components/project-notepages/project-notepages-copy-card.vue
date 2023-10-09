<template>
  <q-card class="notepage-management-copy-card">
    <q-card-section>
      <q-section-header
        title="Copy notepage"
        sub-title="Check project name and click confirm button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p
        class="q-mb-sm"
        v-html="deleteAlertMessage"
      ></p>
      <q-alert type="warning"
        >Note: All this notepage's notes will be copy with this
        notepage.</q-alert
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
import { Notepage } from 'src/core/types/notepage-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  user?: Notepage | null
}>()

// composables
const { t } = useI18n()
const { handleCopyActiveNotepage, loading, activeNotepage, selectedNotepages } =
  useProjectNotepages()

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
      action: onCopyObject,
      loading: loading.value,
    },
  ]
})

const deleteAlertMessage = computed(() => {
  return `Do you want to copy <span class="text-weight-bold text-primary">${activeNotepage.value?.pageName}</span> notepage?`
})

// methods
function onClose() {
  emits('close')
}

async function onCopyObject() {
  try {
    const result = await handleCopyActiveNotepage()
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
.notepage-management-copy-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
