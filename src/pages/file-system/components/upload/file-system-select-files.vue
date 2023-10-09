<template>
  <q-card
    flat
    class="file-system-select-files"
  >
    <q-card-section class="column justify-center items-center">
      <q-avatar
        size="80px"
        color="grey-1"
        text-color="grey-3"
      >
        <q-avatar
          size="60px"
          color="grey-3"
          text-color="positive"
        >
          <q-icon name="sym_o_cloud_upload"></q-icon>
        </q-avatar>
      </q-avatar>
      <span class="text-weight-bold text-body2">
        <span class="text-underline">Click to upload</span>
        <span class="text-disable text-center text-weight-regular"
          >or drag and drop</span
        >
      </span>
      <span class="text-disable text-caption">Maximum file size 500MB</span>
    </q-card-section>
    <input
      v-if="uploadType === 'UPLOAD_FILE_MODAL'"
      class="file-system-select-files__input"
      type="file"
      :multiple="multiple"
      @change="onSelectFiles($event.target as HTMLInputElement)"
    />
    <input
      v-else
      class="file-system-select-files__input"
      type="file"
      webkitdirectory
      directory
      @change="onSelectFiles($event.target as HTMLInputElement)"
    />
  </q-card>
  <div
    class="file-system-select-files__list q-mt-md column justify-start items-stretch q-gutter-y-xs full-width no-wrap"
  >
    <file-system-file-card
      v-for="(file, index) in modelValue"
      :key="index + '__file-system-select-files'"
      :file="file"
    ></file-system-file-card>
  </div>
</template>
<script lang="ts" setup>
import { AtlasFileSystem } from 'src/core/types/file-types'
import { UploadFile } from 'src/core/types/upload-file'
import { useUpload } from 'src/pages/file-system/hooks/use-upload'
import FileSystemFileCard from './file-system-file-card.vue'

// props & emits
const props = defineProps<{
  modelValue: FileList | undefined | null | UploadFile[] | File[]
  multiple?: boolean
  uploadType: 'UPLOAD_FOLDER_MODAL' | 'UPLOAD_FILE_MODAL'
  fileSystemType: AtlasFileSystem
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: FileList | undefined | null): void
  (e: 'change', payload: FileList | undefined | null): void
}>()

// composables
const { handleGetSessionCredentials } = useUpload()

//methods
function onSelectFiles(event: HTMLInputElement) {
  if (event?.files) {
    emits('update:modelValue', event?.files)
    emits('change', event?.files)
    console.log('onSelectFiles', props.fileSystemType)
    handleGetSessionCredentials(props.fileSystemType)
  }
}
</script>
<style lang="scss">
.file-system-select-files {
  width: 100%;
  border: 2px dashed $grey-5;
  position: relative;

  &:hover {
    border-color: $primary;
    cursor: pointer;
  }

  &__input {
    background-color: transparent;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    cursor: pointer;
  }
  &__list {
    max-height: 300px;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
