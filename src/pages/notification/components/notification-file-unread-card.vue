<template>
  <q-card class="notification-file-unread-card">
    <q-card-section>
      <q-section-header
        title="Notificaiton"
        sub-title="Share file notification, click Accept to receive file"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p class="bg-grey-1 rounded-borders block full-width q-pa-md">
        <strong>{{ item?.sender?.userName }}</strong> has shared a file (
        <strong>{{ item?.contentFormated?.fileName }}</strong> ) to you.
      </p>
      <q-alert
        type="positive"
        class="q-my-md"
      >
        When you press Accept, the shared file will be stored in the Share
        folder in the File System menu.
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
  ShareFileStatus,
} from 'src/core/types/use-notification-types'
import { useNotifications } from '../hooks/use-notifications'
import { ShareObjectRequest } from 'src/core/types/services/storage-types'
// props & emits
const emits = defineEmits(['close', 'delete'])
const props = defineProps<{
  item: UserNotification | undefined
}>()
// composables
const { t } = useI18n()

const {
  loading,
  handleReceiveFile,
  onShowEditFileName,
  handleUpdateNotificationFlag,
} = useNotifications()
// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      class: 'bg-grey-1',
      flat: true,
      name: t('textActions.Ignore'),
      action: onReject,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Accept'),
      action: onAccept,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function onReject() {
  onUpdateNotificationFlag(SHARE_FILE_STATUS.REJECTED)
  onClose()
}
async function onAccept() {
  if (!props?.item?.contentFormated?.fileName || !props.item?.receiver) {
    return
  }
  const payload: ShareObjectRequest = {
    fileSize: '_',
    newName: props.item?.contentFormated?.fileName,
    receiver: props.item?.receiver,
    sender: props.item?.sender?.userName,
    shareFileId: props.item?.contentFormated?.fileId,
  }
  const result = await handleReceiveFile(payload)
  if (result) {
    onUpdateNotificationFlag(SHARE_FILE_STATUS.ACCEPTED)
    onClose()
  } else {
    onShowEditFileName()
  }
}

async function onUpdateNotificationFlag(status: ShareFileStatus) {
  const payload = {
    msgId: props?.item?.id ?? '',
    status,
  }
  await handleUpdateNotificationFlag(payload)
}
</script>
<style lang="scss">
.notification-file-unread-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
