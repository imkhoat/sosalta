<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-entries-page"
  >
    <q-page-header
      title="Project management"
      subtitle="Manager your project members, notepages and roles"
    >
      <template v-slot:action>
        <project-management-actions></project-management-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <project-management-table
      :loading="loading"
      :items="projects"
      :users="users"
      :active-user="activeUser"
      @request="onFetchingData($event.pagination)"
      @search="onFetchingData(undefined, $event)"
      @select="onSelectFilter"
    ></project-management-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    :persistent="modal.type === 'NEW_PROJECT_MEMBERS'"
    class="project-entries-page__dialog"
  >
    <q-skeleton-suspense>
      <project-management-delete-card
        v-if="
          modal.type === 'DELETE_PROJECT_MODAL' ||
          modal.type === 'DELETE_PROJECTS_MODAL'
        "
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-management-delete-card>
      <project-management-new-card
        v-if="modal.type === 'NEW_PROJECT_MEMBERS'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-management-new-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { TablePagination } from 'src/core/types/pagging-types'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'

// lazy loading
const ProjectManagementTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/entries/project-management-table.vue'
    )
)
const ProjectManagementActions = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/entries/project-management-actions.vue'
    )
)
const ProjectManagementDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/entries/project-management-delete-card.vue'
    )
)
const ProjectManagementNewCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/entries/project-management-new-card.vue'
    )
)
// composables
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { getUserInformation } = storeToRefs(useAuthStore())
const {
  modal,
  projects,
  loading,
  handleFetchProjectList,
  fetchGroupOwner,
  onToggleModal,
} = useProjects()

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
  handleFetchProjectList(pagination, searchValue, activeUser.value)
  users.value = await fetchGroupOwner()
}

function onSelectFilter(userName: string) {
  activeUser.value = userName
  router.push({
    name: route.name ?? PROJECT_MANAGEMENT_ROUTE_NAMES.ENTRIES,
    params: { ...route.params },
    query: { userName },
  })
  onFetchingData()
}
</script>
