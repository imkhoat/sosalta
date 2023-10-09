<template>
  <q-form
    ref="emailSectionForm"
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
      class="bg-grey-1 rounded-borders email-section"
    >
      <template #header>
        <div class="row items-center justify-between no-wrap full-width">
          <q-section-header
            :title="$t('pages.account.securitySetting.Email')"
            :sub-title="currentEmail"
            :badge="
              hasEmailCertificated
                ? $t('pages.account.securitySetting.Verified')
                : $t('pages.account.securitySetting.Unverified')
            "
            :badge-color="hasEmailCertificated ? 'positive' : 'negative'"
          ></q-section-header>
          <div class="row justify-end items-center q-gutter-sm">
            <q-btn
              v-if="!expanded && !hasEmailCertificated"
              flat
              outline
              size="md"
              color="positive"
              class="q-px-sm text-normal bg-grey-2"
              @click="onGoToVerifyEmail"
              >Verify email</q-btn
            >
            <q-btn
              v-if="!expanded"
              flat
              size="md"
              type="primary"
              color="accent"
              class="q-px-sm text-normal bg-grey-2"
              @click="onGoToChangeEmail"
              >Change mail</q-btn
            >
          </div>
        </div>
      </template>
      <q-card
        v-if="modal.mode === 'CHANGE_MAIL'"
        class="bg-grey-1 q-pa-md rounded-borders"
      >
        <q-card-section class="q-px-none">
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Account Password') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-password-input
                id="email-section__password"
                stack-label
                :readonly="!expanded"
                outlined
                :rules="rules.password"
                lazy-rules
                dense
                hide-bottom-space
                v-model="form.password"
              ></q-password-input>
            </div>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.New Email') }}
            </div>
            <q-input
              id="email-section__email"
              stack-label
              :readonly="!expanded"
              :rules="rules.email"
              outlined
              lazy-rules
              dense
              hide-bottom-space
              class="q-mb-md col-12 col-md-6"
              v-model="form.email"
            ></q-input>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Verification Code') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-email-code-input
                id="email-section__sms-input"
                stack-label
                :readonly="!expanded"
                outlined
                lazy-rules
                dense
                v-model="form.emailCode"
                :email="form.email"
                :disable="!isActiveSendEmailCodeButton"
                :hint="smsSent ? smsSendingNotificationContent : undefined"
                @sending="onSendSMS"
                hide-bottom-space
              ></q-email-code-input>
            </div>
          </div>
        </q-card-section>
        <q-form-actions
          v-model="expanded"
          :inline="!isMobileScreen"
          :dialog="isMobileScreen"
          :actions="formActions"
        ></q-form-actions>
      </q-card>

      <q-card
        v-else
        class="bg-grey-1 q-pa-md rounded-borders"
      >
        <q-card-section class="q-px-none">
          <div class="block-form row rounded-borders">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Current Email') }}
            </div>
            <q-input
              id="email-section__email"
              stack-label
              :readonly="true"
              outlined
              lazy-rules
              dense
              hide-bottom-space
              class="q-mb-md col-12 col-md-6"
              :model-value="currentEmail"
            ></q-input>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Verification Code') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-email-code-input
                id="email-section__sms-input"
                stack-label
                :readonly="!expanded"
                outlined
                lazy-rules
                dense
                v-model="form.emailCode"
                :mode="'EMAIL_VALIDATION'"
                :email="currentEmail"
                :disable="false"
                :hint="smsSent ? smsSendingNotificationContent : undefined"
                @sending="onSendSMS"
                hide-bottom-space
              ></q-email-code-input>
            </div>
          </div>
        </q-card-section>
        <q-form-actions
          v-model="expanded"
          :inline="!isMobileScreen"
          :dialog="isMobileScreen"
          :actions="formActions"
        ></q-form-actions>
      </q-card>
    </q-expansion-item>
  </q-form>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { useAuthStore } from 'src/core/stores/auth'
import {
  httpsChangeEmail,
  httpsGetUserProfile,
  httpsSendEmailValidation,
} from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { ActionProp } from 'src/core/types/action-prop-types'
import { storeToRefs } from 'pinia'

// composables
const $q = useQuasar()

const { t } = useI18n()

const { getUserInformation } = storeToRefs(useAuthStore())

const { emailRules, captchaRules, smsRules, passwordRules } = useRules()

// data
const expanded = ref(false)
const smsSent = ref(false)
const loading = ref(false)
const modal = reactive<{
  visibled: boolean
  mode: 'CHANGE_MAIL' | 'VERIFY_MAIL'
}>({
  visibled: false,
  mode: 'CHANGE_MAIL',
})

const form = reactive({
  password: '',
  email: '',
  emailCode: '',
})

const rules = reactive({
  password: passwordRules,
  email: emailRules,
  captcha: captchaRules,
  emailCode: smsRules,
})

const emailSectionForm = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const formActions = computed((): ActionProp[] => {
  return modal.mode === 'CHANGE_MAIL'
    ? [
        {
          type: 'primary',
          color: 'primary',
          flat: true,
          name: t('textActions.Cancel'),
          action: onToggleMode,
        },
        {
          color: 'primary',
          unelevated: true,
          name: t('textActions.Save'),
          action: onSave,
          loading: loading.value,
        },
      ]
    : [
        {
          type: 'primary',
          color: 'primary',
          flat: true,
          name: t('textActions.Cancel'),
          action: onToggleMode,
        },
        {
          color: 'primary',
          unelevated: true,
          name: t('textActions.Confirm'),
          action: onVerifyEmail,
          loading: loading.value,
        },
      ]
})

const isActiveSendEmailCodeButton = computed(() => {
  return form.email
})

const currentEmail = computed(() => {
  return getUserInformation.value?.email
})

const hasEmailCertificated = computed(() => {
  return getUserInformation.value?.emailCertification
})

const smsSendingNotificationContent = computed(() => {
  try {
    return t('pages.account.securitySetting.A message will be sent to email', {
      email: form.email,
    })
  } catch (error) {
    return error
  }
})
// methods
function onToggleMode() {
  expanded.value = !expanded.value
}

function onGoToVerifyEmail() {
  modal.mode = 'VERIFY_MAIL'
  modal.visibled = true
  onToggleMode()
}

function onGoToChangeEmail() {
  modal.mode = 'CHANGE_MAIL'
  modal.visibled = true
  onToggleMode()
}

async function onVerifyEmail() {
  const valid: boolean | undefined = await emailSectionForm?.value?.validate()

  if (!valid) return
  loading.value = true
  const { emailCode } = form
  const params = {
    email: currentEmail.value ?? '',
    emailCode,
  }
  const data = await httpsSendEmailValidation(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('pages.account.securitySetting.Verify email success'),
      type: 'positive',
    })
    await httpsGetUserProfile()
    onToggleMode()
    loading.value = false
  } else {
    loading.value = false
  }
}

async function onSave() {
  const valid: boolean | undefined = await emailSectionForm?.value?.validate()

  if (!valid) return
  loading.value = true
  const { password, email, emailCode } = form
  const params = {
    password,
    email,
    emailCode,
    oldEmail: currentEmail.value,
  }
  const data = await httpsChangeEmail(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('pages.account.securitySetting.Change email success'),
      type: 'positive',
    })
    await httpsGetUserProfile()
    onToggleMode()
    loading.value = false
  } else {
    loading.value = false
  }
}

function onSendSMS(status: boolean) {
  smsSent.value = status
}
</script>
<style lang="scss">
.email-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
