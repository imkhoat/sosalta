<template>
  <q-card class="file-system-encrypt-card">
    <q-form
      ref="fileSystemEncryptCard"
      no-error-focus
      :autofocus="false"
      @submit="onEncrypt"
    >
      <q-card-section>
        <q-section-header
          title="Encrypt file"
          sub-title="Select the folder to store the encrypt file"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <div
          class="column no-wrap justify-start items-stretch content-end q-gutter-y-lg"
        >
          <q-select
            v-model="form.key"
            :options="encryptionKeys"
            label="Select encryption key"
            option-value="keyIndex"
            option-label="name"
            hide-hint
            dense
            stack-label
            outlined
            emit-value
            map-options
            :rules="rules.key"
            lazy-rules
            hide-bottom-space
            options-dense
          />
          <q-password-input
            id="old-password"
            label="Master password"
            hint="Please enter key manager password"
            hide-hint
            stack-label
            outlined
            v-model="form.password"
            lazy-rules
            dense
            :rules="rules.password"
            hide-bottom-space
          ></q-password-input>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { httpsGetEncryptionKeys } from 'src/core/services/storage-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { EncryptionKey } from 'src/core/types/encryption-key-types'
import useRules from 'src/core/composables/use-rules'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { requiredRules, passwordRules } = useRules()
const { handleEncryptObjects, loading } = useFiles()

// data
const form = reactive<{
  password: string
  key: number | null
}>({
  password: '',
  key: null,
})
const encryptionKeys = ref<EncryptionKey[]>([])
const rules = reactive({
  password: passwordRules,
  key: requiredRules,
})
const fileSystemEncryptCard = ref<
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
      name: t('textActions.Encrypt'),
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onEncrypt() {
  try {
    const valid: boolean | undefined =
      await fileSystemEncryptCard?.value?.validate()
    if (!valid) return

    if (!form.key) {
      return
    }

    await handleEncryptObjects(form.password, form.key)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function fetchEncryptionKeys() {
  try {
    const data = await httpsGetEncryptionKeys()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      encryptionKeys.value = data?.data
    }
  } catch (error) {}
}

// hooks
onMounted(async () => {
  await fetchEncryptionKeys()
})
</script>
<style lang="scss">
.file-system-encrypt-card {
  min-width: 300px;
}
</style>
