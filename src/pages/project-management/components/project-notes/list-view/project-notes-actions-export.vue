<template>
  <q-btn
    :disabled="totalNotes === 0"
    outline
    round
    rounded
    size="sm"
    no-wrap
    unelevated
    color="primary"
    @click="onShowContextMenu"
  >
    <q-icon
      size="xs"
      name="sym_o_export_notes"
    ></q-icon
    ><q-tooltip>Export</q-tooltip>
    <q-menu
      v-if="!isMobile"
      class="menus-context"
    >
      <q-list class="project-notes-actions-export__menu-list">
        <q-item
          v-for="(item, index) in exportOptions"
          :key="index"
          clickable
          class="row justify-start"
          @click="onExport(item.type, notes)"
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
                    :name="item.icon"
                    class="material-icons-round"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none">
            {{ item?.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <q-dialog
    v-if="isMobile"
    v-model="menusDialog"
    position="bottom"
    class="project-notes-actions-export__dialog"
  >
    <q-card class="project-notes-actions-export__card">
      <q-linear-progress
        :value="1"
        color="primary"
        size="sm"
      />
      <q-card-section>
        <q-list class="project-notes-actions-export__menu-list">
          <q-item
            v-for="(item, index) in exportOptions"
            :key="index"
            clickable
            class="row justify-start"
            @click="onExport(item.type, notes)"
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
                      :name="item.icon"
                      class="material-icons-round"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none">
              {{ item?.name }}
            </q-item-section>
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

interface ExportOption {
  name: string
  icon: string
  type: 'EXPORT_JSON_NOTES_MODAL' | 'EXPORT_PDF_NOTES_MODAL'
}

// composable
const $q = useQuasar()
const { onExport } = useProjectNotes()

// props & emits
const props = defineProps<{
  notepageId: number | string
  notes: Note[]
}>()
const emits = defineEmits(['close', 'refresh'])

// data
const menusDialog = ref(false)
const exportOptions = ref<ExportOption[]>([
  {
    name: 'Export as JSON',
    icon: 'sym_o_data_object',
    type: 'EXPORT_JSON_NOTES_MODAL',
  },
  {
    name: 'Export as PDF',
    icon: 'sym_o_picture_as_pdf',
    type: 'EXPORT_PDF_NOTES_MODAL',
  },
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
</script>
