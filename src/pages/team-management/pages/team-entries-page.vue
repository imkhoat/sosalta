<template>
  <div
    class="column items-stretch justify-start full-height no-wrap team-entries-page"
  >
    <q-page-header
      :title="$t(`pages.teamManagement.entries.Team management`)"
      :subtitle="
        $t(
          `pages.teamManagement.entries.Manager your team member and their account permission here`
        )
      "
    >
      <template v-slot:action>
        <team-management-actions></team-management-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <team-management-table
      :loading="loading"
      :teams="teams"
      :users="users"
      :active-user="activeUser"
      @request="onFetchingData($event.pagination)"
      @search="onFetchingData(undefined, $event)"
      @select="onSelectFilter"
    ></team-management-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    :persistent="modal.type === 'NEW_TEAM_MEMBERS'"
    class="team-entries-page__dialog"
  >
    <q-skeleton-suspense>
      <team-management-delete-card
        v-if="
          modal.type === 'DELETE_TEAM_MODAL' ||
          modal.type === 'DELETE_TEAMS_MODAL'
        "
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></team-management-delete-card>
      <team-management-new-card
        v-if="modal.type === 'NEW_TEAM_MEMBERS'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></team-management-new-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { TablePagination } from 'src/core/types/pagging-types'
import { useRoute, useRouter } from 'vue-router'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from '../router'

// lazy loading
const TeamManagementTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/entries/team-management-table.vue'
    )
)
const TeamManagementActions = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/entries/team-management-actions.vue'
    )
)
const TeamManagementDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/entries/team-management-delete-card.vue'
    )
)
const TeamManagementNewCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/entries/team-management-new-card.vue'
    )
)

// composables
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { modal, teams, loading, fetchTeamList, fetchGroupOwner, onToggleModal } =
  useTeams()

// data
const users = ref<string[]>([])
const activeUser = ref<string>(route?.query?.userName?.toString() ?? '')

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
function onCloseModal() {
  onToggleModal()
}
async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string
) {
  fetchTeamList(pagination, searchValue, activeUser.value)
  users.value = await fetchGroupOwner()
}

function onSelectFilter(userName: string) {
  activeUser.value = userName
  router.push({
    name: route.name ?? TEAM_MANAGEMENT_ROUTE_NAMES.ENTRIES,
    params: { ...route.params },
    query: { userName },
  })
  onFetchingData()
}

// onFetchingData()
</script>
