<template>
  <q-card class="project-notes-rename-card">
    <q-form
      ref="projectNoteRenameCard"
      no-error-focus
      :autofocus="false"
      @submit="onRenameProjectNote"
    >
      <q-card-section>
        <q-section-header
          title="Change note name"
          sub-title="Input new name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="note-name"
          label="New note name"
          stack-label
          outlined
          dense
          :rules="rules.newName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="form.noteKey"
          class="q-mb-md"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { Note } from 'src/core/types/note-types'

// props & emits
const emits = defineEmits(['close', 'refresh'])

// composables
const { t } = useI18n()
const { handleUpdateProjectNote, loading, activeNote } = useProjectNotes()
const { requiredRules } = useRules()

// data
const form = reactive({
  noteKey: activeNote?.value?.noteKey,
})
const rules = reactive({
  newName: requiredRules,
})
const projectNoteRenameCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      flat: true,
      name: t('textActions.Save'),
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onRenameProjectNote() {
  try {
    const valid: boolean | undefined =
      await projectNoteRenameCard?.value?.validate()
    if (!valid || !activeNote.value) return

    const params: Note = {
      ...activeNote.value,
      ...form,
    } as Note
    const response = await handleUpdateProjectNote(params)

    if (response) {
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
.project-notes-rename-card {
  min-width: 300px;
}
</style>
