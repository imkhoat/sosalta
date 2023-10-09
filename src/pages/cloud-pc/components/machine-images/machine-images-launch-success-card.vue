<template>
  <q-card class="machine-images-launch-success-card">
    <q-card-section>
      <q-section-header
        title="Cloud PC Launch Request Submitted"
        sub-title="You have successfully submitted a Cloud PC Launch Request!"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <span class="text-caption text-disable q-mb-sm"
        >Cloud PC information</span
      >
      <q-list
        bordered
        separator
        class="rounded-borders"
      >
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_dns"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Cloud PC Name</q-item-label>
            <q-item-label>{{ item?.instanceName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_folder"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Attached Data Drive</q-item-label>
            <q-item-label>{{ item?.dataDriveName }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="sym_o_settings_system_daydream"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Machine Image Used</q-item-label>
            <q-item-label>{{ item?.instanceTypeName }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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

// props & emits
const props = defineProps<{
  item: {
    instanceName: string
    dataDriveName: string
    instanceTypeName: string
  }
}>()
const emits = defineEmits(['close'])
// composables
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
.machine-images-launch-success-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
