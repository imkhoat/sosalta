<template>
  <q-card
    class="file-system-view-card"
    :class="{ 'file-system-view-card__full-screen': fullScreen }"
  >
    <q-card-section class="row justify-between items-start no-wrap">
      <q-section-header
        title="View file"
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
    <q-card-section
      v-if="loading"
      class="q-pt-none file-system-view-card__skeleton"
    >
      <q-skeleton
        type="text"
        width="30%"
        class="text-caption"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1 q-mb-md"
      />
      <q-skeleton
        type="text"
        width="30%"
        class="text-caption"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
      <q-skeleton
        type="text"
        class="text-subtitle1"
      />
    </q-card-section>
    <q-card-section
      v-else
      class="q-pt-none"
    >
      <file-system-pdf-viewer
        v-if="fileType === STORAGE_FILE_TYPE.PDF"
        :item="getActiveObject"
        :data="streamData"
      ></file-system-pdf-viewer>
      <file-system-txt-viewer
        v-else-if="
          [STORAGE_FILE_TYPE.TXT, STORAGE_FILE_TYPE.JSON].includes(fileType)
        "
        :item="getActiveObject"
        :data="streamData"
      ></file-system-txt-viewer>
      <file-system-html-viewer
        v-else-if="fileType === STORAGE_FILE_TYPE.HTML"
        :full-screen="fullScreen"
        :item="getActiveObject"
        :data="streamData"
      ></file-system-html-viewer>
      <file-system-md-viewer
        v-else-if="fileType === STORAGE_FILE_TYPE.MD"
        :full-screen="fullScreen"
        :item="getActiveObject"
        :data="streamData"
      ></file-system-md-viewer>
      <file-system-image-viewer
        v-else-if="
          [
            STORAGE_FILE_TYPE.SVG,
            STORAGE_FILE_TYPE.JPEG,
            STORAGE_FILE_TYPE.JPG,
            STORAGE_FILE_TYPE.PNG,
          ].includes(fileType)
        "
        :item="getActiveObject"
        :data="streamData"
      ></file-system-image-viewer>
      <file-system-mp3-viewer
        :url="urlFile ?? ''"
        v-else-if="fileType === STORAGE_FILE_TYPE.MP3"
      ></file-system-mp3-viewer>
      <file-system-mp4-viewer
        :url="urlFile ?? ''"
        v-else-if="
          [STORAGE_FILE_TYPE.OGG, STORAGE_FILE_TYPE.MP4].includes(fileType)
        "
      ></file-system-mp4-viewer>
      <file-system-unsupport-viewer v-else></file-system-unsupport-viewer>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ActionProp } from 'src/core/types/action-prop-types'
import {
  AtlasFileSystem,
  StorageFileType,
  STORAGE_FILE_TYPE,
} from 'src/core/types/file-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { useUpload } from 'src/pages/file-system/hooks/use-upload'

const supportViewExtentions: StorageFileType[] = [
  STORAGE_FILE_TYPE.TXT,
  STORAGE_FILE_TYPE.PDF,
  STORAGE_FILE_TYPE.SVG,
] as StorageFileType[]
// lazy loading
const FileSystemTxtViewer = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/viewer/file-system-txt-viewer.vue')
)
const FileSystemPdfViewer = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/viewer/file-system-pdf-viewer.vue')
)
const FileSystemUnsupportViewer = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/viewer/file-system-unsupport-viewer.vue'
    )
)
const FileSystemImageViewer = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/viewer/file-system-image-viewer.vue'
    )
)
const FileSystemHtmlViewer = defineAsyncComponent(
  () =>
    import(
      'src/pages/file-system/components/viewer/file-system-html-viewer.vue'
    )
)
const FileSystemMdViewer = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/viewer/file-system-md-viewer.vue')
)
const FileSystemMp3Viewer = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/viewer/file-system-mp3-viewer.vue')
)
const FileSystemMp4Viewer = defineAsyncComponent(
  () =>
    import('src/pages/file-system/components/viewer/file-system-mp4-viewer.vue')
)
// props & emits
const props = defineProps<{
  fileSystemType: AtlasFileSystem
}>()
const emits = defineEmits(['close', 'screen-mode'])

// data
const streamData = ref<GetObjectCommandOutput | null>()
const loading = ref(false)
const fullScreen = ref(false)
const urlFile = ref<string | null>('')

// composables
const { t } = useI18n()
const { handleAwsGetFileDetail, handleGetActiveFileUrl } = useFiles()
const { getActiveObject } = storeToRefs(useFileSystemStore())
const { handleGetSessionCredentials } = useUpload()

// computed
const isSupportActiveObject = computed(() => {
  return supportViewExtentions.includes(getActiveObject.value?.fileType)
})
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Print'),
      action: onPrintFile,
      loading: loading.value,
      disable: !isSupportActiveObject.value,
    },
  ]
})

const fileType = computed(() => {
  return getActiveObject.value?.fileType
})

function onClose() {
  emits('close')
}

function onChangeScreenMode() {
  fullScreen.value = !fullScreen.value
  emits('screen-mode', fullScreen.value)
}

async function onPrintFile() {
  try {
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onFetchingData() {
  try {
    loading.value = true

    await handleGetSessionCredentials(props.fileSystemType)
    if (
      getActiveObject.value?.fileType === STORAGE_FILE_TYPE.MP3 ||
      getActiveObject.value?.fileType === STORAGE_FILE_TYPE.MP4
    ) {
      urlFile.value = await handleGetActiveFileUrl()
    }
    const responseData = await handleAwsGetFileDetail(
      getActiveObject.value?.s3FileKey
    )
    streamData.value = await responseData
  } catch (error) {
  } finally {
    loading.value = false
  }
}

onFetchingData()
</script>
<style lang="scss">
.file-system-view-card {
  width: fit-content;
  max-width: calc(100vw - 48px);

  &__skeleton {
    width: 360px;
    max-width: calc(100vw - 96px);
  }
}
</style>
