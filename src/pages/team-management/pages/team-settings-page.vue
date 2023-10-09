<template>
  <div
    class="column items-stretch justify-start full-height no-wrap team-settings-page"
  >
    <q-page-header
      :title="$t(`pages.teamManagement.teamSettings.Team information`)"
      :subtitle="
        $t(
          `pages.teamManagement.teamSettings.View detail team information and update team name`
        )
      "
      :back="backAction"
    ></q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <team-basic-information-card
      :team="activeTeam"
      class="q-mb-lg"
    ></team-basic-information-card>
    <team-role-card></team-role-card>
  </div>

  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    :persistent="modal.type === 'NEW_TEAM_MEMBERS'"
    class="team-settings-page__dialog"
  >
    <q-skeleton-suspense>
      <team-management-delete-card
        v-if="modal.type === 'DELETE_TEAM_MODAL'"
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></team-management-delete-card>
      <team-management-rename-card
        v-if="modal.type === 'RENAME_TEAM_MODAL'"
        :team-id="teamId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></team-management-rename-card>
    </q-skeleton-suspense>
  </q-dialog>
  <q-dialog
    v-model="rolesModal.open"
    :full-width="isMobile"
    class="team-settings-page__dialog"
  >
    <q-skeleton-suspense>
      <team-role-delete-card
        v-if="rolesModal.type === 'DELETE_ROLE_MODAL'"
        @close="onCloseRolesModal"
        @refresh="onFetchingData"
      ></team-role-delete-card>
      <team-permission-card
        v-if="rolesModal.type === 'VIEW_DETAIL_ROLE_PERMISSIONS_MODAL'"
        @close="onCloseRolesModal"
      ></team-permission-card>
      <team-role-create-card
        v-if="
          rolesModal.type === 'CREATE_NEW_ROLE_MODAL' ||
          rolesModal.type === 'UPDATE_ROLE_MODAL'
        "
        :modal-type="rolesModal.type"
        @close="onCloseRolesModal"
        @refresh="onFetchingData"
      ></team-role-create-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { computed, defineAsyncComponent } from 'vue'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'

import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'

// lazy loading component
const TeamRoleCard = defineAsyncComponent(
  () =>
    import('src/pages/team-management/components/team-role/team-role-card.vue')
)
const TeamBasicInformationCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-settings/team-basic-information-card.vue'
    )
)
const TeamManagementDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/entries/team-management-delete-card.vue'
    )
)
const TeamManagementRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/entries/team-management-rename-card.vue'
    )
)
const TeamRoleDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-role/team-role-delete-card.vue'
    )
)
const TeamRoleCreateCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-role/team-role-create-card.vue'
    )
)

const TeamPermissionCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-settings/team-permission-card.vue'
    )
)

// composables
const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const {
  modal: rolesModal,
  onCloseModal: onCloseRolesModal,
  handleGetPermissionRoles,
} = useTeamRoles()
const { modal, activeTeam, handleGetTeamDetail, onCloseModal } = useTeams()

// computed
const backAction = computed(() => {
  return {
    name: t(`pages.teamManagement.teamSettings.Back to team page`),
    to: () => router.push({ name: TEAM_MANAGEMENT_ROUTE_NAMES.ENTRIES }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const teamId = computed(() => {
  return (
    (route.params?.teamId as string) || (activeTeam.value?.groupId as string)
  )
})

// methods
function onFetchingData() {
  handleGetTeamDetail(teamId.value as string)
  handleGetPermissionRoles()
}

// hooks
onFetchingData()
</script>
