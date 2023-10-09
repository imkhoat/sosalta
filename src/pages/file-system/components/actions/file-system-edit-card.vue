<template>
  <q-card
    class="file-system-new-file-card column justify-start items-stretch"
    :class="{ 'file-system-new-file-card__full-screen': fullScreen }"
  >
    <q-form
      ref="fileSystemEditFileCard"
      no-error-focus
      :autofocus="false"
      @submit="onSubmitForm"
    >
      <q-card-section class="row justify-between items-start no-wrap">
        <q-section-header
          title="Edit file"
          :sub-title="getActiveObject?.name"
        ></q-section-header>
        <q-btn
          size="sm"
          flat
          rounded
          round
          icon="fullscreen"
          @click="onChangeScreenMode"
        >
          <q-tooltip>Full screen</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section class="col-grow">
        <file-system-new-txt-file-form
          v-if="
            fileType === STORAGE_FILE_TYPE.TXT ||
            fileType === STORAGE_FILE_TYPE.JSON
          "
          v-model="form.fileName"
          :edit="true"
          v-model:model-string="form.fileString"
        ></file-system-new-txt-file-form>
        <file-system-new-html-file-form
          v-else-if="fileType === STORAGE_FILE_TYPE.HTML"
          v-model="form.fileName"
          :edit="true"
          v-model:model-string="form.fileString"
        ></file-system-new-html-file-form>
        <!-- <file-system-new-word-file-form
          v-else-if="fileType === STORAGE_FILE_TYPE.DOCX"
          v-model="form.fileName"
          :edit="true"
          v-model:model-string="form.fileString"
        ></file-system-new-word-file-form> -->
        <file-system-new-markdown-file-form
          v-else-if="fileType === STORAGE_FILE_TYPE.MD"
          v-model="form.fileName"
          :edit="true"
          v-model:model-string="form.fileString"
        ></file-system-new-markdown-file-form>
        <file-system-unsupport-viewer v-else></file-system-unsupport-viewer>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'
import { storeToRefs } from 'pinia'
import { errorHandler } from 'src/core/utils/error-handler'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useUpload } from 'src/pages/file-system/hooks/use-upload'
import {
  AtlasFileSystem,
  STORAGE_FILE_TYPE,
  StorageFileType,
} from 'src/core/types/file-types'

const supportEditExtentions: StorageFileType[] = [
  STORAGE_FILE_TYPE.TXT,
  STORAGE_FILE_TYPE.HTML,
  STORAGE_FILE_TYPE.MD,
  STORAGE_FILE_TYPE.JSON,
] as StorageFileType[]

const FileSystemNewTxtFileForm = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/new-file/file-system-new-txt-file-form.vue'
    )
)
const FileSystemNewHtmlFileForm = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/new-file/file-system-new-html-file-form.vue'
    )
)
const FileSystemNewWordFileForm = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/new-file/file-system-new-word-file-form.vue'
    )
)
const FileSystemNewMarkdownFileForm = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/actions/new-file/file-system-new-markdown-file-form.vue'
    )
)

const FileSystemUnsupportViewer = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/viewer/file-system-unsupport-viewer.vue'
    )
)
// props & emits
const props = defineProps<{
  fileSystemType: AtlasFileSystem
}>()
const emits = defineEmits(['close', 'rename', 'refresh', 'screen-mode'])

// composables
const { t } = useI18n()
const { getParent } = useFileSystemStore()
const { handleUpdateFile, handleAwsGetFileDetail, loading } = useFiles()
const { handleGetSessionCredentials } = useUpload()
const { getActiveObject } = storeToRefs(useFileSystemStore())

// data
const fullScreen = ref(false)
const currentStep = ref<'SELECT_FILE_TYPE' | 'INPUT_CONTENT'>(
  'SELECT_FILE_TYPE'
)
const form = reactive<{
  fileId: string
  fileString: string
  fileType: StorageFileType | undefined
  fileName: string | undefined
}>({
  fileName: '',
  fileString: '',
  fileId: '',
  fileType: STORAGE_FILE_TYPE.TXT,
})
// computed
const isSupportActiveObject = computed(() => {
  return supportEditExtentions.includes(getActiveObject.value?.fileType)
})
const fileType = computed(() => {
  return getActiveObject.value?.fileType
})
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      flat: true,
      name: t('textActions.Save'),
      loading: loading.value,
      disable: !isSupportActiveObject.value,
    },
  ]
})
// methods
function onClose() {
  emits('close')
}

async function onUpdateObject() {
  try {
    if (!form.fileId) {
      errorHandler.notify('Please input filename')
      return
    }
    await handleUpdateFile(form)

    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function onChangeScreenMode() {
  fullScreen.value = !fullScreen.value
  emits('screen-mode', fullScreen.value)
}

function onSubmitForm() {
  onUpdateObject()
}

async function onFetchingData() {
  try {
    loading.value = true

    await handleGetSessionCredentials(props.fileSystemType)

    const responseData = await handleAwsGetFileDetail(
      getActiveObject.value?.s3FileKey
    )
    form.fileString = (await responseData?.Body?.transformToString()) ?? ''
    form.fileId = getActiveObject.value?.id ?? ''
    form.fileType = getActiveObject.value?.fileType
    form.fileName = getActiveObject.value?.name
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onFetchingData()
</script>
<style lang="scss">
.file-system-new-file-card {
  width: 350px;
  max-width: calc(100vw - 48px);
  &__full-screen {
    width: 100%;
    height: 100%;
  }
}
</style>
