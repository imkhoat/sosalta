<template>
  <q-card class="file-system-info-card">
    <q-card-section
      class="bg-grey-1 row justify-center rounded-borders items-center file-system-info-card__image"
    >
      <q-avatar
        size="140px"
        color="grey-2"
      >
        <q-avatar
          size="110px"
          color="grey-3"
          text-color="primary"
        >
          <icon-file-type
            color="primary"
            :type="getActiveObject?.fileType"
          ></icon-file-type>
        </q-avatar>
      </q-avatar>
    </q-card-section>
    <q-card-section>
      <div class="column justify-start items-stretch q-gutter-x-sm">
        <div
          class="file-system-info-card__name row justify-start items-stretch q-mb-sm no-wrap"
        >
          <strong
            class="file-system-info-card__name-title text-h6 text-weight-bold q-mr-xs ellipsis col-grow col-shrink"
          >
            {{ getActiveObject?.name }}
            <q-tooltip>{{ getActiveObject?.name }}</q-tooltip>
          </strong>
          <q-avatar
            size="26px"
            color="grey-1"
            text-color="primary"
          >
            <icon-file-status
              size="24px"
              :status="fileStatus"
            ></icon-file-status>
          </q-avatar>
        </div>
        <div class="row justify-between items-start no-wrap">
          <span class="text-caption text-weight-medium">
            Upload at
            <span class="text-disable">
              {{ getActiveObject?.gmtCreateString }}
            </span>
            <br />by
            <span class="text-disable">{{ getActiveObject?.userName }}</span>
          </span>

          <q-badge
            color="grey-4"
            text-color="primary"
          >
            <span class="text-disable text-caption text-no-wrap">
              {{ bytesToSize(getActiveObject?.size as number, 1024) }}
            </span>
          </q-badge>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import useUnits from 'src/core/composables/use-unit'
import { ActionProp } from 'src/core/types/action-prop-types'

import { StorageFileStatus } from 'src/core/types/file-types'
import { useFileSystemStore } from 'src/core/stores/file-system'
import IconFileType from 'src/core/components/atoms/icon/icon-file-type.vue'
import IconFileStatus from 'src/core/components/atoms/icon/icon-file-status.vue'

// props & emits
const emits = defineEmits(['close', 'edit'])

// composables
const { t } = useI18n()
const { bytesToSize } = useUnits()
const { getActiveObject } = storeToRefs(useFileSystemStore())

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
      name: t('textActions.Edit'),
      action: onEditObject,
    },
  ]
})

const fileStatus = computed(() => {
  return getActiveObject.value?.status?.toString() as StorageFileStatus
})
// methods
function onClose() {
  emits('close')
}
function onEditObject() {
  emits('edit')
}
</script>
<style lang="scss">
.file-system-info-card {
  min-width: 300px;

  &__image {
    position: relative;
  }

  &__size {
    position: absolute;
    bottom: map-get($map: $space-xs, $key: y);
    right: map-get($map: $space-xs, $key: y);
  }
  &__name {
    width: 100%;
    overflow: hidden;
  }
  &__name-title {
    width: 80%;
    max-width: 80%;
    overflow: hidden;
  }
}
</style>
