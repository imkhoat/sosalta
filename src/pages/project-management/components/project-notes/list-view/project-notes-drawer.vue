<template>
  <div class="project-notes-drawer">
    <q-right-view>
      <project-notes-list
        :loading="loading"
        :items="notes"
      ></project-notes-list>
    </q-right-view>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { Note } from 'src/core/types/note-types'
import { computed, ref, watch } from 'vue'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'
import ProjectNotesList from 'src/pages/project-management/components/project-notes/list-view/project-notes-list.vue'

// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { activeProject } = useProjects()
const { activeNotepage } = useProjectNotepages()
const { loading, handleGetProjectNotes } = useProjectNotes()

// data
const notes = ref<Note[]>([])

//computed
const projectId = computed(() => {
  return (
    route.params.projectId?.toString() || activeProject.value?.projectId || ''
  )
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
  if (notePageId.value) {
    notes.value = await handleGetProjectNotes(notePageId.value)
  }
}

// hook
onFetchingData()

watch(
  () => notePageId.value,
  (newVal) => {
    if (newVal) {
      onFetchingData()
    }
  }
)
</script>
