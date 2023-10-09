<template>
  <q-card
    flat
    class="file-system-table full-width"
  >
    <q-card-section>
      <div
        class="file-system-header__title column justify-center items-start q-mb-md"
      >
        <strong class="title text-subtitle1 text-weight-bold">{{
          tableTitle
        }}</strong>
        <span class="subtitle text-caption text-disable">{{
          tableSubtitle
        }}</span>
      </div>
      <file-system-filter
        v-if="!hiddenFilter || !hiddenSearch"
        :hidden-filter="hiddenFilter"
        :hidden-search="hiddenSearch"
        v-model:model-filter="search.filter"
        v-model="search.keyword"
        @search="onSearching"
      ></file-system-filter>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="fileSystemTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="getFiles"
        :loading="getLoadingState.table"
        v-model:pagination="pagination"
        v-model:selected="selectedObjects"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-file_name="props">
          <q-td
            :props="props"
            @click="onClickObject(props.row)"
            class="cursor-pointer"
          >
            <div
              class="row justify-start items-center no-wrap file-system-table__file-name-cell"
              @click.right="setActiveObject(props.row)"
            >
              <q-avatar
                size="lg"
                color="grey-1"
              >
                <q-avatar
                  size="md"
                  color="grey-3"
                >
                  <icon-file-type
                    size="20px"
                    :type="props.row.fileType"
                  ></icon-file-type>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong
                  >{{ props.row.name }}
                  <q-tooltip>{{ props.row.name }}</q-tooltip>
                </strong>
                <span
                  class="text-caption text-disable"
                  v-if="props.row.fileType !== STORAGE_FILE_TYPE.SYS_FOLDER"
                  >{{ props.row.fileType }}</span
                >
              </div>
              <file-system-menus
                v-if="onShowRowContextAction(props.row)"
                context-menu
              ></file-system-menus>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-file_status="props">
          <q-td
            :props="props"
            @click="onClickObject(props.row)"
            class="cursor-pointer"
          >
            <div class="justify-start items-center no-wrap">
              <q-avatar
                v-if="
                  props.row.fileType !== STORAGE_FILE_TYPE.SYS_FOLDER &&
                  props.row.size !== '0' &&
                  props.row.status.toString() === STORAGE_FILE_STATUS.AVALIABLE
                "
                size="lg"
                color="grey-1"
                @click="onChangeStorageClass(props.row)"
              >
                <q-avatar
                  size="sm"
                  color="grey-3"
                >
                  <icon-storage-class
                    size="20px"
                    :class="props.row.storageClass"
                  ></icon-storage-class>
                </q-avatar>
              </q-avatar>
              <q-avatar
                v-else-if="
                  props.row.fileType !== STORAGE_FILE_TYPE.SYS_FOLDER &&
                  props.row.size !== '0' &&
                  props.row.status.toString() === STORAGE_FILE_STATUS.FROZENING
                "
                size="lg"
                color="grey-1"
                class="text-disable"
                @click="onShowConvertingMessage(props.row)"
              >
                <q-avatar
                  size="sm"
                  color="grey-3"
                >
                  <q-icon
                    size="20px"
                    color="accent"
                    name="sym_o_hourglass_top"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-file_size="props">
          <q-td :props="props">
            <span
              v-if="
                props.row.fileType !== STORAGE_FILE_TYPE.SYS_FOLDER &&
                props.row.size !== '0'
              "
              >{{ bytesToSize(props.row.size, 1024) }}</span
            >
          </q-td>
        </template>
        <template v-slot:body-cell-upload_by="props">
          <q-td :props="props">
            <div
              v-if="props.row.fileType !== STORAGE_FILE_TYPE.SYS_FOLDER"
              class="row justify-start items-center no-wrap"
            >
              <q-avatar
                size="lg"
                color="grey-1"
              >
                <q-avatar
                  size="md"
                  color="grey-3"
                >
                  <q-icon
                    size="20px"
                    name="sym_o_person_4"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <span class="text-caption text-disable">{{
                  props.row.userName
                }}</span>
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-file_action="props">
          <q-td :props="props">
            <div v-if="onShowRowContextAction(props.row)">
              <q-btn
                flat
                round
                size="sm"
                class="text-normal text-primary"
                :disable="directMenu.disabled"
                v-for="(
                  directMenu, directIndex
                ) in visibleMenusContextDirectAccess"
                :key="directIndex + '__file-system-table-direct-menu'"
                @click="directMenu.action(props.row)"
              >
                <q-icon :name="directMenu?.icon"></q-icon>
              </q-btn>
              <file-system-menus-context
                @select-row="setActiveObject(props.row)"
              ></file-system-menus-context>
            </div>
          </q-td>
        </template>
        <template v-slot:top-row>
          <q-tr v-if="isSelectedSystemFoder">
            <q-td colspan="100%">
              <q-alert type="warning">
                Objects of type sys-folder (Share Folder, Encrypted Folder,
                Analysys Folder) are not referenced in some actions. For
                example: You cannot delete files/folders of type sys-folder
                <br />
                Please unselect sys-folder files/folders
              </q-alert>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'
