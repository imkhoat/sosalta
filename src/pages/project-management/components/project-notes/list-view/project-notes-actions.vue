<template>
  <div
    class="row justify-end items-center full-width q-gutter-x-sm q-gutter-xs-y-sm project-notes-actions"
  >
    <q-toggle
      v-model="selectAll"
      label="Select All"
      class="q-mr-lg"
      @update:model-value="onToggleSelectAll"
    />
    <q-btn
      v-if="hasDeleteProjectNoteAuthorization"
      :disable="!isSelectedUser"
      outline
      round
      rounded
      no-wrap
      unelevated
      size="sm"
      color="primary"
      @click="onDeleteNotes"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
      ></q-icon>
      <q-tooltip>Delete notes</q-tooltip>
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
      round
      rounded
      no-wrap
      unelevated
      size="sm"
      color="primary"
      @click="onViewRecoveryNotes"
    >
      <q-icon
        size="xs"
        name="sym_o_settings_backup_restore"
      ></q-icon
      ><q-tooltip>Recover</q-tooltip>
    </q-btn>
    <q-btn
      v-if="hasCreateProjectNoteAuthorization"
      round
      rounded
      no-wrap
      unelevated
      color="primary"
      size="sm"
      @click="onCreateNewNote"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
      ></q-icon>
      <q-tooltip>{{ isMobile ? 'New note' : 'Create new note' }}</q-tooltip>
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesActionsSorting from 'src/pages/project-management/components/project-notes/list-view/project-notes-actions-sorting.vue'
import ProjectNotesActionsExport from 'src/pages/project-management/components/project-notes/list-view/project-notes-actions-export.vue'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

// composables
const $q = useQuasar()
const {
  onCreateNewNote,
  onDeleteNotes,
  onViewRecoveryNotes,
  setSelectedNotes,
  resetSelectedNotes,
  selectedNotes,
} = useProjectNotes()
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

// data
const selectAll = ref(false)

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectedNotes?.value?.length > 0
})

//methods
function onToggleSelectAll() {
  if (selectAll.value) {
    setSelectedNotes(props.notes)
  } else {
    resetSelectedNotes()
  }
}
</script>
