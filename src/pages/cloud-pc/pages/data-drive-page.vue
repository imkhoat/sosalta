<template>
  <div
    class="column items-stretch justify-start full-height no-wrap data-drive-page"
  >
    <q-page-header
      title="Data drives"
      subtitle="View detail CloudPC data drive and update name"
    >
      <template v-slot:action>
        <data-drive-actions></data-drive-actions>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <data-drive-table
      :loading="loading"
      :items="drives"
      :users="users"
      :active-user="activeUser"
      @request="onFetchingData($event.pagination)"
      @search="onFetchingData(undefined, $event)"
      @select="onSelectFilter"
    ></data-drive-table>
  </div>
  <q-dialog
    v-model="modal.open"
    :full-width="isMobile"
    class="data-drive-page__dialog"
  >
    <q-skeleton-suspense>
      <data-drive-delete-card
        v-if="
          modal.type === 'DELETE_DATA_DRIVES_MODAL' ||
          modal.type === 'DELETE_DATA_DRIVE_MODAL'
        "
        :delete-type="modal.type"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></data-drive-delete-card>
      <data-drive-new-card
        v-if="modal.type === 'NEW_DATA_DRIVE_MODAL'"
        :userName="activeUser"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></data-drive-new-card>
      <data-drive-rename-card
        v-if="modal.type === 'RENAME_DATA_DRIVE_MODAL'"
        :userName="activeUser"
        @close="onCloseModal"
        @refresh="onFetchingData"
      ></data-drive-rename-card>
    </q-skeleton-suspense>
  </q-dialog>
</template>
<script lang="ts" setup>
import { DataDrive } from 'src/core/types/data-drive-types'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCloudPCDataDrives } from '../hooks/use-data-drive'
import { UserInfo } from 'src/core/types/user-info'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { CLOUD_PC_ROUTE_NAMES } from 'src/core/router/routes'
import { useQuasar } from 'quasar'
import { TablePagination } from 'src/core/types/pagging-types'

// lazy loading
const DataDriveTable = defineAsyncComponent(
  () => import('src/pages/cloud-pc/components/data-drive/data-drive-table.vue')
)
const DataDriveActions = defineAsyncComponent(
  () =>
    import('src/pages/cloud-pc/components/data-drive/data-drive-actions.vue')
)
const DataDriveNewCard = defineAsyncComponent(
  () =>
    import('src/pages/cloud-pc/components/data-drive/data-drive-new-card.vue')
)
const DataDriveRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/data-drive/data-drive-rename-card.vue'
    )
)
const DataDriveDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/cloud-pc/components/data-drive/data-drive-delete-card.vue'
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
  onCloseModal,
  handleGetCloudPCDataDrives,
  handleGetManagingUsersWithMe,
} = useCloudPCDataDrives()

//data
const drives = ref<DataDrive[]>([])
const users = ref<Partial<UserInfo>[]>([])
const activeUser = ref<string>(
  route?.query?.userName?.toString() ?? getUserInformation.value?.userName ?? ''
)

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
async function onFetchingData(
  pagination?: TablePagination,
  searchValue?: string
) {
  users.value = (await handleGetManagingUsersWithMe()) as Partial<UserInfo>[]
  drives.value = await handleGetCloudPCDataDrives(
    pagination,
    searchValue,
    activeUser?.value ?? ''
  )
}

async function onFetchDataDrives(
  pagination?: TablePagination,
  searchValue?: string
) {
  drives.value = await handleGetCloudPCDataDrives(
    pagination,
    searchValue,
    activeUser?.value ?? ''
  )
}

function onSelectFilter(userName: string) {
  activeUser.value = userName
  router.push({
    name: route.name ?? CLOUD_PC_ROUTE_NAMES.DATA_DRIVE,
    params: { ...route.params },
    query: { userName },
  })
  onFetchDataDrives()
}
</script>