import useUnits from 'src/core/composables/use-unit'
import {
  STORAGE_FILE_STATUS,
  STORAGE_FILE_TYPE,
  STORAGE_CLASS,
  StorageFile,
  StorageClass,
} from 'src/core/types/file-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useMenus } from 'src/pages/file-system/hooks/use-menus'
import IconFileType from 'src/core/components/atoms/icon/icon-file-type.vue'
import { useMenusActions } from 'src/pages/file-system/hooks/use-menus-actions'
import IconStorageClass from 'src/core/components/atoms/icon/icon-storage-class.vue'
import FileSystemFilter from 'src/pages/file-system/components/table/file-system-filter.vue'
import FileSystemMenusContext from 'src/pages/file-system/components/menus/file-system-menus-context.vue'
import FileSystemMenus from 'src/pages/file-system/components/menus/file-system-menus.vue'

// composables
const { bytesToSize } = useUnits()
const { onChangeStorageClass, onShowConvertingMessage } = useMenusActions()
const { pagination, getFiles, selectedObjects } = storeToRefs(
  useFileSystemStore()
)
const { getLoadingState, setActiveObject } = useFileSystemStore()
const { onClickObject, visibleMenusContextDirectAccess } = useMenus()

//props & emits
const props = defineProps<{
  tableTitle?: string
  tableSubtitle?: string
  hiddenFilter?: boolean
  hiddenSearch?: boolean
}>()
const emits = defineEmits(['request', 'search', 'select'])

// data
const fileSystemTableRef = ref()

const search = reactive({
  filter: 'one',
  keyword: '',
})

const columns: QTableColumn[] = [
  {
    name: 'file_name',
    field: 'name',
    label: 'File name',
    classes: 'file-column file-column__name',
    headerClasses: 'file-column-header file-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'file_size',
    field: 'size',
    label: 'File size',
    classes: 'file-column file-column__file-size',
    headerClasses: 'file-column-header file-column-header__file-size',
    required: true,
    align: 'left',
  },
  {
    name: 'file_status',
    field: 'storageClass',
    label: 'File status',
    classes: 'file-column file-column__storage-class',
    headerClasses: 'file-column-header file-column-header__storage-class',
    required: true,
    align: 'left',
  },
  {
    name: 'upload_at',
    field: 'gmtCreateString',
    label: 'Date uploaded',
    classes: 'file-column file-column__date-uploaded',
    headerClasses: 'file-column-header file-column-header__date-uploaded',
    required: true,
    align: 'left',
  },
  {
    name: 'update_at',
    field: 'gmtUpdateString',
    label: 'Last updated',
    classes: 'file-column file-column__last-updated',
    headerClasses: 'file-column-header file-column-header__last-updated',
    required: true,
    align: 'left',
  },
  {
    name: 'upload_by',
    field: 'userName',
    label: 'Upload by',
    classes: 'file-column file-column__upload-by',
    headerClasses: 'file-column-header file-column-header__upload-by',
    required: true,
    align: 'left',
  },
  {
    name: 'file_action',
    field: 'file_action',
    label: '',
    classes: 'file-column file-column__action',
    headerClasses: 'file-column-header file-column-header__action',
    required: true,
    align: 'right',
  },
]

// computed
const isSelectedSystemFoder = computed(() => {
  return selectedObjects.value?.some((item) => {
    return item.fileType === 'sys-folder'
  })
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

function onShowRowContextAction(object: StorageFile) {
  if (!object) {
    return false
  }
  return (
    object.fileType !== STORAGE_FILE_TYPE.SYS_FOLDER &&
    object.status?.toString() === STORAGE_FILE_STATUS.AVALIABLE &&
    [STORAGE_CLASS.STANDARD, STORAGE_CLASS.STANDARD_IA].includes(
      object?.storageClass
    )
  )
}
// hooks
// onMounted(() => {
//   fileSystemTableRef.value?.requestServerInteraction()
// })
// methods
</script>
<style lang="scss">
.file-system-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }

  &__file-name-cell {
    max-min-width: 300px;
    min-width: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
