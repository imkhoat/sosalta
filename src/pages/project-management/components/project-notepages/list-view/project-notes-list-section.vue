<template>
  <q-card
    flat
    class="full-height no-wrap project-notes-list-section column justify-start items-stretch"
  >
    <q-card-section class="project-notes-list-section__header q-pb-none">
      <q-toolbar class="q-py-md row justify-between items-start">
        <div
          class="project-notes-header__title column justify-center items-start q-mb-md col-grow"
        >
          <strong class="title text-subtitle1 text-weight-bold"
            >Notes list</strong
          >
          <span class="subtitle text-caption text-disable no-wrap"
            >Use checkbox to select notes and click button to edit.</span
          >
        </div>
        <project-notes-actions
          :notes="notes"
          :notepage-id="notePageId"
          @refresh="onFetchingData"
        ></project-notes-actions>
      </q-toolbar>
    </q-card-section>
    <q-card-section class="col-grow q-pt-none">
      <q-scroll-area
        style="height: 100%"
        :thumb-style="{ width: '4px' }"
      >
        <q-card
          flat
          v-if="loading"
        >
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
        <project-notes-list
          v-else-if="notes.length > 0"
          :items="notes"
          :loading="loading"
          @refresh="onFetchingData"
        ></project-notes-list>
        <q-card
          flat
          v-else
        >
          <q-card-section class="column justify-center items-center q-py-xl">
            <q-avatar
              size="80px"
              color="grey-1"
            >
              <q-avatar
                size="60px"
                color="grey-3"
              >
                <q-icon
                  size="xxl"
                  color="grey-5"
                  name="sym_o_shopping_bag"
                ></q-icon>
              </q-avatar>
            </q-avatar>
            <span class="text-disable text-caption">Data not found</span>
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    :persistent="modal.type === 'NEW_NOTE_MODAL'"
    class="project-notes-list-section__dialog"
  >
    <q-skeleton-suspense>
      <project-notes-delete-card
        v-if="
          modal.type === 'DELETE_NOTE_MODAL' ||
          modal.type === 'DELETE_NOTES_MODAL'
        "
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notes-delete-card>
      <project-notes-recovery-card
        v-else-if="modal.type === 'VIEW_RECOVERY_NOTES'"
        :notepage-id="notePageId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notes-recovery-card>
      <project-notes-create-card
        :notepage-id="notePageId"
        :project-team-id="projectTeamId"
        v-else-if="modal.type === 'NEW_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notes-create-card>
      <project-notes-json-card
        :notes="selectedNotes"
        :note-page="activeNotepage"
        @close="onCloseModal"
        v-else-if="modal.type === 'EXPORT_JSON_NOTES_MODAL'"
      ></project-notes-json-card>
      <project-notes-pdf-card
        :notes="selectedNotes"
        :note-page="activeNotepage"
        @close="onCloseModal"
        v-else-if="modal.type === 'EXPORT_PDF_NOTES_MODAL'"
      ></project-notes-pdf-card>
      <project-notes-rename-card
        v-else-if="modal.type === 'RENAME_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      >
      </project-notes-rename-card>
      <project-notes-history-card
        v-else-if="modal.type === 'HISTORY_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      >
      </project-notes-history-card>
      <project-notes-edit-card
        :notepage-id="notePageId"
        :project-team-id="projectTeamId"
        v-else-if="modal.type === 'EDIT_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notes-edit-card>
      <project-notes-view-card
        :notepage-id="notePageId"
        :project-team-id="projectTeamId"
        v-else-if="modal.type === 'VIEW_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notes-view-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { Note } from 'src/core/types/note-types'
import { Notepage } from 'src/core/types/notepage-types'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'

// lazy loading
const ProjectNotesList = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/list-view/project-notes-list.vue'
    )
)
const ProjectNotesActions = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/list-view/project-notes-actions.vue'
    )
)
const ProjectNotesDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-delete-card.vue'
    )
)
const ProjectNotesRecoveryCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-recovery-card.vue'
    )
)
const ProjectNotesCreateCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-create-card.vue'
    )
)

const ProjectNotesJsonCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/list-view/project-notes-json-card.vue'
    )
)

const ProjectNotesPdfCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/list-view/project-notes-pdf-card.vue'
    )
)

const ProjectNotesRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-rename-card.vue'
    )
)

const ProjectNotesHistoryCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-history-card.vue'
    )
)

const ProjectNotesEditCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-edit-card.vue'
    )
)

const ProjectNotesViewCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-view-card.vue'
    )
)
// props
const props = defineProps<{
  notePages?: Notepage[] | undefined
}>()
// composable
const $q = useQuasar()
const route = useRoute()
const { activeProject } = useProjects()
const { modal, loading, selectedNotes, onCloseModal, handleGetProjectNotes } =
  useProjectNotes()
const { activeNotepage } = useProjectNotepages()

// data
const notes = ref<Note[]>([])

//computed
const isShowNotes = computed(() => {
  return props.notePages && props.notePages?.length > 0
})

const projectTeamId = computed(() => {
  return activeProject.value?.projectTeamId
})

const notePageId = computed(() => {
  return (
    route.query.notepageId?.toString() || activeNotepage.value?.notePageId || ''
  )
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// method
async function onFetchingData() {
  if (notePageId.value) {
    notes.value = await handleGetProjectNotes(notePageId.value)
  }
}

// hook
watch(
  () => route.fullPath,
  () => {
    onFetchingData()
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss">
.project-notes-list-section {
  position: relative;

  &__header {
    position: sticky;
    top: 0;
  }
}
</style>
