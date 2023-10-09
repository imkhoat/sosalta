<template>
  <div
    class="column items-stretch justify-start full-height no-wrap team-members-detail-page"
  >
    <q-page-header
      :title="$t(`pages.teamManagement.memberDetail.Member user information`)"
      :subtitle="
        $t(
          `pages.teamManagement.memberDetail.View detail member user information and update member user permission`
        )
      "
      :back="backAction"
    ></q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <member-users-information-card
      :user="activeUser"
      class="q-mb-md"
    ></member-users-information-card>
    <member-users-role-card
      :user="activeUser"
      :team-id="teamId"
      @refresh="fetchingData"
      class="q-mb-md"
    ></member-users-role-card>
    <div class="row bg-white q-mb-lg rounded-borders">
      <member-users-permission-card
        :user="activeUser"
        :team-id="teamId"
        @refresh="fetchingData"
        class="q-mb-md col-12"
      ></member-users-permission-card>
    </div>
  </div>

  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="team-members-detail-page__dialog"
  >
    <q-skeleton-suspense>
      <member-users-delete-card
        v-if="modal.type === 'DELETE_MEMBER_MODAL'"
        :user="activeUser"
        delete-type="DELETE_MEMBER_MODAL"
        @close="onCloseModal"
      ></member-users-delete-card>
    </q-skeleton-suspense>
  </q-dialog>
  <q-dialog
    v-model="rolesModal.open"
    :full-width="isMobile"
    class="team-members-detail-page__dialog"
  >
    <q-skeleton-suspense>
      <team-role-delete-card
        v-if="rolesModal.type === 'DELETE_ROLE_MODAL'"
        @close="onCloseRolesModal"
        @refresh="fetchingData"
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
        @refresh="fetchingData"
      ></team-role-create-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { computed, defineAsyncComponent } from 'vue'
import { TEAM_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'
import { useTeamMembers } from 'src/pages/team-management/hooks/use-members'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { useI18n } from 'vue-i18n'

// lazy loading
const MemberUsersPermissionCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-permission-card.vue'
    )
)

const MemberUsersInformationCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-information-card.vue'
    )
)

const MemberUsersRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-role-card.vue'
    )
)

const MemberUsersDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-members/member-users-delete-card.vue'
    )
)

const TeamPermissionCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/team-settings/team-permission-card.vue'
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

// composables
const $q = useQuasar()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const {
  modal: rolesModal,
  onCloseModal: onCloseRolesModal,
  handleGetPermissionRoles,
  handleFetchAssignedRoleId,
} = useTeamRoles()
const { activeUser, modal, onCloseModal, handleGetTeamUserPermissionDetail } =
  useTeamMembers()

// computed
const backAction = computed(() => {
  return {
    name: t(`pages.teamManagement.memberDetail.Back to team members page`),
    to: () =>
      router.push({
        name: TEAM_MANAGEMENT_ROUTE_NAMES.MEMBERS,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const teamId = computed(() => {
  return route.params.teamId?.toString()
})

const userName = computed(() => {
  return route.params.userName?.toString()
})

// methods
async function fetchingData() {
  Promise.all([
    handleFetchAssignedRoleId(teamId.value, userName.value),
    handleGetPermissionRoles(),
    handleGetTeamUserPermissionDetail(teamId.value, userName.value),
  ])
}

// hooks
fetchingData()
</script>
