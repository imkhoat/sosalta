<template>
  <div
    class="column items-stretch justify-start full-height no-wrap machine-images-page"
  >
    <q-page-header
      title="Machine Images"
      subtitle="View detail CloudPC data drive and update name"
      :back="backAction"
    >
      <template #action>
        <cloud-pc-menus></cloud-pc-menus>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <q-tabs
      class="machine-images-page__tabs"
      v-model="activeMachineType"
      active-bg-color="grey-2"
      @update:model-value="onChangeMachineType"
    >
      <q-tab
        v-if="hasMachinePublicMenuVisible"
        name="public"
        label="Public Images"
      />
      <q-tab
        name="team"
        label="Team Images"
      />
      <q-tab
        v-if="hasMachinePrivateMenuVisible"
        name="private"
        label="Private Images"
      />
    </q-tabs>
    <machine-images-table
      :loading="loading"
      :items="images"
      :users="filters"
      :active-user="activeFilter"
      @request="onFetchingData($event.pagination)"
      @search="onFetchingData(undefined, $event)"
      @view-detail="onViewDetailMachine"
      @select="onSelectFilter"
    ></machine-images-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="machine-images-page__dialog"
  >
    <q-skeleton-suspense>
      <machine-images-detail-card
        :item="activeMachineImage"
        @close="onCloseModal"
        v-if="modal.type === 'VIEW_MACHINE_IMAGE'"
      ></machine-images-detail-card>
      <machine-images-launch-card
        :item="activeMachineImage"
        @close="onCloseModal"
        @success="onLaunchSuccess"
        v-if="modal.type === 'RUN_MACHINE_IMAGE_MODAL'"
      ></machine-images-launch-card>
      <machine-images-launch-success-card
        :item="successImageInfo"
        @close="onGoingtoCloudPCPage"
        v-if="modal.type === 'SUCCESS_MACHINE_IMAGE_MODAL'"
      ></machine-images-launch-success-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { MachineImage, MachineType } from 'src/core/types/machine-image-types'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCloudPCMachineImages } from '../hooks/use-machine-images'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { CLOUD_PC_ROUTE_NAMES } from 'src/core/router/routes'
import { useQuasar } from 'quasar'
import { TablePagination } from 'src/core/types/pagging-types'
import { GetMachineImageDetailRequest } from 'src/core/types/services/machine-types'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'
import CloudPcMenus from 'src/pages/cloud-pc/components/cloud-pc-menus.vue'
import { useMenusVisible } from 'src/pages/cloud-pc/hooks/use-menus-visible'

// lazy loading
const MachineImagesTable = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/machine-images/machine-images-table.vue'
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
// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { getUserInformation } = storeToRefs(useAuthStore())
const {
  loading,
  modal,
  activeMachineImage,
  onCloseModal,
  handleGetTeamList,
  onShowSuccessModal,
  handleGetMemberList,
  handleGetMachineImageDetail,
  handleGetCloudPCMachineImages,
} = useCloudPCMachineImages()
const { hasMachinePrivateMenuVisible, hasMachinePublicMenuVisible } =
  useMenusVisible()
//data
const images = ref<MachineImage[]>([])
const successImageInfo = ref()
const filters = ref<{ label: string | undefined; value: string | undefined }[]>(
  []
)

const activeFilter = ref<string>(
  route?.query?.filter?.toString() ?? getUserInformation.value?.userName ?? ''
)
const activeMachineType = ref<MachineType>(
  hasMachinePublicMenuVisible.value
    ? 'public'
    : hasMachinePrivateMenuVisible.value
    ? 'private'
    : 'team'
)

// computed
const backAction = computed(() => {
  return {
    name: 'Back to data drive',
    to: () =>
      router.push({
        name: CLOUD_PC_ROUTE_NAMES.DATA_DRIVE,
        params: { ...route.params },
      }),
    icon: 'r_keyboard_return',
  } as Breadcrumb
})
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string
) {
  if (
    activeMachineType.value === 'public' &&
    hasMachinePublicMenuVisible.value
  ) {
    images.value = await handleGetCloudPCMachineImages(
      activeMachineType.value,
      pagination,
      searchValue
    )
  } else if (
    activeMachineType.value === 'private' &&
    hasMachinePrivateMenuVisible.value
  ) {
    images.value = await handleGetCloudPCMachineImages(
      activeMachineType.value,
      pagination,
      searchValue,
      activeFilter.value
    )
  } else {
    images.value = await handleGetCloudPCMachineImages(
      activeMachineType.value,
      pagination,
      searchValue,
      undefined,
      activeFilter.value
    )
  }
}

async function onGetTeamList() {
  filters.value = await handleGetTeamList()
  if (filters.value[0]) {
    activeFilter.value = filters.value[0].value ?? ''
  }
}

async function onGetMemberList() {
  filters.value = await handleGetMemberList()
  if (filters.value[0]) {
    activeFilter.value = filters.value[0].value ?? ''
  }
}

async function onGetFilterData() {
  switch (activeMachineType.value) {
    case 'public':
      filters.value = []
      return
    case 'private':
      await onGetMemberList()
      return
    default:
      await onGetTeamList()
      return
  }
}

function onSelectFilter(filter: string) {
  activeFilter.value = filter
  router.push({
    name: route.name ?? CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
    params: { ...route.params },
    query: { ...route.query, filter: activeFilter.value },
  })
  onFetchingData()
}

function onViewDetailMachine() {
  const payload: GetMachineImageDetailRequest = {
    id: activeMachineImage.value.id,
    type: activeMachineImage.value.type,
  }
  handleGetMachineImageDetail(payload)
}

async function onChangeMachineType() {
  router.push({
    name: route.name ?? CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
    params: { ...route.params },
    query: { ...route.query, type: activeMachineType.value },
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
</script>
<style lang="scss">
.machine-images-page {
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

  .cloudpc-machine-image-table {
    border-top-left-radius: 0;
  }
}
</style>
