<template>
  <div
    class="column items-stretch justify-start full-height no-wrap file-system-entries"
  >
    <q-page-header
      :title="pageTitle"
      :subtitle="pageSubtitle"
      :back="back"
    >
      <template v-slot:action>
        <file-system-menus-bar></file-system-menus-bar>
      </template>
    </q-page-header>
    <q-separator class="full-width q-mb-xl"></q-separator>
    <div class="row rounded-borders bg-white">
      <q-card-section
        v-if="$slots.sidebar"
        class="col-12 col-md-3 col-lg-2 rounded-borders row justify-between q-pa-none"
      >
        <div class="col-grow">
          <slot name="sidebar" />
        </div>
      </q-card-section>
      <div
        :class="{
          'col-12 col-md-9 col-lg-10 q-pa-none': $slots.sidebar,
          'col-12': !$slots.sidebar,
        }"
      >
        <slot name="empty" />
        <file-system-table
          v-if="!$slots.empty"
          :hidden-filter="hiddenFilter"
          :hidden-search="hiddenSearch"
          :table-subtitle="tableSubtitle"
          :table-title="tableTitle"
          @request="onFetchingData($event.pagination)"
          @search="onSearchingData($event)"
        ></file-system-table>
      </div>
    </div>
  </div>
  <q-dialog
    :full-width="
      ['NEW_FILE_MODAL', 'VIEW_ACTIVE_MODAL'].includes(modal.type) && fullScreen
    "
    :full-height="
      ['NEW_FILE_MODAL', 'VIEW_ACTIVE_MODAL'].includes(modal.type) && fullScreen
    "
    :persistent="
      modal.type === 'UPLOAD_FILE_MODAL' || modal.type === 'UPLOAD_FOLDER_MODAL'
    "
    v-model="modal.open"
  >
    <div class="file-system-entries__modal-content">
      <q-skeleton-suspense>
        <file-system-info-card
          v-if="modal.type === 'INFO_MODAL'"
          @close="onToggleModal"
        ></file-system-info-card>
        <file-system-rename-card
          v-if="modal.type === 'RENAME_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-rename-card>
        <file-system-share-card
          v-if="
            modal.type === 'SHARE_MODAL' || modal.type === 'SHARE_ACTIVE_MODAL'
          "
          :share-type="modal.type"
          @close="onToggleModal"
        ></file-system-share-card>
        <file-system-new-folder-card
          v-if="modal.type === 'NEW_FOLDER_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-new-folder-card>
        <file-system-new-file-card
          v-if="modal.type === 'NEW_FILE_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
          @screen-mode="onChangeScreen($event)"
        ></file-system-new-file-card>
        <file-system-delete-card
          v-if="
            modal.type === 'DELETE_MODAL' ||
            modal.type === 'DELETE_ACTIVE_MODAL'
          "
          :delete-type="modal.type"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-delete-card>
        <file-system-download-card
          v-if="
            modal.type === 'DOWNLOAD_MODAL' ||
            modal.type === 'DOWNLOAD_ACTIVE_MODAL'
          "
          :download-type="modal.type"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-download-card>
        <file-system-locked-card
          v-if="modal.type === 'LOCKED_MODAL'"
          @close="onToggleModal"
        ></file-system-locked-card>
        <file-system-decompress-card
          v-if="modal.type === 'DECOMPRESS_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-decompress-card>
        <file-system-copy-card
          v-if="
            modal.type === 'COPY_MODAL' || modal.type === 'COPY_ACTIVE_MODAL'
          "
          :copy-type="modal.type"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-copy-card>
        <file-system-move-card
          v-if="
            modal.type === 'MOVE_MODAL' || modal.type === 'MOVE_ACTIVE_MODAL'
          "
          :move-type="modal.type"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-move-card>
        <file-system-decrypt-card
          v-if="modal.type === 'DECRYPT_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-decrypt-card>
        <file-system-encrypt-card
          v-if="modal.type === 'ENCRYPT_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-encrypt-card>
        <file-system-import-card
          v-if="modal.type === 'IMPORT_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-import-card>
        <file-system-upload-card
          v-if="
            modal.type === 'UPLOAD_FILE_MODAL' ||
            modal.type === 'UPLOAD_FOLDER_MODAL'
          "
          :upload-type="modal.type"
          :file-system-type="fileSystemType"
          @close="onCloseUpload"
          @upload="onStartUpload(modal.type)"
        ></file-system-upload-card>
        <file-system-view-card
          v-if="modal.type === 'VIEW_ACTIVE_MODAL'"
          :file-system-type="fileSystemType"
          @screen-mode="onChangeScreen($event)"
          @close="onToggleModal"
        ></file-system-view-card>
        <file-system-edit-card
          v-if="modal.type === 'EDIT_ACTIVE_MODAL'"
          :file-system-type="fileSystemType"
          @screen-mode="onChangeScreen($event)"
          @close="onToggleModal"
        ></file-system-edit-card>
        <file-system-change-storage-type-card
          v-if="modal.type === 'CHANGE_STORAGE_TYPE_ACTIVE_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-change-storage-type-card>
        <file-system-converting-card
          v-if="modal.type === 'CONVERTING_ACTIVE_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></file-system-converting-card>

        <recycle-bin-delete-card
          v-if="
            modal.type === 'RECYCLE_BIN_DELETE_MODAL' ||
            modal.type === 'RECYCLE_BIN_DELETE_ACTIVE_MODAL'
          "
          :delete-type="modal.type"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></recycle-bin-delete-card>

        <recycle-bin-move-card
          v-if="
            modal.type === 'RECYCLE_BIN_PUSH_BACK_MODAL' ||
            modal.type === 'RECYCLE_BIN_PUSH_BACK_ACTIVE_MODAL'
          "
          :move-type="modal.type"
          @close="onToggleModal"
          @refresh="onFetchingData"
        ></recycle-bin-move-card>
        <recycle-bin-empty-trash-card
          v-if="modal.type === 'RECYCLE_BIN_EMPTY_TRASH_MODAL'"
          @close="onToggleModal"
          @refresh="onFetchingData"
        >
        </recycle-bin-empty-trash-card>
      </q-skeleton-suspense>
    </div>
  </q-dialog>
  <encrypt-folder-protected-mask
    v-if="getProtectedState"
    @close="onCloseProtectedMask"
    @success="onAccessEncryptedFolder"
  ></encrypt-folder-protected-mask>
  <file-system-upload-progress-card
    v-if="getUploadFiles.length > 0"
  ></file-system-upload-progress-card>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useUpload } from '../hooks/use-upload'
