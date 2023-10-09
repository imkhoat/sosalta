<template>
  <q-card class="machine-images-detail-card">
    <q-card-section>
      <div class="row justify-start items-center no-wrap">
        <q-avatar
          size="48px"
          color="grey-1"
        >
          <q-avatar
            size="32px"
            color="grey-3"
          >
            <span class="text-caption text-weight-bold text-disable">{{
              item.id
            }}</span>
          </q-avatar>
        </q-avatar>
        <div class="column justify-start items-start q-ml-xs">
          <strong class="machine-images-detail-card__title"
            >{{ item.imageName }}
          </strong>
          <q-chip
            dense
            flat
            class="bg-grey-1 text-primary text-caption q-px-sm q-ma-none"
            >{{ item.type }}</q-chip
          >
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-input
        id="machine-image-name"
        label="Image Information"
        standout
        dense
        autogrow
        readonly
        lazy-rules
        type="textarea"
        hide-bottom-space
        v-bind="$attrs"
        :model-value="item?.imageInformation"
      ></q-input>
    </q-card-section>
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-4">
        <q-input
          id="machine-image-name"
          label="Minimal CPU Number"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.machineConfiguration?.cpu"
        ></q-input>
      </div>
      <div class="col-4">
        <q-input
          id="machine-image-name"
          label="Minimal RAM (KB)"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.machineConfiguration?.memory"
        ></q-input>
      </div>
      <div class="col-4">
        <q-input
          id="machine-image-name"
          label="Root Drive Size (GB)"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.rootDriveSize"
        ></q-input>
      </div>
      <div class="col-6">
        <q-input
          id="machine-image-name"
          :label="`Default ${item?.machineConfiguration?.method} Access Port`"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.machineConfiguration?.port"
        ></q-input>
      </div>
      <div class="col-6">
        <q-input
          id="machine-image-name"
          :label="`Default ${item?.machineConfiguration?.method2} Access Port`"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.machineConfiguration?.port2"
        >
        </q-input>
      </div>
    </q-card-section>
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-12">
        <q-input
          id="machine-image-name"
          label="Default Data Drive Mounting Point"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.machineConfiguration?.mountPoint"
        ></q-input>
      </div>
      <div class="col-12">
        <q-input
          id="machine-image-name"
          label="Default Web URL Path"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          :model-value="`hostname:port ${item?.machineConfiguration?.urlPath}`"
        ></q-input>
      </div>
    </q-card-section>
    <q-card-section class="row q-col-gutter-sm">
      <div class="col-6">
        <q-input
          id="machine-image-name"
          label="Keywords"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          type="textarea"
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.keyWords"
        ></q-input>
      </div>
      <div class="col-6">
        <q-select
          id="machine-image-name"
          label="Tags"
          standout
          dense
          autogrow
          readonly
          lazy-rules
          type="textarea"
          hide-bottom-space
          v-bind="$attrs"
          :model-value="item?.machineImageTagEntitys"
        ></q-select>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useQuasar } from 'quasar'
import { MachineImage } from 'src/core/types/machine-image-types'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  item: MachineImage
}>()
// composables
const $q = useQuasar()
const { t } = useI18n()

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}
</script>
<style lang="scss">
.machine-images-detail-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);

  &__title {
    font-size: 18px;
  }
}
</style>
