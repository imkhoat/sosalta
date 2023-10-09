<template>
  <q-card class="project-notes-recovery-card">
    <q-card-section>
      <q-section-header
        title="Recovery notes"
        sub-title="Select recovery notes and click restore"
      ></q-section-header>
    </q-card-section>
    <template v-if="!singleRecoveryMode">
      <q-card-section v-if="isExistingNotes">
        <div class="column justify-start items-start">
          <div class="row justify-between items-center full-width">
            <span class="text-caption text-disable q-mb-sm">Deleted notes</span>
            <q-toggle
              v-model="selectedAll"
              label="Select All"
              @update:model-value="onToggleSelectedAll"
            ></q-toggle>
          </div>
          <q-list
            bordered
            separator
            dense
            class="column justify-start items-start q-gutter-y-xs full-width rounded-borders"
          >
            <q-item
              v-for="(note, index) in notes"
              :key="index + '__project-management-role-list'"
              class="row justify-between items-center full-width"
            >
              <div class="row justify-between items-center full-width">
                <div>
                  <q-checkbox
                    v-model="selectedNotes"
                    :label="note.noteKey"
                    :val="note"
                  ></q-checkbox>
                </div>
                <q-btn
                  size="sm"
                  color="secondary"
                  flat
                  @click="onRecoverySingleNote(note)"
                  >Recovery</q-btn
                >
              </div>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-section v-else>
        <q-alert
          >There are no existing delete notes in the current notepage.!</q-alert
        >
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </template>
    <template v-else>
      <q-card-section>
        <project-notes-recovery-single-note
          :items="activeNoteHistories"
          @close="toggleSingleRecoveryMode"
          @refresh="onFetchingData"
        ></project-notes-recovery-single-note>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </template>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Note } from 'src/core/types/note-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesRecoverySingleNote from './project-notes-recovery-single-note.vue'
// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  notepageId: string | number
}>()

// data
const notes = ref<Note[]>([])
const selectedAll = ref(false)
const selectedNotes = ref<Note[]>([])

const activeNote = ref<Note>()
const activeNoteHistories = ref<Note[]>([])
const singleRecoveryMode = ref(false)
// composables
const { t } = useI18n()
const {
  handleGetDeletedNotes,
  handleRevertDeletedNotes,
  handleGetDeletedNoteHistory,
  loading,
} = useProjectNotes()

// computed
const isExistingNotes = computed(() => {
  return notes.value?.length > 0
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
      name: t('textActions.Restore'),
      action: onRestoreSelectedNotes,
      disable: !isExistingNotes.value,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function toggleSingleRecoveryMode() {
  singleRecoveryMode.value = !singleRecoveryMode.value
}

async function onRestoreSelectedNotes() {
  try {
    const payload = selectedNotes.value?.map((item) => item.noteId)

    const result = await handleRevertDeletedNotes(payload)

    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onFetchingData() {
  notes.value = await handleGetDeletedNotes(props.notepageId)
}

function onToggleSelectedAll() {
  if (selectedAll.value) {
    selectedNotes.value = notes.value
  } else {
    selectedNotes.value = []
  }
}

async function onRecoverySingleNote(note: Note) {
  activeNote.value = note
  activeNoteHistories.value = await handleGetDeletedNoteHistory(
    activeNote.value?.noteId
  )
  toggleSingleRecoveryMode()
}
onFetchingData()
</script>
<style lang="scss">
.project-notes-recovery-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
