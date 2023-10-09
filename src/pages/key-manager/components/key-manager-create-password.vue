<template>
  <q-card class="key-manager-create-password">
    <q-form
      ref="keyManagerCreateManagerPassword"
      no-error-focus
      :autofocus="false"
      @submit="onCreateManagerPassword"
    >
      <q-card-section>
        <q-section-header
          :title="$t(`pages.keyManager.createPassword.Create master password`)"
          :sub-title="
            $t(
              `pages.keyManager.createPassword.Input your password and click create`
            )
          "
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-password-input
          id="master-password"
          class="q-mb-md"
          :label="$t(`pages.keyManager.createPassword.Master password`)"
          stack-label
          outlined
          v-model="form.password"
          :rules="rules.password"
          lazy-rules
          dense
          hide-bottom-space
        ></q-password-input>
        <q-password-input
          id="confirm-master-password"
          :label="$t(`pages.keyManager.createPassword.Confirm password`)"
          stack-label
          outlined
          v-model="form.confirmPassword"
          :rules="rules.confirmPassword"
          lazy-rules
          dense
          hide-bottom-space
        ></q-password-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'

import useRules from 'src/core/composables/use-rules'
import { useKeyManager } from '../hooks/use-key-manager'

// props & emits
const emits = defineEmits(['close', 'success'])

// composables
const { t } = useI18n()
const { confirmPasswordRules, passwordRules } = useRules()
const { loading, handleCreateManagerPassword } = useKeyManager()

// data
const form = reactive({
  password: '',
  confirmPassword: '',
})

const rules = reactive({
  password: passwordRules,
  confirmPassword: confirmPasswordRules(toRef(form, 'password')),
})

const keyManagerCreateManagerPassword = ref<
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
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onCreateManagerPassword() {
  try {
    const valid: boolean | undefined =
      await keyManagerCreateManagerPassword?.value?.validate()
    if (!valid) return

    const result = await handleCreateManagerPassword(form.password)
    if (result) {
      emits('success')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.key-manager-create-password {
  width: 350px;
}
</style>
