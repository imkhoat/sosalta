<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-notes-page"
  >
    <q-page-header
      title="Project notes"
      :subtitle="$t(`pages.projectManagement.notes.Manager project notes`)"
      :back="backAction"
    >
      <template v-slot:action>
        <project-notes-actions
          :notes="notes"
          :notepage-id="notePageId"
          @refresh="onFetchingData"
        ></project-notes-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <project-notes-table
      :items="notes"
      :loading="loading"
    ></project-notes-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="project-notes-page__dialog"
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
      >
      </project-notes-recovery-card>
      <project-notes-create-card
        :notepage-id="notePageId"
        :project-team-id="projectTeamId"
        v-else-if="modal.type === 'NEW_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notes-create-card>
      <project-notes-rename-card
        v-else-if="modal.type === 'RENAME_NOTE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      >
      </project-notes-rename-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { Note } from 'src/core/types/note-types'
import { computed, defineAsyncComponent, ref } from 'vue'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { useProjectNotepages } from '../hooks/use-notepages'

// lazy loading
const ProjectNotesTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/table/project-notes-table.vue'
    )
)
const ProjectNotesActions = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/table/project-notes-actions.vue'
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
const ProjectNotesRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notes/project-notes-rename-card.vue'
    )
)

// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { activeProject } = useProjects()
const { modal, loading, onCloseModal, handleGetProjectNotes } =
  useProjectNotes()
const { activeNotepage } = useProjectNotepages()
// data
const notes = ref<Note[]>([])

//computed
const backAction = computed(() => {
  return {
    name: 'Back to notepage page',
    to: () =>
      router.push({
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.NOTEPAGES,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const projectId = computed(() => {
  return (
    route.params.projectId?.toString() || activeProject.value?.projectId || ''
  )
})
const projectTeamId = computed(() => {
  return activeProject.value?.projectTeamId
})
const notePageId = computed(() => {
  return (
    route.params.notePageId?.toString() ||
    activeNotepage.value?.notePageId ||
    ''
  )
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// method
async function onFetchingData() {
  notes.value = await handleGetProjectNotes(notePageId.value)
}

// hook
// onFetchingData()
</script>
