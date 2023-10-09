<template>
  <q-card class="project-notes-json-card">
    <q-card-section>
      <q-section-header
        title="Export notes to JSON"
        sub-title="Click Export to save notes data in JSON format"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <q-alert
        class="q-mb-md"
        type="warning"
        >Note: Only previously selected notes will be exported
      </q-alert>
      <pre
        class="project-notes-json-card__content q-mb-sm bg-grey-1 q-pa-sm rounded-borders"
      >
        {{ prettyJson }}
      </pre>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Note } from 'src/core/types/note-types'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { useQuasar } from 'quasar'

// props & emits
const emits = defineEmits(['close'])

const props = defineProps<{
  notes?: Note[] | null
}>()

// composables
const { t } = useI18n()
const $q = useQuasar()
const { handleExportNotesByJson, loading } = useProjectNotes()

// computed
const prettyJson = computed(() => {
  return JSON.stringify({ notes: props.notes }, null, 2)
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
      name: t('textActions.Export'),
      action: onExportJSON,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function onExportJSON() {
  if (!props.notes) {
    $q.notify({
      message: 'Please select notes to export',
      type: 'warning',
    })
    return
  }
  handleExportNotesByJson(props.notes)
  emits('close')
}
</script>
<style lang="scss">
.project-notes-json-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
  &__content {
    overflow: hidden;
    white-space: pre-wrap;
  }
}
</style>
