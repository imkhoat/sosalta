<template>
  <q-card class="project-notes-rename-card">
    <q-card-section>
      <q-section-header
        title="Note history"
        :sub-title="activeNote?.noteKey"
      ></q-section-header>
    </q-card-section>
    <q-card-section v-if="loading">
      <q-card flat>
        <q-card-section>
          <q-skeleton
            type="text"
            width="30%"
            class="text-caption"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1 q-mb-md"
          />
          <q-skeleton
            type="text"
            width="30%"
            class="text-caption"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1 q-mb-md"
          />
          <q-skeleton
            type="text"
            width="30%"
            class="text-caption"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1"
          />
          <q-skeleton
            type="text"
            class="text-subtitle1 q-mb-md"
          />
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section v-else-if="activeNoteHistories?.length > 0">
      <project-notes-recovery-single-note
        :view-mode="true"
        :items="activeNoteHistories"
      ></project-notes-recovery-single-note>
    </q-card-section>
    <q-card-section
      v-else
      class="bg-grey-1"
    >
      <q-empty-data content="No modification history"></q-empty-data>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { Note } from 'src/core/types/note-types'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesRecoverySingleNote from 'src/pages/project-management/components/project-notes/project-notes-recovery-single-note.vue'

// props & emits
const emits = defineEmits(['close', 'refresh'])

// composables
const { t } = useI18n()
const { handleGetNoteHistory, activeNote, loading } = useProjectNotes()

// data
const activeNoteHistories = ref<Note[]>([])

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

// methods
function onClose() {
  emits('close')
}

async function onFetchingSingleNoteHistory() {
  activeNoteHistories.value = await handleGetNoteHistory(
    activeNote.value?.noteId ?? ''
  )
}

onFetchingSingleNoteHistory()
</script>
<style lang="scss">
.project-notes-rename-card {
  width: calc(100vw - 48px);
  max-width: 560px;
}
</style>
