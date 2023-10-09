<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-member-detail-page"
  >
    <q-page-header
      title="Member user information"
      subtitle="View detail member user information and update member user name"
      :back="backAction"
    ></q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <member-users-information-card
      :user="activeUser"
      class="q-mb-md"
    ></member-users-information-card>
    <member-users-role-card
      :project-id="projectId"
      :user="activeUser"
      class="q-mb-md"
    ></member-users-role-card>
    <div class="row bg-white q-mb-lg rounded-borders">
      <member-users-permission-card
        :user="activeUser"
        :project-id="projectId"
        class="q-mb-md col-12"
      ></member-users-permission-card>
    </div>
  </div>

  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="project-member-detail-page__dialog"
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
    class="project-member-detail-page__dialog"
  >
    <q-skeleton-suspense>
      <project-role-delete-card
        v-if="rolesModal.type === 'DELETE_ROLE_MODAL'"
        @close="onCloseRolesModal"
        @refresh="fetchingData"
      ></project-role-delete-card>
      <project-role-permission-card
        v-if="rolesModal.type === 'VIEW_DETAIL_ROLE_PERMISSIONS_MODAL'"
        @close="onCloseRolesModal"
      ></project-role-permission-card>
      <project-role-create-card
        v-if="
          rolesModal.type === 'CREATE_NEW_ROLE_MODAL' ||
          rolesModal.type === 'UPDATE_ROLE_MODAL'
        "
        :modal-type="rolesModal.type"
        @close="onCloseRolesModal"
        @refresh="fetchingData"
      ></project-role-create-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { computed, defineAsyncComponent } from 'vue'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'

// lazy loading
const MemberUsersPermissionCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-permission-card.vue'
    )
)

const MemberUsersInformationCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-information-card.vue'
    )
)

const MemberUsersRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-role-card.vue'
    )
)

const MemberUsersDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-delete-card.vue'
    )
)

const ProjectRolePermissionCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-role/project-role-permission-card.vue'
    )
)

const ProjectRoleDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-role/project-role-delete-card.vue'
    )
)
const ProjectRoleCreateCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-role/project-role-create-card.vue'
    )
)

// props & emits
const emits = defineEmits(['close', 'refresh'])

// composables
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const {
  modal: rolesModal,
  onCloseModal: onCloseRolesModal,
  handleGetPermissionRoles,
  handleFetchAssignedRoleId,
} = useProjectRoles()
const { activeUser, modal, onCloseModal, handleGetTeamUserPermissionDetail } =
  useProjectMembers()

// computed
const backAction = computed(() => {
  return {
    name: 'Back to project members page',
    to: () =>
      router.push({
        name: PROJECT_MANAGEMENT_ROUTE_NAMES.MEMBERS,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const projectId = computed(() => {
  return route.params.projectId?.toString()
})

const userName = computed(() => {
  return route.params.userName?.toString()
})

// methods
async function fetchingData() {
  Promise.all([
    handleFetchAssignedRoleId(projectId.value, userName.value),
    handleGetPermissionRoles(),
    handleGetTeamUserPermissionDetail(projectId.value, userName.value),
  ])
}

// hooks
fetchingData()
</script>
