<template>
  <div class="q-email-code-input">
    <div class="row no-wrap items-start q-email-code-input__box">
      <q-input
        id="otp"
        :label="$t('components.Email verification code')"
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
        class="col-6 col-sm-5 col-shrink q-email-code-input__action"
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
    class="q-email-code-input__captcha"
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
import { computed, reactive, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import {
  httpsGetEmailCode,
  httpsSendEmailValidationCode,
} from 'src/core/services/user-services'
import { GetEmailCodeRequest } from 'src/core/types/services/user-types'

// composables
const $q = useQuasar()

// props|emits
const props = withDefaults(
  defineProps<{
    modelValue: string
    email: string
    disable?: boolean
    phoneValidate?: boolean
    hint?: string | undefined
    mode?: 'GENERAL' | 'EMAIL_VALIDATION'
  }>(),
  {
    mode: 'GENERAL',
  }
)
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
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
  await handleSendVerification()
  generateCountdown()
}

async function handleSendVerification() {
  emits('sending', false)
  const params: GetEmailCodeRequest = {
    email: props.email,
    captchaCode: form.captcha,
    captchauuid: form.captchauuid,
  }

  let data = null
  if (props.mode === 'GENERAL') {
    data = await httpsGetEmailCode(params)
  } else {
    data = await httpsSendEmailValidationCode(params)
  }

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.notify({
      message: 'A verification code has been sent to your email',
      type: 'positive',
    })

    emits('sending', true)
  }
}
</script>
<style lang="scss">
.q-email-code-input {
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
