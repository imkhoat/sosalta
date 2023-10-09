<template>
  <div
    class="row justify-end items-center full-width q-gutter-x-sm q-gutter-xs-y-sm project-notes-actions"
  >
    <q-btn
      v-if="hasDeleteProjectNoteAuthorization"
      :disable="!isSelectedUser"
      outline
      no-wrap
      unelevated
      color="primary"
      @click="onDeleteNotes"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
        class="q-mr-xs"
      ></q-icon
      >Delete notes
    </q-btn>
    <project-notes-actions-sorting
      :notes="notes"
      :notepage-id="notepageId"
      @close="emits('close')"
      @refresh="emits('refresh')"
    ></project-notes-actions-sorting>
    <project-notes-actions-export
      v-if="hasExportProjectNoteAuthorization"
      :notes="selectedNotes"
      :notepage-id="notepageId"
      @close="emits('close')"
      @refresh="emits('refresh')"
    ></project-notes-actions-export>
    <q-btn
      outline
      no-wrap
      unelevated
      color="primary"
      @click="onViewRecoveryNotes"
    >
      <q-icon
        size="xs"
        name="sym_o_settings_backup_restore"
        class="q-mr-xs"
      ></q-icon
      >Recover
    </q-btn>
    <q-btn
      v-if="hasCreateProjectNoteAuthorization"
      push
      no-wrap
      color="primary"
      @click="onCreateNewNote"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'New note' : 'Create new note' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesActionsSorting from 'src/pages/project-management/components/project-notes/project-notes-actions-sorting.vue'
import ProjectNotesActionsExport from 'src/pages/project-management/components/project-notes/project-notes-actions-export.vue'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

// composables
const $q = useQuasar()
const { onCreateNewNote, onDeleteNotes, onViewRecoveryNotes, selectedNotes } =
  useProjectNotes()
const {
  hasDeleteProjectNoteAuthorization,
  hasExportProjectNoteAuthorization,
  hasCreateProjectNoteAuthorization,
} = useActiveProjectActionsVisible()
// props & emits
const props = defineProps<{
  notepageId: number | string
  notes: Note[]
}>()
const emits = defineEmits(['close', 'refresh'])

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectedNotes?.value?.length > 0
})
</script>
