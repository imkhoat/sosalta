<template>
  <q-card class="notification-file-received-card">
    <q-card-section>
      <q-section-header
        title="Notificaiton"
        sub-title="Share file notification"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p class="bg-grey-1 rounded-borders block full-width q-pa-md">
        <strong>{{ item?.sender?.userName }}</strong> has shared a file (
        <strong>{{ item?.contentFormated?.fileName }}</strong> ) to you.
      </p>
      <q-alert
        v-if="item?.shareFileStatus === SHARE_FILE_STATUS.REJECTED"
        type="warning"
        class="q-my-md"
      >
        <q-chip
          size="sm"
          square
          class="no-border-radius"
          >Note:</q-chip
        >
        You have rejected the file from
        <strong>{{ item?.sender?.userName }}</strong
        >.
      </q-alert>
      <q-alert
        v-if="item?.shareFileStatus === SHARE_FILE_STATUS.ACCEPTED"
        type="positive"
        class="q-my-md"
      >
        <q-chip
          size="sm"
          square
          class="no-border-radius"
          >Note:</q-chip
        >
        You have accepted receive the file from
        <strong>{{ item?.sender?.userName }}</strong
        >.
      </q-alert>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'
import {
  UserNotification,
  SHARE_FILE_STATUS,
} from 'src/core/types/use-notification-types'
// props & emits
const emits = defineEmits(['close', 'delete'])
defineProps<{
  item: UserNotification | undefined
}>()
// composables
const { t } = useI18n()

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      class: 'bg-grey-1',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Delete'),
      action: onDelete,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function onDelete() {
  emits('delete')
  emits('close')
}
</script>
<style lang="scss">
.notification-file-received-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
