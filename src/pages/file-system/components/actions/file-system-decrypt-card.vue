<template>
  <q-card class="file-system-decrypt-card">
    <q-form
      ref="fileSystemDecryptCard"
      no-error-focus
      :autofocus="false"
      @submit="onSubmitDecrypt"
    >
      <q-card-section>
        <q-section-header
          title="Decrypt file"
          sub-title="Select the folder to store the decrypted file"
        ></q-section-header>
      </q-card-section>
      <q-card-section v-if="currentStep === 'INPUT_PASSWORD'">
        <q-password-input
          id="old-password"
          label="Master password"
          stack-label
          outlined
          v-model="password"
          :rules="rules.password"
          lazy-rules
          dense
          hide-bottom-space
        ></q-password-input>
      </q-card-section>
      <q-card-section v-else>
        <div class="bg-grey-1 q-pa-xs rounded-borders">
          <q-folder-tree
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :folder-id="folderTreeProps.folderId"
            :user-name="folderTreeProps.userName"
          ></q-folder-tree>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { errorHandler } from 'src/core/utils/error-handler'
import { FolderNode } from 'src/core/types/folder-node-types'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { useFileSystemStore } from 'src/core/stores/file-system'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const $q = useQuasar()
const { t } = useI18n()
const { requiredRules, passwordRules } = useRules()
const { getActiveUserName } = storeToRefs(useFileSystemStore())
const { handleDecryptObject, loading } = useFiles()

// data
const password = ref('')
const selectedFolder = ref('')
const currentStep = ref<'INPUT_PASSWORD' | 'SELECT_FOLDER'>('INPUT_PASSWORD')
const selectedFolderObject = ref<FolderNode>()
const folderTreeProps = {
  folderId: getActiveUserName.value || '',
  userName: getActiveUserName.value || '',
}
const rules = reactive({
  password: passwordRules,
  key: requiredRules,
})
const fileSystemDecryptCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)
// computed
const formActions = computed((): ActionProp[] => {
  return currentStep.value === 'INPUT_PASSWORD'
    ? [
        {
          color: 'primary',
          flat: true,
          name: t('textActions.Close'),
          action: onClose,
        },
        {
          mode: 'submit',
          color: 'primary',
          flat: true,
          name: t('textActions.Next'),
        },
      ]
    : [
        {
          color: 'primary',
          flat: true,
          name: t('textActions.Back'),
          action: onPrev,
        },
        {
          mode: 'submit',
          color: 'primary',
          flat: true,
          name: t('textActions.Decrypt'),
          loading: loading.value,
        },
      ]
})

// methods
function onClose() {
  emits('close')
}
function onNext() {
  if (password.value?.trim()?.length <= 0) {
    $q.notify({
      message: t('Please input master password'),
      type: 'negative',
    })
    return
  }
  currentStep.value = 'SELECT_FOLDER'
}
function onPrev() {
  currentStep.value = 'INPUT_PASSWORD'
}
async function onDecrypt() {
  try {
    if (!selectedFolder.value) {
      errorHandler.notify('Please select target folder')
      return
    }
    await handleDecryptObject(selectedFolder.value, password.value)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
function onSubmitDecrypt() {
  if (currentStep.value === 'INPUT_PASSWORD') {
    onNext()
    return
  }
  onDecrypt()
}
</script>
<style lang="scss">
.file-system-decrypt-card {
  min-width: 300px;
}
</style>
