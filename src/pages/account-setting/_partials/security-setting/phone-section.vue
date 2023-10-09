<template>
  <q-form
    ref="phoneSectionForm"
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
      class="bg-grey-1 rounded-borders phone-section"
    >
      <template #header>
        <div class="row items-center justify-between no-wrap full-width">
          <q-section-header
            title="Cell number"
            :sub-title="currentPhoneWithCellingCode"
            badge="Verified"
            badge-color="positive"
          ></q-section-header>
          <q-btn
            v-if="!expanded"
            flat
            size="md"
            type="primary"
            color="accent"
            class="q-px-sm text-normal bg-grey-2"
            @click="onToggleMode"
            >Change phone</q-btn
          >
        </div>
      </template>
      <q-card class="bg-grey-1 q-pa-md rounded-borders">
        <q-card-section class="q-px-none">
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Account Password') }}
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
                v-model="form.password"
              ></q-password-input>
            </div>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.New Phone') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-phone-input
                id="phone-input"
                stack-label
                :readonly="!expanded"
                outlined
                lazy-rules
                dense
                hide-bottom-space
                v-model="form.phone"
              ></q-phone-input>
            </div>
          </div>
          <div class="block-form row">
            <div class="text-subtitle2 col-12 col-md-3">
              {{ $t('pages.account.securitySetting.Verification Code') }}
            </div>
            <div class="col-12 col-md-6 q-mb-md">
              <q-sms-input
                id="first-name"
                stack-label
                :readonly="!expanded"
                outlined
                lazy-rules
                dense
                v-model="form.phoneCode"
                :phone="newPhoneNumber"
                :region="newRegionNumber"
                :user-name="currentUserName"
                :rules="rules.phoneCode"
                :disable="!isActiveSendSMSButton"
                :phone-validate="true"
                :hint="smsSent ? smsSendingNotificationContent : undefined"
                type="change_phone"
                @sending="onSendSMS"
                hide-bottom-space
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
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import {
  httpsChangePhone,
  httpsGetUserProfile,
} from 'src/core/services/user-services'
import { ActionProp } from 'src/core/types/action-prop-types'

// initdata
const getInitialData = () => ({
  password: '',
  captcha: '',
  captchauuid: '',
  phone: {
    code: {
      chineseName: '美国',
      country: 'United States of America',
      region: '+1',
      shortName: 'US',
      showName: '(+1) United States of America',
    },
    phone: '',
  },
  phoneCode: '',
})

// composables
const $q = useQuasar()
const { t } = useI18n()
const { getUserName, getUserInformation } = storeToRefs(useAuthStore())
const { passwordRules, captchaRules, smsRules } = useRules()

// data
const expanded = ref(false)
const loading = ref(false)
const smsSent = ref(false)
const form = reactive(getInitialData())

const rules = reactive({
  password: passwordRules,
  captcha: captchaRules,
  phoneCode: smsRules,
})

const phoneSectionForm = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.sm
})

const newPhoneNumber = computed(() => {
  return form.phone?.phone
})
const newRegionNumber = computed(() => {
  return form.phone?.code?.region
})

const formActions = computed((): ActionProp[] => {
  return [
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

const currentPhoneWithCellingCode = computed(() => {
  if (!currentCellingCode.value) {
    return `${currentPhoneNumber.value}`
  }
  return `(${currentCellingCode.value}) ${currentPhoneNumber.value}`
})

const isActiveSendSMSButton = computed(() => {
  return form.phone.phone
})

const smsSendingNotificationContent = computed(() => {
  try {
    const smsPhoneNumber = `********${newPhoneNumber.value?.substring(
      currentPhoneNumber.value.length - 4,
      currentPhoneNumber.value.length
    )}`
    return t('pages.account.securitySetting.A message will be sent to', {
      phone: smsPhoneNumber,
    })
  } catch (error) {
    return error
  }
})

// methods
function onToggleMode() {
  expanded.value = !expanded.value
}

async function onSave() {
  const valid: boolean | undefined = await phoneSectionForm?.value?.validate()

  if (!valid) return
  loading.value = true
  const { password, phone, phoneCode } = form
  const params = {
    password,
    phoneCode,
    phone: phone?.phone,
    cellingCode: phone?.code?.region,
    oldPhone: currentPhoneNumber.value,
  }
  const data = await httpsChangePhone(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('pages.account.securitySetting.Change phone success'),
      type: 'positive',
    })
    await httpsGetUserProfile()
    resetForm()
    onToggleMode()
    loading.value = false
  } else {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, getInitialData())
}

function onSendSMS(status: boolean) {
  smsSent.value = status
}
</script>
<style lang="scss">
.phone-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
