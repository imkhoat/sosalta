<template>
  <q-card class="key-manager-create-password">
    <q-form
      ref="keyManagerChangePassword"
      no-error-focus
      :autofocus="false"
      @submit="onChangeManagerPassword"
    >
      <q-card-section>
        <q-section-header
          :title="$t(`pages.keyManager.changePassword.Change master password`)"
          :sub-title="
            $t(
              `pages.keyManager.changePassword.Enter old password, new password and press save`
            )
          "
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-password-input
          id="master-password"
          class="q-mb-md"
          :label="$t(`pages.keyManager.changePassword.Master password`)"
          stack-label
          outlined
          v-model="form.password"
          :rules="rules.password"
          lazy-rules
          dense
          hide-bottom-space
        ></q-password-input>
        <q-password-input
          id="new-master-password"
          class="q-mb-md"
          :label="$t(`pages.keyManager.changePassword.New password`)"
          stack-label
          outlined
          v-model="form.newPassword"
          :rules="rules.password"
          lazy-rules
          dense
          hide-bottom-space
        ></q-password-input>
        <q-password-input
          id="confirm-master-password"
          class="q-mb-md"
          :label="$t(`pages.keyManager.changePassword.Confirm password`)"
          stack-label
          outlined
          v-model="form.confirmPassword"
          :rules="rules.confirmPassword"
          lazy-rules
          dense
          hide-bottom-space
        ></q-password-input>
        <q-alert
          type="warning"
          class="col-12 col-md-8 q-my-xs"
        >
          {{
            $t(`pages.keyManager.changePassword.Please save your new password`)
          }}
        </q-alert>
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
import useRules from 'src/core/composables/use-rules'
import { useKeyManager } from '../hooks/use-key-manager'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'

// props & emits
const emits = defineEmits(['close'])

// composables
const { t } = useI18n()
const { confirmPasswordRules, passwordRules } = useRules()
const { loading, handleChangeManagerPassword } = useKeyManager()

// data
const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = reactive({
  password: passwordRules,
  confirmPassword: confirmPasswordRules(toRef(form, 'newPassword')),
})

const keyManagerChangePassword = ref<
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
async function onChangeManagerPassword() {
  try {
    const valid: boolean | undefined =
      await keyManagerChangePassword?.value?.validate()
    if (!valid) return

    const result = await handleChangeManagerPassword(
      form.password,
      form.newPassword
    )
    if (result) {
      emits('close')
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
