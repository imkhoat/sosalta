<template>
  <div
    flat
    class="project-files-page"
  >
    <file-system-entries
      :back="backAction"
      page-title="Project"
      page-subtitle="Create and manage documents on a per-project basis."
    >
    </file-system-entries>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import FileSystemEntries from 'src/pages/file-system/components/file-system-entries.vue'
import { useProjectFiles } from '../hooks/use-files'
import { useProjects } from '../hooks/use-projects'
import { useAuthStore } from 'src/core/stores/auth'

// composable
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const { activeProject } = useProjects()
const { handleGetUserProjectAuth } = useProjectFiles()
const { getUserName } = storeToRefs(useAuthStore())
const { getActiveUserInformation } = storeToRefs(useFileSystemStore())
// data
const activeTab = ref(getActiveUserInformation.value?.userName)

// computed

const projectId = computed(() => {
  return (
    route.params.projectId?.toString() || activeProject.value?.projectId || ''
  )
})
const backAction = computed(() => {
  return {
    name: 'Back to team page',
    to: () =>
      router.push({
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.ENTRIES,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

// methods
function onFetchingData() {
  handleGetUserProjectAuth(projectId.value, getUserName.value)
}
onFetchingData()
</script>
<style lang="scss">
.project-files-page {
  &__empty {
    min-height: 70vh;
  }
}
</style>
