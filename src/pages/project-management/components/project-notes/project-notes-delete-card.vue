<template>
  <q-card class="note-management-delete-card">
    <q-card-section>
      <q-section-header
        title="Delete note"
        sub-title="Check note name and click confirm button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p
        class="q-mb-sm"
        v-html="deleteAlertMessage"
      ></p>
      <q-alert type="warning"
        >Note: After the note is deleted, you can recover the data in "Deleted
        Notes".
      </q-alert>
    </q-card-section>
    <q-card-section class="column justify-start items-stretch bg-grey-1">
      <span class="text-caption text-disable">Delete below notes</span>
      <q-checkbox
        v-for="(note, index) in removeNotes"
        :key="index + '__note-management-delete-card'"
        :model-value="true"
        :label="note?.noteKey"
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
import { Note } from 'src/core/types/note-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  deleteType: 'DELETE_NOTE_MODAL' | 'DELETE_NOTES_MODAL'
  note?: Note | null
}>()

// composables
const { t } = useI18n()
const {
  handleDeleteActiveNote,
  handleDeleteSelectedNotes,
  loading,
  activeNote,
  selectedNotes,
} = useProjectNotes()

// computed
const removeNotes = computed(() => {
  return props.deleteType === 'DELETE_NOTES_MODAL'
    ? selectedNotes.value
    : [activeNote.value]
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
  if (props.deleteType === 'DELETE_NOTE_MODAL') {
    return `Do you want to delete <span class="text-weight-bold text-negative">${activeNote.value?.noteKey}</span> note?`
  } else {
    return `Do you want to delete those <span class="text-weight-bold text-negative">${selectedNotes.value?.length}</span> notes?`
  }
})

// methods
function onClose() {
  emits('close')
}

async function onDeleteObject() {
  try {
    let result: boolean | undefined = false
    if (props.deleteType === 'DELETE_NOTES_MODAL') {
      result = await handleDeleteSelectedNotes()
    } else {
      result = await handleDeleteActiveNote()
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
.note-management-delete-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
