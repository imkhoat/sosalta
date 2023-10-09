<template>
  <div
    class="column items-stretch justify-start full-height no-wrap machine-instances-page"
  >
    <q-page-header
      title="Cloud PC"
      subtitle="Click view to show detail instance information"
      :back="backAction"
    >
      <template #action>
        <cloud-pc-menus></cloud-pc-menus>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <q-tabs
      class="machine-instances-page__tabs"
      v-model="activeMachineCategory"
      active-bg-color="grey-2"
      @update:model-value="onChangeMachineCategory"
    >
      <q-tab
        v-for="(tab, index) in machineCategories"
        :key="index"
        :name="tab.value"
        :label="tab.name"
      />
    </q-tabs>
    <machine-instances-table
      :loading="loading"
      :items="instances"
      :users="filters"
      :active-user="activeFilter"
      @request="onFetchingData($event.pagination)"
      @search="onFetchingData(undefined, $event)"
      @select="onSelectFilter"
    ></machine-instances-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="machine-instances-page__dialog"
  >
    <q-skeleton-suspense>
      <machine-instances-detail-card
        :item="activeInstanceDetail"
        v-if="modal.type === 'VIEW_MACHINE_INSTANCE_MODAL'"
        @refresh="onFetchingDetailInstance"
        @close="onCloseModal"
      ></machine-instances-detail-card>
      <machine-instances-confirm-shutdown-card
        :item="activeInstanceDetail"
        v-if="modal.type === 'SHOW_CONFIRM_SHUTDOWN_MODAL'"
        @close="onCloseModal"
      ></machine-instances-confirm-shutdown-card>
    </q-skeleton-suspense>
  </q-dialog>
  <q-dialog
    v-model="imageModal.open"
    :full-width="isMobile"
    class="machine-images-page__dialog"
  >
    <q-skeleton-suspense>
      <machine-images-detail-card
        :item="activeMachineImage"
        @close="onCloseImageModal"
        v-if="imageModal.type === 'VIEW_MACHINE_IMAGE'"
      ></machine-images-detail-card>
      <machine-images-launch-card
        :item="activeMachineImage"
        @close="onCloseImageModal"
        @success="onLaunchSuccess"
        v-if="imageModal.type === 'RUN_MACHINE_IMAGE_MODAL'"
      ></machine-images-launch-card>
      <machine-images-launch-success-card
        :item="successImageInfo"
        @close="onGoingtoCloudPCPage"
        v-if="imageModal.type === 'SUCCESS_MACHINE_IMAGE_MODAL'"
      ></machine-images-launch-success-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import {
  MachineInstance,
  MachineInstanceDetail,
} from 'src/core/types/machine-instance-types'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCloudPCMachineInstances } from '../hooks/use-machine-instances'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { CLOUD_PC_ROUTE_NAMES } from 'src/core/router/routes'
import { useQuasar } from 'quasar'
import { TablePagination } from 'src/core/types/pagging-types'
import { useCloudPCMachineImages } from '../hooks/use-machine-images'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import CloudPcMenus from 'src/pages/cloud-pc/components/cloud-pc-menus.vue'

type MachineCategory =
  | 'History'
  | 'Current'
  | 'WaitingInQueue'
  | 'Paused'
  | 'Running'
// lazy loading
const MachineInstancesTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-instances/machine-instances-table.vue'
    )
)
const MachineInstancesDetailCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-instances/machine-instances-detail-card.vue'
    )
)
const MachineImagesDetailCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-images/machine-images-detail-card.vue'
    )
)
const MachineImagesLaunchCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-images/machine-images-launch-card.vue'
    )
)
const MachineImagesLaunchSuccessCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-images/machine-images-launch-success-card.vue'
    )
)
const MachineInstancesConfirmShutdownCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-instances/machine-instances-confirm-shutdown-card.vue'
    )
)
// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { getUserInformation } = storeToRefs(useAuthStore())
const { handleGetMemberList } = useCloudPCMachineImages()
const {
  loading,
  modal,
  activeMachineInstance,
  onCloseModal,
  handleGetMachineInstances,
  handleGetMachineInstanceDetail,
} = useCloudPCMachineInstances()

const {
  modal: imageModal,
  onCloseModal: onCloseImageModal,
  activeMachineImage,
  onShowSuccessModal,
} = useCloudPCMachineImages()

//data
const activeInstanceDetail = ref<MachineInstanceDetail | null | undefined>()
const instances = ref<MachineInstance[]>([])
const filters = ref<{ label: string | undefined; value: string | undefined }[]>(
  []
)

const activeFilter = ref<string>(
  route?.query?.filter?.toString() ?? getUserInformation.value?.userName ?? ''
)
const successImageInfo = ref()
const activeMachineCategory = ref<MachineCategory>(
  (route?.query?.category?.toString() as MachineCategory) ?? 'Current'
)

// computed
const backAction = computed(() => {
  return {
    name: 'Back to machine image page',
    to: () =>
      router.push({
        name: CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})
const machineCategories = computed(() => {
  return [
    {
      name: 'Current',
      value: 'Current',
    },
    {
      name: 'Running',
      value: 'Running',
    },
    {
      name: 'Paused',
      value: 'Paused',
    },
    {
      name: 'Waiting In Queue',
      value: 'WaitingInQueue',
    },
    {
      name: 'History',
      value: 'History',
    },
  ]
})
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods

async function onFetchingDetailInstance() {
  activeInstanceDetail.value = await handleGetMachineInstanceDetail(
    activeMachineInstance?.value?.machineInstanceId?.toString()
  )
}

async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string,
  filter?: string
) {
  instances.value = await handleGetMachineInstances(
    activeMachineCategory.value,
    pagination,
    searchValue,
    filter
  )
}

async function onGetMemberList() {
  filters.value = await handleGetMemberList()
  if (filters.value[0]) {
    activeFilter.value = filters.value[0].value ?? ''
  }
}

async function onGetFilterData() {
  await onGetMemberList()
}

function onSelectFilter(filter: string) {
  activeFilter.value = filter
  router.push({
    name: route.name ?? CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
    params: { ...route.params },
    query: { ...route.query, filter: activeFilter.value },
  })
  onFetchingData(undefined, undefined, activeFilter.value)
}

async function onChangeMachineCategory() {
  router.push({
    name: route.name ?? CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCES,
    params: { ...route.params },
    query: { ...route.query, category: activeMachineCategory.value },
  })
  await onGetFilterData()
  await onFetchingData()
}

function onGoingtoCloudPCPage() {
  onCloseModal()
  router.push({ name: CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCES })
}

function onLaunchSuccess(payload: {
  instanceName: string
  dataDriveName: string
  instanceTypeName: string
}) {
  successImageInfo.value = payload
  onShowSuccessModal()
}
// hook
onGetFilterData()
</script>
<style lang="scss">
.machine-instances-page {
  &__tabs {
    background-color: white;
    width: fit-content;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    padding: 12px;
    padding-bottom: 0;
    max-width: 100%;

    .q-tab,
    .q-tabs__content {
      border-top-right-radius: 8px !important;
      border-top-left-radius: 8px !important;
    }
  }

  .cloudpc-machine-instance-table {
    border-top-left-radius: 0;
  }
}
</style>
