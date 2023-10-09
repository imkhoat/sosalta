<template>
  <q-card
    flat
    class="cloudpc-data-drive-table full-width"
  >
    <q-card-section>
      <div
        class="cloudpc-data-drive-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold"
          >Data Drive list</strong
        >
        <span class="subtitle text-caption text-disable"
          >Use checkbox to select drive and click button to edit.</span
        >
      </div>
      <data-drive-filter
        :items="users"
        :model-filter="activeUser"
        v-model="searchKeyword"
        @search="onSearching"
        @select="emits('select', $event)"
      ></data-drive-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="dataDriveTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="items"
        :loading="loading"
        v-model:pagination="pagination"
        v-model:selected="selectedDataDrives"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-data_drive_name="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <div class="row justify-start items-center no-wrap">
              <q-avatar
                size="lg"
                color="grey-1"
              >
                <q-avatar
                  size="md"
                  color="grey-3"
                >
                  <span class="text-caption text-disable">{{
                    props.row.dataDriveId
                  }}</span>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ props.row.driveName }}</strong>
                <span class="text-caption text-disable"
                  >Create by {{ props.row.userName }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-data_drive_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                v-if="hasDataDriveDeleteActionVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onDeleteDataDrive(props.row)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasDataDriveRenameActionVisible"
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onRenameDataDrive(props.row)"
              >
                <q-icon name="sym_o_edit"></q-icon>
              </q-btn>
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                @click="onViewDriveFile(props.row)"
              >
                <q-icon name="sym_o_folder"></q-icon>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn, useQuasar } from 'quasar'
import { UserInfo } from 'src/core/types/user-info'
import { computed, onMounted, reactive, ref } from 'vue'
import { DataDrive } from 'src/core/types/data-drive-types'
import { useMenusVisible } from 'src/pages/cloud-pc/hooks/use-menus-visible'
import { useCloudPCDataDrives } from 'src/pages/cloud-pc/hooks/use-data-drive'
import DataDriveFilter from 'src/pages/cloud-pc/components/data-drive/data-drive-filter.vue'

// composables
const $q = useQuasar()
const {
  pagination,
  searchKeyword,
  selectedDataDrives,
  onViewDriveFile,
  onDeleteDataDrive,
  onRenameDataDrive,
} = useCloudPCDataDrives()
const { hasDataDriveRenameActionVisible, hasDataDriveDeleteActionVisible } =
  useMenusVisible()
// props & emits
const props = defineProps<{
  items: DataDrive[] | undefined
  users?: Partial<UserInfo>[]
  loading: boolean
  activeUser: string
}>()
const emits = defineEmits(['request', 'search', 'select'])
// data
const search = reactive({
  filter: '',
  keyword: '',
})
const dataDriveTableRef = ref()

const menusDialog = ref(false)
const contextActiveRow = ref()
const columns: QTableColumn[] = [
  {
    name: 'data_drive_name',
    field: 'driveName',
    label: 'ID | Name',
    classes: 'user-column user-column__name',
    headerClasses: 'user-column-header user-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'data_drive_owner',
    field: 'userName',
    label: 'Owner',
    classes: 'user-column user-column__user-owner',
    headerClasses: 'user-column-header user-column-header__user-owner',
    required: true,
    align: 'left',
  },
  {
    name: 'create_at',
    field: 'gmtCreateAtString',
    label: 'Date added',
    classes: 'user-column user-column__date-create',
    headerClasses: 'user-column-header user-column-header__date-create',
    required: true,
    align: 'left',
  },
  {
    name: 'update_at',
    field: 'gmtUpdateAtString',
    label: 'Last active',
    classes: 'user-column user-column__last-updated',
    headerClasses: 'user-column-header user-column-header__last-updated',
    required: true,
    align: 'left',
  },
  {
    name: 'data_drive_action',
    field: 'data_drive_action',
    label: 'Action',
    classes: 'user-column user-column__action',
    headerClasses: 'user-column-header user-column-header__action',
    required: true,
    align: 'right',
  },
]

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
function onPaginationRequest(props: {
  filter?: any
  pagination: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
  }
  getCellValue: (col: any, row: any) => any
}) {
  emits('request', props)
}

function onSearching(props: string) {
  emits('search', props)
}

// hooks
onMounted(() => {
  dataDriveTableRef.value?.requestServerInteraction()
})
</script>
<style lang="scss">
.cloudpc-data-drive-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
