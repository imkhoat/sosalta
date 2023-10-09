<template>
  <div
    flat
    class="team-files-page"
  >
    <file-system-entries
      :back="backAction"
      page-title="Team"
      page-subtitle="Create and manage documents based on teams."
    >
    </file-system-entries>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { useTeamFiles } from 'src/pages/team-management/hooks/use-files'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from 'src/pages/team-management/router'
import FileSystemEntries from 'src/pages/file-system/components/file-system-entries.vue'

// composable
const router = useRouter()
const route = useRoute()
const { activeTeam } = useTeams()
const { handleGetUserTeamAuth } = useTeamFiles()
// computed

const backAction = computed(() => {
  return {
    name: 'Back to team page',
    to: () =>
      router.push({
        name: TEAM_MANAGEMENT_ROUTE_NAMES.ENTRIES,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const teamId = computed(() => {
  return route.params.teamId?.toString() || activeTeam.value?.groupId || ''
})

function onFetchingData() {
  handleGetUserTeamAuth(teamId.value)
}

onFetchingData()
</script>
<style lang="scss">
.team-files-page {
  &__empty {
    min-height: 70vh;
  }
}
</style>
