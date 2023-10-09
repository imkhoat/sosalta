<template>
  <q-card class="key-manager-create-key">
    <q-form
      ref="keyManagerCreateKey"
      no-error-focus
      :autofocus="false"
      @submit="onCreateEncryptionKey"
    >
      <q-card-section>
        <q-section-header
          :title="$t(`pages.keyManager.createKey.Add new encryption keys`)"
          :sub-title="
            $t(
              `pages.keyManager.createKey.Input your key name, password and click create`
            )
          "
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-password-input
          id="master-password"
          class="q-mb-md"
          :label="$t(`pages.keyManager.createKey.Master password`)"
          stack-label
          outlined
          dense
          v-model="form.password"
          :rules="rules.password"
          lazy-rules
          hide-bottom-space
        ></q-password-input>
        <q-input
          id="key-name"
          class="q-mb-md"
          :label="$t(`pages.keyManager.createKey.Key name`)"
          stack-label
          outlined
          dense
          v-model="form.keyName"
          :rules="rules.keyName"
          lazy-rules
          hide-bottom-space
        ></q-input>
        <q-field
          class="q-mb-md"
          outlined
          :label="$t(`pages.keyManager.createKey.Generate type`)"
          dense
          stack-label
        >
          <template v-slot:control>
            <q-option-group
              size="24px"
              inline
              v-model="form.createType"
              :options="options"
              color="primary"
            />
          </template>
        </q-field>
        <q-file
          v-if="form.createType === 'IMPORT'"
          outlined
          v-model="form.file"
          :rules="rules.file"
          dense
          :label="$t(`pages.keyManager.createKey.Select key file`)"
          stack-label
          @update:model-value="onReadFile(form.file)"
        >
          <template v-slot:append>
            <q-icon name="r_description" />
          </template>
        </q-file>
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
import { useKeyManager } from '../hooks/use-key-manager'

// props & emits
const emits = defineEmits(['close', 'success'])

// composables
const { t } = useI18n()
const { passwordRules, requiredRules, fileRequiredRules } = useRules()
const { handleAddSymmetricKey, handleUploadSymmetricKey, loading } =
  useKeyManager()

const options = [
  { label: t('pages.keyManager.createKey.Random'), value: 'RANDOM' },
  { label: t('pages.keyManager.createKey.Import file'), value: 'IMPORT' },
]

// data
const form = reactive<{
  password: string
  keyName: string
  createType: 'RANDOM' | 'IMPORT'
  file?: File
  content: string
}>({
  password: '',
  keyName: '',
  createType: 'RANDOM',
  content: '',
})
const validFile = ref(true)
const rules = reactive({
  password: passwordRules,
  keyName: requiredRules,
  file: fileRequiredRules,
})

const keyManagerCreateKey = ref<
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
      name: t('textActions.Create'),
      disable: !validFile.value,
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onCreateEncryptionKey() {
  try {
    const valid: boolean | undefined =
      await keyManagerCreateKey?.value?.validate()
    if (!valid) return

    let result = false
    if (form.createType === 'RANDOM') {
      result = await handleAddSymmetricKey(form.password, form.keyName)
    } else {
      result = await handleUploadSymmetricKey(
        form.password,
        form.keyName,
        form.content
      )
    }
    if (result) {
      emits('success')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function onReadFile(file: File | undefined) {
  if (!file) {
    return
  }
  validFile.value = false
  const reader = new FileReader()
  reader.addEventListener('load', (event) => {
    form.content = event?.target?.result?.toString() || ''
    validFile.value = true
  })
  reader.readAsText(file)
}
</script>
<style lang="scss">
.key-manager-create-key {
  width: 350px;
}
</style>
