<template>
  <div
    class="column items-stretch justify-start full-height no-wrap team-members-page"
  >
    <q-page-header
      :title="$t(`pages.teamManagement.members.Team members`)"
      :subtitle="
        $t(
          `pages.teamManagement.members.Manager your team member and their account permission here`
        )
      "
      :back="backAction"
    >
      <template v-slot:action>
        <member-users-actions></member-users-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <member-users-table
      :users="memberUsers"
      :loading="loading"
      @request="onFetchingData($event.pagination)"
      @search="onFetchingData(undefined, $event)"
    ></member-users-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="team-members-page__dialog"
  >
    <q-skeleton-suspense>
      <member-users-delete-card
        v-if="
          modal.type === 'DELETE_MEMBER_MODAL' ||
          modal.type === 'DELETE_MEMBERS_MODAL'
        "
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-delete-card>
      <member-users-add-card
        v-else-if="modal.type === 'NEW_MEMBER_MODAL'"
        :team-id="teamId"
        :exist-member="memberUsers"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-add-card>
      <member-users-assign-role-card
        :team-id="teamId"
        v-else-if="modal.type === 'ASSIGN_ROLE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-assign-role-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { computed, defineAsyncComponent, ref } from 'vue'
import { TeamMember } from 'src/core/types/team-member-types'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'

import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'
import { useTeamMembers } from 'src/pages/team-management/hooks/use-members'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { TablePagination } from 'src/core/types/pagging-types'

// lazy loading
const MemberUsersTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-table.vue'
    )
)
const MemberUsersActions = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-actions.vue'
    )
)
const MemberUsersDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-delete-card.vue'
    )
)
const MemberUsersAddCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-add-card.vue'
    )
)
const MemberUsersAssignRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-assign-role-card.vue'
    )
)
// composable
const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { activeTeam } = useTeams()
const { handleGetPermissionRoles } = useTeamRoles()
const { modal, loading, onCloseModal, handleFetchTeamMemberByTeamId } =
  useTeamMembers()

// data
const memberUsers = ref<TeamMember[]>([])

//computed
const backAction = computed(() => {
  return {
    name: t(`pages.teamManagement.members.Back to team page`),
    to: () => router.push({ name: TEAM_MANAGEMENT_ROUTE_NAMES.ENTRIES }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const teamId = computed(() => {
  return route.params.teamId?.toString() || activeTeam.value?.groupId || ''
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// method
async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string
) {
  handleGetPermissionRoles()
  memberUsers.value = await handleFetchTeamMemberByTeamId(
    teamId.value?.toString() ?? '',
    pagination,
    searchValue
  )
}

// hook
onFetchingData()
</script>
