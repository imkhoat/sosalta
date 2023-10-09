<template>
  <q-card class="notepage-management-delete-card">
    <q-card-section>
      <q-section-header
        title="Delete project"
        sub-title="Check project name and click confirm button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p
        class="q-mb-sm"
        v-html="deleteAlertMessage"
      ></p>
      <q-alert type="warning"
        >Note: After a note page is deleted, the note page and the information
        in the note page cannot be recovered.</q-alert
      >
    </q-card-section>
    <q-card-section class="column justify-start items-stretch bg-grey-1">
      <span class="text-caption text-disable">Delete below notepage</span>
      <q-checkbox
        v-for="(page, index) in removeNotepages"
        :key="index + '__notepage-management-delete-card'"
        :model-value="true"
        :label="page.pageName"
        readonly
        disable
      ></q-checkbox>
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
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'
import { Notepage } from 'src/core/types/notepage-types'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  deleteType: 'DELETE_NOTEPAGE_MODAL' | 'DELETE_NOTEPAGES_MODAL'
  user?: Notepage | null
}>()

// composables
const { t } = useI18n()
const {
  handleDeleteActiveNotepage,
  handleDeleteSelectedNotepages,
  loading,
  activeNotepage,
  selectedNotepages,
} = useProjectNotepages()

// computed
const removeNotepages = computed(() => {
  return props.deleteType === 'DELETE_NOTEPAGES_MODAL'
    ? selectedNotepages.value
    : [activeNotepage.value]
})
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
  if (props.deleteType === 'DELETE_NOTEPAGE_MODAL') {
    return `Do you want to delete <span class="text-weight-bold text-negative">${activeNotepage.value?.pageName}</span> notepage?`
  } else {
    return `Do you want to delete those <span class="text-weight-bold text-negative">${selectedNotepages.value?.length}</span> notepages?`
  }
})

// methods
function onClose() {
  emits('close')
}

async function onDeleteObject() {
  try {
    let result: boolean | undefined = false
    if (props.deleteType === 'DELETE_NOTEPAGES_MODAL') {
      result = await handleDeleteSelectedNotepages()
    } else {
      result = await handleDeleteActiveNotepage()
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
.notepage-management-delete-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
