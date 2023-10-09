<template>
  <q-page-sticky
    position="bottom-right"
    :offset="[18, 18]"
  >
    <q-btn
      v-if="!uploadDialog"
      fab-mini
      outline
      color="primary"
      icon="sym_o_cloud_upload"
      class="bg-grey-2 shadow-18"
      @click="uploadDialog = !uploadDialog"
    ></q-btn>
  </q-page-sticky>
  <q-dialog
    v-model="uploadDialog"
    seamless
    position="bottom"
    class="form-actions__dialog"
  >
    <q-card class="file-system-upload-progress-card q-pa-xs">
      <q-card-section class="q-pb-none row justify-between no-wrap items-start">
        <q-section-header
          title="Upload files"
          sub-title="Select files and click upload"
        ></q-section-header>
        <div>
          <q-btn
            size="sm"
            flat
            round
            rounded
            icon="sym_o_remove"
            @click="uploadDialog = false"
          ></q-btn>
          <q-btn
            size="sm"
            flat
            round
            rounded
            :icon="maximum ? 'sym_o_zoom_in_map' : 'sym_o_zoom_out_map'"
            @click="maximum = !maximum"
          ></q-btn>
        </div>
      </q-card-section>
      <q-card-section
        class="file-system-upload-progress-card__list"
        :class="{ 'file-system-upload-progress-card__maximum': maximum }"
        v-if="getUploadFiles.length > 0"
      >
        <q-list
          round
          bordered
          separator
          class="rounded-borders"
        >
          <q-item
            v-for="(file, index) in getUploadFiles"
            :key="index + '__file-system-upload-progress-card'"
          >
            <q-item-section avatar>
              <q-avatar
                size="40px"
                color="grey-1"
                text-color="primary"
                class="q-ml-none"
              >
                <icon-file-type :type="file?.file?.type"></icon-file-type>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <div
                class="file-system-upload-progress-card__content column justify-start items-stretch col-grow w-full text-body2 overflow-hidden"
              >
                <strong
                  class="file-system-upload-progress-card__file-name overflow-hidden text-no-wrap"
                >
                  {{ file?.file?.name }}
                  <span class="text-caption text-disable -q-mt-xs text-no-wrap">
                    {{ bytesToSize(file?.file?.size, 1024) }}
                  </span>
                </strong>
                <span
                  class="file-system-upload-progress-card__file-path text-caption text-disable -q-mt-xs text-no-wrap"
                >
                  {{ generateFilePath(file?.file) }}
                  <q-tooltip>{{ generateFilePath(file?.file) }}</q-tooltip>
                </span>
              </div>
            </q-item-section>
            <q-item-section
              avatar
              class="file-system-upload-progress-card__actions"
            >
              <q-circular-progress
                v-if="file?.status === 'OPEN' || file?.status === 'UPLOADING'"
                show-value
                :min="0"
                :max="100"
                :value="file?.progress"
                size="32px"
                :thickness="0.1"
                color="teal"
                track-color="grey-3"
              >
                <div class="file-system-upload-progress-card__btns">
                  <q-btn
                    v-if="file?.status === 'OPEN'"
                    size="sm"
                    flat
                    round
                    rounded
                    icon="sym_o_delete"
                    @click="removeUploadFile(file?.file)"
                  ></q-btn>
                  <q-btn
                    v-if="file?.status === 'UPLOADING'"
                    size="sm"
                    flat
                    round
                    rounded
                    icon="sym_o_cancel"
                    @click="cancelUploadFile(file?.file)"
                  ></q-btn>
                </div>
              </q-circular-progress>
              <div
                v-else
                class="file-system-upload-progress-card__btns"
              >
                <q-btn
                  v-if="file?.status === 'UPLOADED'"
                  size="sm"
                  flat
                  round
                  rounded
                  icon="sym_o_check_circle"
                  color="positive"
                ></q-btn>
                <q-btn
                  v-if="file?.status === 'DUPPLICATE'"
                  size="sm"
                  flat
                  round
                  rounded
                  icon="sym_o_check_error"
                  color="warning"
                ></q-btn>
                <q-btn
                  v-if="file?.status === 'ERROR'"
                  size="sm"
                  flat
                  round
                  rounded
                  icon="sym_o_check_dangerous"
                  color="negative"
                ></q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import useUnits from 'src/core/composables/use-unit'
import { useS3Store } from 'src/core/stores/s3-stores'
import { useFileSystemStore } from 'src/core/stores/file-system'
import IconFileType from 'src/core/components/atoms/icon/icon-file-type.vue'

const uploadDialog = ref(true)
const maximum = ref(false)
const { bytesToSize } = useUnits()
const { getUploadFiles } = storeToRefs(useS3Store())
const { removeUploadFile, cancelUploadFile } = useS3Store()
const { getParent } = storeToRefs(useFileSystemStore())

// computed

const parentName = computed(() => {
  return getParent.value?.name
})

// methods
function generateFilePath(file: File) {
  return `${parentName.value}/${file?.webkitRelativePath}`
}
</script>

<style lang="scss">
.file-system-upload-progress-card {
  width: 560px;
  max-width: 100%;
  position: relative;

  &__close {
    position: absolute;
    top: map-get($map: $space-xs, $key: y);
    right: map-get($map: $space-xs, $key: x);
  }

  &__content {
    width: 100%;
  }

  &__list {
    max-height: 30px;
    overflow: hidden;
    overflow-y: scroll;
  }
  &__maximum {
    max-height: 150px;
  }

  &__file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
  }

  &__file-path {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
  }

  &__actions {
    position: relative;
  }
}
</style>
