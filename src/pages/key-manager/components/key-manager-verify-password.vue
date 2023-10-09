<template>
  <q-card class="key-manager-verify-password">
    <q-form
      ref="keyManagerVerifyPassword"
      no-error-focus
      :autofocus="false"
      @submit="onVerifyMasterPassword"
    >
      <q-card-section class="column justify-center items-center">
        <q-avatar
          size="120px"
          color="grey-1"
          text-color="grey-3"
        >
          <q-avatar
            size="90px"
            color="grey-3"
            text-color="positive"
          >
            <q-icon name="sym_o_lock"></q-icon>
          </q-avatar>
        </q-avatar>
        <strong class="text-h5 text-weight-bold">{{
          $t(`pages.keyManager.verifyForm.Key manager is locked`)
        }}</strong>
        <span class="text-caption text-disable text-center">{{
          $t(
            `pages.keyManager.verifyForm.Please submit master password before access key manager page`
          )
        }}</span>
      </q-card-section>
      <q-card-section>
        <q-password-input
          id="old-password"
          label="Master password"
          stack-label
          outlined
          v-model="form.password"
          :rules="rules.password"
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
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { ActionProp } from 'src/core/types/action-prop-types'

import { useKeyManager } from '../hooks/use-key-manager'
import { errorHandler } from 'src/core/utils/error-handler'

// props & emits
const emits = defineEmits(['close', 'verified'])

// composables
const { t } = useI18n()
const { passwordRules } = useRules()
const { handleVerifyManagerPassword, loading } = useKeyManager()
// data
const form = reactive({
  password: '',
})

const rules = reactive({
  password: passwordRules,
})

const keyManagerVerifyPassword = ref<
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
      name: t('textActions.Verify'),
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onVerifyMasterPassword() {
  try {
    const valid: boolean | undefined =
      await keyManagerVerifyPassword?.value?.validate()
    if (!valid) return

    const result = await handleVerifyManagerPassword(form.password)
    if (result) {
      emits('verified')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.key-manager-verify-password {
  width: 350px;
}
</style>
