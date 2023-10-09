<template>
  <div
    class="column items-stretch justify-start full-height no-wrap project-notepages-page"
  >
    <q-page-header
      title="Project notepages"
      :subtitle="`Project ${activeProject.projectName}`"
      :back="backAction"
    >
    </q-page-header>
    <project-notepages-list-view
      :items="notepages"
      :loading="loading"
      @search="onSearchingData"
      @change-page="onNextPage"
    >
    </project-notepages-list-view>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="project-notepages-page__dialog"
  >
    <q-skeleton-suspense>
      <project-notepages-delete-card
        v-if="
          modal.type === 'DELETE_NOTEPAGE_MODAL' ||
          modal.type === 'DELETE_NOTEPAGES_MODAL'
        "
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notepages-delete-card>
      <project-notepages-new-card
        v-else-if="modal.type === 'NEW_NOTEPAGE_MODAL'"
        :project-id="projectId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notepages-new-card>
      <project-notepages-rename-card
        v-else-if="modal.type === 'RENAME_NOTEPAGE_MODAL'"
        :project-id="projectId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notepages-rename-card>
      <project-notepages-copy-card
        v-else-if="modal.type === 'COPY_NOTEPAGE_MODAL'"
        :project-id="projectId"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notepages-copy-card>
      <project-notepages-info-card
        v-else-if="modal.type === 'VIEW_NOTEPAGE_MODAL'"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></project-notepages-info-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { Notepage } from 'src/core/types/notepage-types'
import { computed, defineAsyncComponent, ref } from 'vue'
import { PROJECT_MANAGEMENT_ROUTE_NAMES } from 'src/core/router/routes'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import { TablePagination } from 'src/core/types/pagging-types'

// lazy loading
const ProjectNotepagesListView = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notepages/list-view/project-notepages-list-view.vue'
    )
)
const ProjectNotepagesDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notepages/project-notepages-delete-card.vue'
    )
)
const ProjectNotepagesNewCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notepages/project-notepages-new-card.vue'
    )
)
const ProjectNotepagesRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notepages/project-notepages-rename-card.vue'
    )
)
const ProjectNotepagesCopyCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notepages/project-notepages-copy-card.vue'
    )
)
const ProjectNotepagesInfoCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/project-notepages/project-notepages-info-card.vue'
    )
)
// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { activeProject } = useProjects()
const {
  modal,
  loading,
  onCloseModal,
  handleFetchProjectNotepages,
  handleSetActiveNotepage,
} = useProjectNotepages()

// data
const notepages = ref<Notepage[]>([])

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
  paggination?: TablePagination,
  keyword?: string,
  type?: string
) {
  notepages.value = await handleFetchProjectNotepages(
    projectId.value,
    paggination,
    keyword,
    type
  )
  handleSetActiveNotepage(notepages.value[0])
}

function onSearchingData(payload: {
  filter: string
  keyword: string
  searchType: { label: string; value: string }
}) {
  console.log(payload)
  onFetchingData(undefined, payload.keyword, payload.searchType.value)
}
function onNextPage() {
  onFetchingData()
}
// hook
onFetchingData()
</script>
