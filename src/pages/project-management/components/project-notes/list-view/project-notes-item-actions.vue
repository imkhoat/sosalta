<template>
  <q-btn
    :disabled="totalNotes === 0"
    round
    rounded
    size="sm"
    flat
    color="primary"
    @click="onShowContextMenu"
  >
    <q-icon
      size="xs"
      name="sym_o_more_vert"
    ></q-icon>
    <q-tooltip>Actions</q-tooltip>
    <q-menu
      v-if="!isMobile"
      auto-close
      class="menus-context"
    >
      <q-list class="project-notes-actions-export__menu-list">
        <q-item
          clickable
          class="row justify-start"
          @click="onEditNote(note)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_edit"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Edit</q-item-section
          >
        </q-item>
        <q-item
          disabled
          clickable
          class="row justify-start"
          @click="onDeleteNote(note)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_wb_iridescent"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Arrange</q-item-section
          >
        </q-item>
        <q-item
          clickable
          class="row justify-start"
          @click="onViewHistoryNote(note)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_calendar_month"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >History</q-item-section
          >
        </q-item>
        <q-item
          v-if="hasDeleteProjectNoteAuthorization"
          clickable
          class="row justify-start"
          @click="onDeleteNote(note)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_delete"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Delete</q-item-section
          >
        </q-item>
        <q-item
          v-if="hasEditProjectNoteAuthorization"
          clickable
          class="row justify-start"
          @click="onRenameNote(note)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_edit"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >Rename</q-item-section
          >
        </q-item>
        <q-item
          clickable
          class="row justify-start"
          @click="onViewDetailNote(note)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_description"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none"
            >View detail</q-item-section
          >
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <q-dialog
    v-if="isMobile"
    v-model="menusDialog"
    position="bottom"
    class="project-notes-item-actions__dialog"
  >
    <q-card class="project-notes-item-actions__card">
      <q-linear-progress
        :value="1"
        color="primary"
        size="sm"
      />
      <q-card-section>
        <q-list class="project-notes-actions-export__menu-list">
          <q-item
            clickable
            class="row justify-start"
            @click="onEditNote(note)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="md"
                  color="grey-2"
                  text-color="primary-4"
                  class="q-box-content"
                >
                  <div class="row justify-center items-center no-wrap">
                    <q-icon
                      size="xs"
                      name="sym_o_edit"
                      class="material-icons-round"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Edit</q-item-section
            >
          </q-item>
          <q-item
            clickable
            class="row justify-start"
            @click="onDeleteNote(note)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="md"
                  color="grey-2"
                  text-color="primary-4"
                  class="q-box-content"
                >
                  <div class="row justify-center items-center no-wrap">
                    <q-icon
                      size="xs"
                      name="sym_o_delete"
                      class="material-icons-round"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Delete</q-item-section
            >
          </q-item>
          <q-item
            v-if="hasEditProjectNoteAuthorization"
            clickable
            class="row justify-start"
            @click="onRenameNote(note)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="md"
                  color="grey-2"
                  text-color="primary-4"
                  class="q-box-content"
                >
                  <div class="row justify-center items-center no-wrap">
                    <q-icon
                      size="xs"
                      name="sym_o_edit"
                      class="material-icons-round"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Rename</q-item-section
            >
          </q-item>
          <q-item
            clickable
            class="row justify-start"
            @click="onViewHistoryNote(note)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="md"
                  color="grey-2"
                  text-color="primary-4"
                  class="q-box-content"
                >
                  <div class="row justify-center items-center no-wrap">
                    <q-icon
                      size="xs"
                      name="sym_o_calendar_month"
                      class="material-icons-round"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >History</q-item-section
            >
          </q-item>
          <q-item
            clickable
            class="row justify-start"
            @click="onViewDetailNote(note)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="md"
                  color="grey-2"
                  text-color="primary-4"
                  class="q-box-content"
                >
                  <div class="row justify-center items-center no-wrap">
                    <q-icon
                      size="xs"
                      name="sym_o_description"
                      class="material-icons-round"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >View</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

interface ExportOption {
  name: string
  icon: string
  type: 'JSON' | 'PDF'
}

// composable
const $q = useQuasar()
const {
  handleExportNotesByPDF,
  handleExportNotesByJson,
  onDeleteNote,
  onRenameNote,
  onEditNote,
  onViewDetailNote,
  onViewHistoryNote,
} = useProjectNotes()
const {
  hasDeleteProjectNoteAuthorization,
  hasEditProjectNoteAuthorization,
  hasExportProjectNoteAuthorization,
} = useActiveProjectActionsVisible()
// props & emits
const props = defineProps<{
  notepageId?: number | string
  note: Note
}>()
const emits = defineEmits(['close', 'refresh'])

// data
const menusDialog = ref(false)
const exportOptions = ref<ExportOption[]>([
  { name: 'Export as JSON', icon: 'sym_o_data_object', type: 'JSON' },
  { name: 'Export as PDF', icon: 'sym_o_picture_as_pdf', type: 'PDF' },
])

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const totalNotes = computed(() => {
  return props.notes?.length
})

// methods

function onShowContextMenu() {
  menusDialog.value = !menusDialog.value
}

async function onExport(type: 'JSON' | 'PDF') {
  if (type === 'JSON') {
    handleExportNotesByJson(props.notes)
  } else {
    handleExportNotesByPDF(props.notes)
  }
}
</script>
