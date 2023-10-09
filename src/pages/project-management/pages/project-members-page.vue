<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-members-page"
  >
    <q-page-header
      title="Project members"
      :subtitle="
        $t(
          `pages.memberUsers.Manager your project member and their account permission here`
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
    class="project-members-page__dialog"
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
        :project-id="projectId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-add-card>
      <member-users-assign-role-card
        :project-id="projectId"
        v-else-if="modal.type === 'ASSIGN_ROLE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></member-users-assign-role-card>
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
        @refresh="onFetchingData"
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
        @refresh="onFetchingData"
      ></project-role-create-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { computed, defineAsyncComponent, ref } from 'vue'
import { ProjectMember } from 'src/core/types/project-member-types'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { TablePagination } from 'src/core/types/pagging-types'

// lazy loading
const MemberUsersTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-table.vue'
    )
)
const MemberUsersActions = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-actions.vue'
    )
)
const MemberUsersDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-delete-card.vue'
    )
)
const MemberUsersAddCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-add-card.vue'
    )
)
const MemberUsersAssignRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-members/member-users-assign-role-card.vue'
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

// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { activeProject } = useProjects()
const {
  modal: rolesModal,
  onCloseModal: onCloseRolesModal,
  handleGetPermissionRoles,
} = useProjectRoles()
const { modal, loading, onCloseModal, handleFetchProjectMembers } =
  useProjectMembers()

// data
const memberUsers = ref<ProjectMember[]>([])

//computed
const backAction = computed(() => {
  return {
    name: 'Back to project page',
    to: () => router.push({ name: PROJECT_MANAGEMENT_ROUTE_NAMES.ENTRIES }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const projectId = computed(() => {
  return (
    route.params.projectId?.toString() || activeProject.value?.projectId || ''
  )
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// method
async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string
) {
  console.log(pagination)
  handleGetPermissionRoles()
  memberUsers.value = await handleFetchProjectMembers(
    projectId.value?.toString() ?? '',
    pagination,
    searchValue
  )
}
</script>
