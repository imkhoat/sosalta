<template>
  <q-card class="file-system-new-folder-card">
    <q-form
      ref="fileSystemNewFolderCard"
      no-error-focus
      :autofocus="false"
      @submit="onCreateNewFolder"
    >
      <q-card-section>
        <q-section-header
          title="Create new folder"
          sub-title="Click Save to confirm created"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="folder-name"
          label="Folder name"
          stack-label
          outlined
          dense
          :rules="rules.folderName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="folderName"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useFiles } from 'src/pages/file-system/hooks/use-files'

import { errorHandler } from 'src/core/utils/error-handler'
import useRules from 'src/core/composables/use-rules'

// props & emits
const emits = defineEmits(['close', 'created', 'refresh'])

// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const { handleCreateFolder, loading } = useFiles()

// data
const folderName = ref('')
const rules = reactive({
  folderName: requiredRules,
})
const fileSystemNewFolderCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)
// computed
const formActions = computed((): ActionProp[] => {
  return [
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
      name: t('textActions.Save'),
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onCreateNewFolder() {
  try {
    const valid: boolean | undefined =
      await fileSystemNewFolderCard?.value?.validate()
    if (!valid) return

    await handleCreateFolder(folderName.value)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.file-system-new-folder-card {
  min-width: 300px;
}
</style>
