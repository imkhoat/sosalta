<template>
  <q-form
    ref="passwordSectionForm"
    no-error-focus
    :autofocus="false"
  >
    <q-expansion-item
      group="security-setting"
      expand-icon-toggle
      v-model="expanded"
      icon="r_none"
      expand-icon="none"
      expanded-icon="none"
      class="bg-grey-1 rounded-borders password-section"
    >
      <template #header>
        <div class="row items-center justify-between no-wrap full-width">
          <q-section-header
            :title="$t('pages.account.securitySetting.Signin password')"
            :sub-title="
              $t(
                'pages.account.securitySetting.Protect your account with a strong password'
              )
            "
          ></q-section-header>
          <q-btn
            v-if="!expanded"
            flat
            size="md"
            type="primary"
            color="accent"
            class="q-px-sm text-normal bg-grey-2"
            @click="onToggleMode"
            >Change password</q-btn
          >
        </div>
      </template>

      <q-card class="bg-grey-1 q-pa-md rounded-borders">
        <q-card-section class="q-px-none">
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Signin Password') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-password-input
                id="old-password"
                stack-label
                :readonly="!expanded"
                outlined
                :rules="rules.password"
                lazy-rules
                dense
                hide-bottom-space
                v-model="form.oldPassword"
              ></q-password-input>
            </div>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.New Password') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-password-input
                id="new-password"
                stack-label
                :readonly="!expanded"
                outlined
                :rules="rules.password"
                lazy-rules
                dense
                hide-bottom-space
                v-model="form.newPassword"
              ></q-password-input>
            </div>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Confirm Password') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-password-input
                id="confirm-password"
                stack-label
                :readonly="!expanded"
                outlined
                :rules="rules.confirmPassword"
                lazy-rules
                dense
                hide-bottom-space
                class="q-mb-md col-12 col-md-4"
                v-model="form.confirmPassword"
              ></q-password-input>
            </div>
          </div>
        </q-card-section>
        <q-form-actions
          v-model="expanded"
          :inline="!isMobileScreen"
          :dialog="isMobileScreen"
          :alert="formAlert"
          :actions="formActions"
        ></q-form-actions>
      </q-card>
    </q-expansion-item>
  </q-form>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, toRef } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { httpsChangePassword } from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { ActionProp } from 'src/core/types/action-prop-types'
import { AlertProp } from 'src/core/types/alert-prop-types'

// composables
const $q = useQuasar()
const { t } = useI18n()
const { confirmPasswordRules, passwordRules } = useRules()

// data
const passwordSectionForm = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)
const expanded = ref(false)
const loading = ref(false)
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = reactive({
  password: passwordRules,
  confirmPassword: confirmPasswordRules(toRef(form, 'newPassword')),
})

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: 'Cancel',
      action: onToggleMode,
    },
    {
      color: 'primary',
      unelevated: true,
      name: 'Save',
      action: onSave,
      loading: loading.value,
    },
  ]
})

const formAlert = computed((): AlertProp => {
  return {
    type: 'warning',
    text: t(
      'pages.account.securitySetting.Remember your new password for next login time'
    ),
  }
})

// methods
function onToggleMode() {
  expanded.value = !expanded.value
}

async function onSave() {
  const valid: boolean | undefined =
    await passwordSectionForm?.value?.validate()
  if (!valid) return
  loading.value = true
  const { oldPassword, newPassword } = form
  const params = {
    oldPassword,
    newPassword,
  }
  const data = await httpsChangePassword(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('pages.account.securitySetting.Change password success'),
      type: 'positive',
    })
    onToggleMode()
    loading.value = false
  } else {
    loading.value = false
  }
}
</script>
<style lang="scss">
.password-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
