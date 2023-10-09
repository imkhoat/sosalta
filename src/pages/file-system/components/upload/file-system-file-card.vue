<template>
  <q-card
    class="file-system-file-card full-width"
    bordered
    flat
  >
    <q-card-section
      class="row justify-start items-start full-width q-gutter-x-sm q-pa-sm no-wrap"
    >
      <q-avatar
        size="40px"
        color="grey-1"
        text-color="primary"
        class="q-ml-none"
      >
        <icon-file-type :type="fileType"></icon-file-type>
      </q-avatar>
      <div
        class="file-system-file-card__content column justify-start items-stretch col-grow w-full text-body2 overflow-hidden"
      >
        <strong class="file-system-file-card__file-name overflow-hidden">
          {{ fileName }}
          <span class="text-caption text-disable -q-mt-xs text-no-wrap">{{
            bytesToSize(fileSize, 1024)
          }}</span>
        </strong>
        <span class="text-caption text-disable -q-mt-xs text-no-wrap">{{
          filePath
        }}</span>
      </div>
    </q-card-section>
    <q-btn
      v-if="!isCompleted"
      class="file-system-file-card__close"
      flat
      round
      rounded
      size="sm"
      @click="removeUploadFile(file)"
    >
      <q-icon name="close"></q-icon>
    </q-btn>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import IconFileType from 'src/core/components/atoms/icon/icon-file-type.vue'
import { StorageFileType } from 'src/core/types/file-types'
import useUnits from 'src/core/composables/use-unit'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { useS3Store } from 'src/core/stores/s3-stores'

const { bytesToSize } = useUnits()
const { getParent } = storeToRefs(useFileSystemStore())
const { removeUploadFile } = useS3Store()
// props
const props = defineProps<{
  file?: File
}>()

// data
const progress = ref(0)

// computed
const fileName = computed(() => {
  return props.file?.name
})
const fileType = computed(() => {
  return props.file?.type as StorageFileType
})
const fileSize = computed(() => {
  return props.file?.size || 0
})
const isCompleted = computed(() => {
  return progress.value >= 1
})
const filePath = computed(() => {
  return `${parentName.value}/${props.file?.webkitRelativePath}`
})
const parentName = computed(() => {
  return getParent.value?.name
})
</script>
<style lang="scss">
.file-system-file-card {
  position: relative;

  &__close {
    position: absolute;
    top: map-get($map: $space-xs, $key: y);
    right: map-get($map: $space-xs, $key: x);
  }
  &__file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;
    white-space: nowrap;
  }
  &__content {
    width: 70%;
    max-width: 80% !important;
  }
}
</style>
