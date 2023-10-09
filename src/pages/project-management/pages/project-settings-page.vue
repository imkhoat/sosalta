<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-settings-page"
  >
    <q-page-header
      title="Project information"
      subtitle="View detail project information and update project name"
      :back="backAction"
    ></q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <project-basic-information-card
      :project="activeProject"
      class="q-mb-lg"
    ></project-basic-information-card>
    <project-role-card></project-role-card>
  </div>

  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    :persistent="modal.type === 'NEW_PROJECT_MEMBERS'"
    class="project-settings-page__dialog"
  >
    <q-skeleton-suspense>
      <project-management-delete-card
        v-if="modal.type === 'DELETE_PROJECT_MODAL'"
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onBackToEntriesPage"
      ></project-management-delete-card>
      <project-management-rename-card
        v-if="modal.type === 'RENAME_PROJECT_MODAL'"
        :project-id="projectId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-management-rename-card>
    </q-skeleton-suspense>
  </q-dialog>
  <q-dialog
    v-model="rolesModal.open"
    :full-width="isMobile"
    class="project-settings-page__dialog"
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
import { computed, defineAsyncComponent } from 'vue'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'

import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'

// lazy loading component
const ProjectRoleCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-role/project-role-card.vue'
    )
)
const ProjectBasicInformationCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-settings/project-basic-information-card.vue'
    )
)
const ProjectManagementDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/entries/project-management-delete-card.vue'
    )
)
const ProjectManagementRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/entries/project-management-rename-card.vue'
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

const ProjectRolePermissionCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-role/project-role-permission-card.vue'
    )
)

// composables
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const {
  modal: rolesModal,
  onCloseModal: onCloseRolesModal,
  handleGetPermissionRoles,
} = useProjectRoles()
const { modal, activeProject, handleGetProjectDetail, onCloseModal } =
  useProjects()

// computed
const backAction = computed(() => {
  return {
    name: 'Back to project page',
    to: onBackToEntriesPage,
    icon: 'r_keyboard_return',
  } as Breadcrumb
})

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const projectId = computed(() => {
  return (
    (route.params?.projectId as string) ||
    (activeProject.value?.projectId as string)
  )
})

// methods
function onBackToEntriesPage() {
  router.push({ name: PROJECT_MANAGEMENT_ROUTE_NAMES.ENTRIES })
}
function onFetchingData() {
  handleGetProjectDetail(projectId.value as string)
  handleGetPermissionRoles()
}

// hooks
onFetchingData()
</script>
