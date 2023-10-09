<template>
  <div class="q-sms-input">
    <div class="row no-wrap items-start q-sms-input__box">
      <q-input
        id="otp"
        :label="$t('components.OTP verification code')"
        stack-label
        outlined
        v-bind="$attrs"
        v-model="otp"
        class="col-6 col-sm-7 col-shrink"
      ></q-input>
      <q-btn
        :color="isActiveShowCaptchaDialogButton ? 'primary' : 'disable'"
        :label="
          countDown.isCounting
            ? countDown.timer
            : $t('textActions.SEND VERIFICATION')
        "
        unelevated
        :class="$attrs?.dense || $attrs?.dense === '' ? 'dense' : ''"
        class="col-6 col-sm-5 col-shrink q-sms-input__action"
        :disable="!isActiveShowCaptchaDialogButton"
        @click="showCaptchaModal = true"
      />
    </div>
    <div
      v-if="hint"
      class="q-field__bottom row items-start q-field__bottom--stale"
    >
      {{ hint }}
    </div>
  </div>
  <q-dialog
    class="q-sms-input__captcha"
    v-model="showCaptchaModal"
  >
    <q-card class="q-sms-input__captcha-card">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ $t('components.Enter captcha') }}</div>
        <q-space />
        <q-btn
          icon="r_close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <q-captcha-input
          class="captcha"
          dense
          v-model="form.captcha"
          v-model:captcha-uuid="form.captchauuid"
          hide-bottom-space
        ></q-captcha-input>
      </q-card-section>
      <q-separator />
      <q-card-actions
        class="q-px-md"
        align="right"
      >
        <q-btn
          v-close-popup
          unelevated
          :color="isActiveSendSmsButton ? 'primary' : 'disable'"
          :label="$t('textActions.Send')"
          :disable="!isActiveSendSmsButton"
          @click="onSendVerification"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import {
  httpsGetSMSCode,
  httpsCheckPhoneNumber,
} from 'src/core/services/auth-services'
import {
  CheckPhoneNumberRequest,
  GetSmsCodeRequest,
} from 'src/core/types/services/auth-types'
import {
  httpsGetDeleteUserSMSCode,
  httpsGetSMSCode as httpsGetChangePhoneSMSCode,
} from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import {
  GetDeleteUserSMSCodeRequest,
  GetSMSCodeRequest,
} from 'src/core/types/services/user-types'

// composables
const $q = useQuasar()
const { t } = useI18n()

// props|emits
const props = defineProps<{
  modelValue: string
  region: string | undefined
  phone: string | undefined
  userName: string | undefined
  type:
    | 'register'
    | 'login'
    | 'findPassword'
    | 'deleteUser'
    | 'updatePhone'
    | 'change_phone'
  disable?: boolean
  phoneValidate?: boolean
  hint?: string | undefined
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (
    e: 'verify-phone',
    value: {
      valid: boolean
      message: string
    }
  ): void
  (e: 'sending', value: boolean): void
}>()

// data
const countDown = reactive({
  timer: 60,
  isCounting: false,
})

const showCaptchaModal = ref(false)

const form = reactive({
  captcha: '',
  captchauuid: '',
})

// computed
const otp = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const isActiveShowCaptchaDialogButton = computed(() => {
  return !countDown.isCounting && !props.disable
})

const isActiveSendSmsButton = computed(() => {
  return !!(form.captcha && form.captchauuid)
})

// methods
function generateCountdown() {
  countDown.timer = 60
  countDown.isCounting = true
  const { pause } = useIntervalFn(() => {
    countDown.timer--
    if (countDown.timer === 0) {
      pause()
      countDown.isCounting = false
    }
  }, 1000)
}

async function onSendVerification() {
  if (props.type === 'findPassword') {
    await handleSendVerification()
  } else if (props.type === 'change_phone') {
    await handleSendChangePhoneVerificationCode()
  } else if (props.type === 'deleteUser') {
    await handleSendDeleteUserVerification()
  } else {
    const response = await handleVerifyPhoneNumber()
    if (response?.valid) {
      await handleSendVerification()
    }
  }
  generateCountdown()
}

async function handleSendVerification() {
  emits('sending', false)
  const params: GetSmsCodeRequest = {
    cellingCode: props.region || '',
    phoneNumber: props.phone || '',
    type: props.type,
    userName: props.userName || '',
    captchaCode: form.captcha,
    captchauuid: form.captchauuid,
  }

  const data = await httpsGetSMSCode(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('components.A verification code has been sent to your phone'),
      type: 'positive',
    })

    emits('sending', true)
  }
}

async function handleSendChangePhoneVerificationCode() {
  emits('sending', false)
  const params: GetSMSCodeRequest = {
    cellingCode: props.region || '',
    phone: props.phone || '',
    captchaCode: form.captcha,
    captchauuid: form.captchauuid,
  }

  const data = await httpsGetChangePhoneSMSCode(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('components.A verification code has been sent to your phone'),
      type: 'positive',
    })
    emits('sending', true)
  }
}

async function handleSendDeleteUserVerification() {
  emits('sending', false)
  const params: GetDeleteUserSMSCodeRequest = {
    cellingCode: props.region || '',
    phoneNumber: props.phone || '',
    type: 'deleteUser',
    userName: props.userName || '',
    captchaCode: form.captcha,
    captchauuid: form.captchauuid,
  }

  const data = await httpsGetDeleteUserSMSCode(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: t('components.A verification code has been sent to your phone'),
      type: 'positive',
    })

    emits('sending', true)
  }
}

async function handleVerifyPhoneNumber() {
  const response = {
    valid: true,
    message: '',
  }
  if (props.region && props.phone?.trim()) {
    try {
      const params: CheckPhoneNumberRequest = {
        phoneNumber: props.phone,
        cellingCode: props.region,
        style: props.type,
        userName: props.userName || '',
      }

      const data = await httpsCheckPhoneNumber(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        response.valid = true
      } else {
        response.message = data?.message || ''
        response.valid = false
      }
    } catch (error) {
      response.valid = false
      response.message = error as string
    } finally {
      emits('verify-phone', response)
      return response
    }
  }
}
</script>
<style lang="scss">
.q-sms-input {
  &__box {
    gap: map-get($map: $space-xs, $key: x);
  }

  &__action {
    height: 56px !important;
    width: 172px;
    flex-shrink: 1 !important;
  }

  &__action.dense {
    height: 40px !important;
    font-size: 12px;
    line-height: 1.4em;
    flex-shrink: 1 !important;
  }

  &__captcha-card {
    min-width: 300px;
  }
}
</style>
