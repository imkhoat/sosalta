<template>
  <q-card class="notification-file-rename-card">
    <q-form
      ref="fileSystemRenameCard"
      no-error-focus
      :autofocus="false"
      @submit="onEditObject"
    >
      <q-card-section>
        <q-section-header
          title="Rename file"
          :sub-title="cardSubTitle"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="file-name"
          label="New name"
          stack-label
          outlined
          dense
          :rules="rules.newName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="newName"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'
import { errorHandler } from 'src/core/utils/error-handler'
import useRules from 'src/core/composables/use-rules'
import { StorageFile } from 'src/core/types/file-types'
import {
  SHARE_FILE_STATUS,
  ShareFileStatus,
  UserNotification,
} from 'src/core/types/use-notification-types'
import { ShareObjectRequest } from 'src/core/types/services/storage-types'
import { useNotifications } from '../hooks/use-notifications'

// props & emits
const props = defineProps<{
  item: UserNotification | undefined
  file: StorageFile | undefined
}>()
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const {
  loading,
  handleReceiveFile,
  onShowEditFileName,
  handleUpdateNotificationFlag,
} = useNotifications()

// data
const newName = ref(props.file?.metadata?.suggestedName || '')
const rules = reactive({
  newName: requiredRules,
})
const fileSystemRenameCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const cardSubTitle = computed(() => {
  return `There are files named ${props.file?.metadata?.originalName} already existing in the Share Folder folder. Please use a different name.`
})
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      class: 'bg-grey-1',
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      unelevated: true,
      name: t('textActions.Create copy'),
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onEditObject() {
  try {
    if (!props?.item?.contentFormated?.fileName || !props.item?.receiver) {
      return
    }
    const payload: ShareObjectRequest = {
      fileSize: '_',
      newName: newName.value,
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
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
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
.notification-file-rename-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
