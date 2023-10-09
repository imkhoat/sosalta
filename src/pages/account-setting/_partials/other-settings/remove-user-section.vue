<template>
  <q-form
    ref="removeUserSectionForm"
    no-error-focus
    :autofocus="false"
    @submit="onSaveOrNext"
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
            :title="$t('pages.account.otherSettings.Delete account')"
            :sub-title="
              $t(
                'pages.account.otherSettings.Deleted accounts cannot be restored'
              )
            "
          ></q-section-header>
          <q-btn
            outline
            size="md"
            type="primary"
            color="primary"
            class="q-px-sm"
            @click="onToggleMode"
            >{{ headerSectionButtonText }}</q-btn
          >
        </div>
      </template>
      <q-card class="bg-grey-1 q-pa-md rounded-borders">
        <q-card-section class="q-px-none">
          <div class="block-form row">
            <q-alert
              type="warning"
              class="col-12 q-mb-xl"
            >
              <span
                v-html="
                  $t(
                    'pages.account.otherSettings.You are in the process of deleting your main account'
                  )
                "
              ></span>
            </q-alert>
          </div>
        </q-card-section>
        <q-card-section
          v-if="currentDeleteStep === DELETE_STEP.CONTACT_STEP"
          class="q-px-none"
        >
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-4">
              {{ $t('pages.account.otherSettings.Contact person name') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-input
                id="true-name"
                stack-label
                :readonly="!expanded"
                outlined
                lazy-rules
                dense
                hide-bottom-space
                :rules="rules.trueName"
                v-model="form.trueName"
              ></q-input>
            </div>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-4">
              {{ $t('pages.account.otherSettings.Contact person email') }}
            </div>
            <q-input
              id="email"
              stack-label
              :readonly="!expanded"
              outlined
              lazy-rules
              dense
              hide-bottom-space
              :rules="rules.email"
              class="q-mb-md col-12 col-md-6"
              v-model="form.email"
            ></q-input>
          </div>
        </q-card-section>
        <q-card-section
          v-if="currentDeleteStep === DELETE_STEP.CONFIRM_STEP"
          class="q-px-none"
        >
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-4">
              {{ $t('pages.account.otherSettings.Main account password') }}
            </div>
            <div class="col-12 col-md-7 q-mb-md">
              <q-password-input
                id="password"
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
            <div class="text-subtitle2 col-12 col-md-4">
              {{ $t('pages.account.otherSettings.Verification code') }}
            </div>
            <div class="q-mb-md col-12 col-md-7">
              <q-sms-input
                id="verification-code"
                stack-label
                :readonly="!expanded"
                outlined
                lazy-rules
                dense
                type="deleteUser"
                hide-bottom-space
                v-model="form.smsCode"
                :phone="currentPhoneNumber"
                :region="currentCellingCode"
                :user-name="currentUserName"
                :rules="rules.phoneCode"
                :disable="!isActiveSendSMSButton"
                :hint="smsSent ? smsSendingNotificationContent : undefined"
                @sending="onSendSMS"
              ></q-sms-input>
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
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useAuthStore } from 'src/core/stores/auth'
import useRules from 'src/core/composables/use-rules'
import { httpsDeleteUser } from 'src/core/services/user-services'
import { ActionProp } from 'src/core/types/action-prop-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

const DELETE_STEP = {
  CONTACT_STEP: 'CONTACT_STEP',
  CONFIRM_STEP: 'CONFIRM_STEP',
}
// composables
const $q = useQuasar()
const { t } = useI18n()
const { passwordRules, smsRules, emailRules, fieldRequiredRules } = useRules()
const { getUserName, getUserInformation } = storeToRefs(useAuthStore())

// data
const loading = ref(false)
const expanded = ref(false)
const smsSent = ref(false)
const currentDeleteStep = ref(DELETE_STEP.CONTACT_STEP)
const removeUserSectionForm = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

const form = reactive({
  trueName: '',
  email: '',
  password: '',
  smsCode: '',
  userName: getUserName.value,
})

const rules = reactive({
  trueName: fieldRequiredRules,
  password: passwordRules,
  email: emailRules,
  phoneCode: smsRules,
})

// computed
const headerSectionButtonText = computed(() => {
  return expanded.value ? 'Cancel' : 'Start'
})

const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: cancelOrPreviewTextAction.value,
      action: onCancelOrPreview,
    },
    {
      color: 'primary',
      unelevated: true,
      name: SaveOrNextTextAction.value,
      action: onSaveOrNext,
      loading: loading.value,
    },
  ]
})

const cancelOrPreviewTextAction = computed(() => {
  if (currentDeleteStep.value === DELETE_STEP.CONFIRM_STEP) {
    return t('textActions.Preview')
  }
  return t('textActions.Cancel')
})

const SaveOrNextTextAction = computed(() => {
  if (currentDeleteStep.value === DELETE_STEP.CONFIRM_STEP) {
    return t('textActions.Delete')
  }
  return t('textActions.Next')
})

const currentUserName = computed(() => {
  return getUserName.value
})

const currentPhoneNumber = computed(() => {
  return getUserInformation.value?.phoneNumber || ''
})

const currentCellingCode = computed(() => {
  return getUserInformation.value?.cellingCode || ''
})

const isActiveSendSMSButton = computed(() => {
  return form.password
})

const smsSendingNotificationContent = computed(() => {
  const smsPhoneNumber = `********${currentPhoneNumber.value.substring(
    currentPhoneNumber.value.length - 4,
    currentPhoneNumber.value.length
  )}`
  return t('pages.account.otherSettings.A message will be sent to', {
    phone: smsPhoneNumber,
  })
})
// methods
function onToggleMode() {
  expanded.value = !expanded.value
  currentDeleteStep.value = DELETE_STEP.CONTACT_STEP
}

async function handleRemoveUser() {
  loading.value = true
  const params = {
    ...form,
    userName: getUserName.value,
  }
  const data = await httpsDeleteUser(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('pages.account.otherSettings.Delete account success'),
      type: 'positive',
    })
    onToggleMode()
    loading.value = false
  } else {
    loading.value = false
  }
}

async function onSaveOrNext() {
  const valid: boolean | undefined =
    await removeUserSectionForm?.value?.validate()
  if (!valid) return

  if (currentDeleteStep.value === DELETE_STEP.CONFIRM_STEP) {
    await handleRemoveUser()
  } else {
    currentDeleteStep.value = DELETE_STEP.CONFIRM_STEP
  }
}

function onCancelOrPreview() {
  if (currentDeleteStep.value === DELETE_STEP.CONFIRM_STEP) {
    currentDeleteStep.value = DELETE_STEP.CONTACT_STEP
  } else {
    onToggleMode()
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