import { useAuthStore } from 'src/core/stores/auth'
import { useS3Store } from 'src/core/stores/s3-stores'
import { AtlasFileSystem, DIR_TYPE } from 'src/core/types/file-types'
import { computed, ref, watch, defineAsyncComponent } from 'vue'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useFiles } from 'src/pages/file-system//hooks/use-files'
import { useMenus } from 'src/pages/file-system//hooks/use-menus'
import { useNavigate } from 'src/pages/file-system/hooks/use-navigate'
import FileSystemTable from 'src/pages/file-system/components/table/file-system-table.vue'
import FileSystemMenusBar from 'src/pages/file-system/components/menus/file-system-menus-bar.vue'
import EncryptFolderProtectedMask from 'src/pages/file-system/components/encrypt-folder-protected-mask.vue'
import { TablePagination } from 'src/core/types/pagging-types'
import { useI18n } from 'vue-i18n'
import { Breadcrumb } from 'src/core/types/breadcrumb-types'

const FileSystemInfoCard = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/actions/file-system-info-card.vue')
)
const FileSystemCopyCard = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/actions/file-system-copy-card.vue')
)
const FileSystemMoveCard = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/actions/file-system-move-card.vue')
)
const FileSystemShareCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-share-card.vue'
    )
)
const FileSystemUploadCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-upload-card.vue'
    )
)
const FileSystemRenameCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-rename-card.vue'
    )
)
const FileSystemImportCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-import-card.vue'
    )
)
const FileSystemDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-delete-card.vue'
    )
)
const FileSystemLockedCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-locked-card.vue'
    )
)
const FileSystemDecryptCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-decrypt-card.vue'
    )
)
const FileSystemEncryptCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-encrypt-card.vue'
    )
)
const FileSystemNewFileCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-new-file-card.vue'
    )
)
const FileSystemDownloadCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-download-card.vue'
    )
)
const FileSystemUploadProgressCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/upload/file-system-upload-progress-card.vue'
    )
)
const FileSystemNewFolderCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-new-folder-card.vue'
    )
)
const FileSystemDecompressCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-decompress-card.vue'
    )
)
const FileSystemViewCard = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/actions/file-system-view-card.vue')
)
const FileSystemChangeStorageTypeCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-change-storage-type-card.vue'
    )
)
const FileSystemConvertingCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/file-system-converting-card.vue'
    )
)
const FileSystemEditCard = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/actions/file-system-edit-card.vue')
)
const RecycleBinDeleteCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/recycle-bin-delete-card.vue'
    )
)
const RecycleBinMoveCard = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/actions/recycle-bin-move-card.vue')
)
const RecycleBinEmptyTrashCard = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/recycle-bin-empty-trash-card.vue'
    )
)

