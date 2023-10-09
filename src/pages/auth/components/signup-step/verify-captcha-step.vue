<template>
  <q-card class="login-form q-pa-sm shadow-0">
    <q-card-section class="q-pa-none">
      <p class="col">
        {{ $t('pages.auth.signup.stepForm.Re-enter captcha code message') }}
      </p>
      <q-captcha-input
        ref="captchaEl"
        class="captcha"
        v-model="captchaValue"
        :rules="rules.captcha"
        lazy-rules
        hide-bottom-space
        v-model:captcha-uuid="captchauuidValue"
      ></q-captcha-input>
    </q-card-section>
    <q-card-actions class="q-px-none">
      <q-item class="q-mt-lg q-px-none">
        <q-checkbox
          color="primary"
          v-model="agreeTermAndPolicyValue"
        />
        <q-item-section>
          <q-item-label
            >{{
              $t(
                'pages.auth.signup.stepForm.I have read and accept the Atlas OS'
              )
            }}
            <a
              href="https://www.shannonbit.com/termsAndConditions"
              target="_blank"
              class="text-primary"
              >{{
                $t('pages.auth.signup.stepForm.Terms and Conditions of Use')
              }}</a
            >
            <a
              href="https://www.shannonbit.com/privacy"
              target="_blank"
              class="text-primary"
              >{{ $t('pages.auth.signup.stepForm.Privacy Policy') }}</a
            >
            {{ $t('pages.auth.signup.stepForm.and') }}
            <a
              href="https://www.shannonbit.com/disclaimer"
              target="_blank"
              class="text-primary"
              >{{ $t('pages.auth.signup.stepForm.Disclaimer') }}</a
            >
          </q-item-label>
        </q-item-section>
      </q-item>
      <div class="row no-wrap col q-mt-md">
        <q-btn
          color="primary"
          size="lg"
          no-caps
          class="width-half q-mr-sm"
          unelevated
          outline
          @click="onGoBack"
        >
          {{ $t('pages.auth.signup.stepForm.Back') }}
        </q-btn>
        <q-btn
          color="primary"
          size="lg"
          no-caps
          class="width-half"
          unelevated
          :disable="!agreeTermAndPolicyValue"
          @click="onSignup"
        >
          {{ $t('pages.auth.signup.stepForm.Sign up') }}
        </q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { QCaptchaInputElement } from 'src/core/types/q-captcha-input-element-types'

// composables
const { captchaRules, smsRules } = useRules()

// props/emits
const props = defineProps(['modelValue'])
const emits = defineEmits(['preview', 'signup', 'update:modelValue'])

// data
const rules = reactive({
  captcha: captchaRules,
  otp: smsRules,
})

const captchaEl = ref<InstanceType<QCaptchaInputElement> | null>(null)

// computed
const captchaValue = computed({
  get() {
    return props.modelValue.captcha
  },
  set(value) {
    emits('update:modelValue', {
      captcha: value,
      captchauuid: captchauuidValue.value,
      agreeTermAndPolicy: agreeTermAndPolicyValue.value,
    })
  },
})

const captchauuidValue = computed({
  get() {
    return props.modelValue.captchauuid
  },
  set(value) {
    emits('update:modelValue', {
      captcha: captchaValue.value,
      captchauuid: value,
      agreeTermAndPolicy: agreeTermAndPolicyValue.value,
    })
  },
})

const agreeTermAndPolicyValue = computed({
  get() {
    return props.modelValue.agreeTermAndPolicy
  },
  set(value) {
    emits('update:modelValue', {
      captcha: captchaValue.value,
      captchauuid: captchauuidValue.value,
      agreeTermAndPolicy: value,
    })
  },
})

// methods
function onSignup() {
  emits('signup')
}

function onGoBack() {
  emits('preview')
}

function refreshCaptcha() {
  captchaValue.value = ''
  captchaEl?.value?.refresh()
}

// hook
defineExpose({
  refreshCaptcha,
})
</script>
