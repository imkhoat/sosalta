<template>
  <q-card class="file-system-rename-card">
    <q-form
      ref="fileSystemRenameCard"
      no-error-focus
      :autofocus="false"
      @submit="onEditObject"
    >
      <q-card-section>
        <q-section-header
          title="Rename file"
          sub-title="Click rename to confirm edit"
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
import { storeToRefs } from 'pinia'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useFileSystemStore } from 'src/core/stores/file-system'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { errorHandler } from 'src/core/utils/error-handler'
import useRules from 'src/core/composables/use-rules'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { handleRenameObject, loading } = useFiles()
const { getActiveObject } = storeToRefs(useFileSystemStore())
const { requiredRules } = useRules()

// data
const newName = ref(getActiveObject.value?.name || '')
const rules = reactive({
  newName: requiredRules,
})
const fileSystemRenameCard = ref<
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
      name: t('textActions.Edit'),
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onEditObject() {
  try {
    const valid: boolean | undefined =
      await fileSystemRenameCard?.value?.validate()
    if (!valid) return

    await handleRenameObject(newName.value)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.file-system-rename-card {
  min-width: 300px;
}
</style>