// composables
const { t } = useI18n()
const route = useRoute()
const { modal, onToggleModal } = useMenus()
const { exactFileSystemRoutePath, handleNavigateFileSystem } = useNavigate()
const { getMasterPassword } = storeToRefs(useAuthStore())
const { resetParent, turnProtectedOff, toggleLoading, turnProtectedOn } =
  useFileSystemStore()
const {
  pagination,
  handleFetchFileList,
  fetchEncryptedFileList,
  handleSearchFileList,
} = useFiles()
const { handleStartUpload, handleClearUploadProcess } = useUpload()
const { getProtectedState, getRootDirType } = storeToRefs(useFileSystemStore())
const { getUploadFiles } = storeToRefs(useS3Store())
const { getRootFolderId, getDefaultRootFolder } = storeToRefs(
  useFileSystemStore()
)

// props
withDefaults(
  defineProps<{
    fileSystemType: AtlasFileSystem
    pageTitle?: string
    pageSubtitle?: string
    back?: Breadcrumb
    tableTitle?: string
    tableSubtitle?: string
    hiddenFilter?: boolean
    hiddenSearch?: boolean
  }>(),
  {
    fileSystemType: 'DEFAULT_FILE_SYSTEM',
    pageTitle: `Files and assets`,
    pageSubtitle: `Document and attach has uploaded as path of this project`,
  }
)

// data
const fullScreen = ref(false)

// methods
async function onFetchingData(
  pagination?: TablePagination | Partial<TablePagination>
) {
  toggleLoading('table')
  if (routeQuery.value?.rootDirType?.type === 'ENCRYPT') {
    await fetchEncryptedFileList(
      routeQuery.value?.parentId,
      getMasterPassword.value,
      pagination
    )
  } else {
    await handleFetchFileList(routeQuery.value.parentId, pagination)
  }
  toggleLoading('table')
}

async function onSearchingData(keyword?: string) {
  toggleLoading('table')
  if (!keyword) {
    await onFetchingData(pagination.value)
  } else {
    await handleSearchFileList(
      routeQuery.value.parentId,
      pagination.value,
      keyword
    )
  }
  toggleLoading('table')
}

function onCloseProtectedMask() {
  resetParent()
  turnProtectedOff()
  handleNavigateFileSystem(
    getDefaultRootFolder.value.get(getRootFolderId.value),
    getRootFolderId.value
  )
}

function onChangeScreen(mode: boolean) {
  fullScreen.value = mode
}

function onCloseUpload() {
  handleClearUploadProcess()
  onToggleModal()
}

function onProtectedEncryptedData() {
  if (
    routeQuery.value?.rootDirType?.type === 'ENCRYPT' &&
    !getMasterPassword.value
  ) {
    turnProtectedOn()
    return false
  }
  return true
}

function onAccessEncryptedFolder() {
  onFetchingData()
}
// computed
const routePath = computed(() => {
  return route.query?.path?.toString()
})

const routeQuery = computed(() => {
  if (routePath.value) {
    return exactFileSystemRoutePath(routePath.value)
  }
  return {
    parentId: '',
    rootDirType: getDefaultRootFolder.value.get(getRootFolderId.value),
  }
})

// hooks
watch(
  () => routePath.value,
  (newVal) => {
    if (newVal) {
      const result = onProtectedEncryptedData()
      if (result) {
        onFetchingData()
      }
    }
  },
  { immediate: true }
)

// method
async function onStartUpload(
  uploadType: 'UPLOAD_FILE_MODAL' | 'UPLOAD_FOLDER_MODAL'
) {
  onToggleModal()
  if (getRootDirType.value?.type === DIR_TYPE.MEMBER_USER) {
    await handleStartUpload(uploadType, true)
  } else {
    await handleStartUpload(uploadType, false)
  }
  onFetchingData()
}
</script>
<style lang="scss">
.file-system-entries {
  position: relative;

  &__modal-content {
    min-width: 200px;
    width: fit-content;
  }
}
</style>
