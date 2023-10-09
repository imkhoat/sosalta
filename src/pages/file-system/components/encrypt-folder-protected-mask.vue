<template>
  <div class="encrypt-folder-protected-mask">
    <q-card class="encrypt-folder-protected-mask__card">
      <q-form
        ref="encryptFolderProtectedMask"
        no-error-focus
        :autofocus="false"
        @submit="onValidatePassword"
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
              <q-icon name="verified_user"></q-icon>
            </q-avatar>
          </q-avatar>
          <strong class="text-h5 text-weight-bold">The folder is locked</strong>
          <span class="text-caption text-disable text-center"
            >Please submit master password before access encrypted folder</span
          >
        </q-card-section>
        <q-card-section class="column justify-center items-center">
          <q-password-input
            id="old-password"
            class="full-width"
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
        <q-card-actions align="right">
          <q-form-actions :actions="formActions"></q-form-actions>
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useFiles } from 'src/pages/file-system/hooks/use-files'

// composables
const { t } = useI18n()
const { passwordRules } = useRules()
const { handleValidateEncryptedPassword, loading } = useFiles()

// props & emits
const emits = defineEmits(['close', 'success'])

// data
const password = ref('')

const rules = reactive({
  password: passwordRules,
})

const encryptFolderProtectedMask = ref<
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
      name: t('textActions.Next'),
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onValidatePassword() {
  try {
    const validState = await handleValidateEncryptedPassword(password.value)
    if (validState) {
      emits('success')
    }
  } catch (error) {}
}
</script>
<style lang="scss">
.encrypt-folder-protected-mask {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100vw;
  width: 100%;
  min-height: 100vh;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
  }

  &__card {
    margin: map-get($map: $space-md, $key: y);
  }
}
</style>
