<template>
  <q-form @submit="onNext">
    <q-card class="verify-phone shadow-0">
      <q-card-section class="q-pa-none">
        <div class="column">
          <span class="q-mb-lg">{{
            $t(
              'pages.auth.signup.stepForm.To secure your account, Atlas OS wants to verify your identity'
            )
          }}</span>
          <q-phone-input
            id="phone"
            :label="$t('pages.auth.signup.form.Phone number')"
            stack-label
            v-model="phoneValue"
            dense
            class="q-mb-md"
            :error="serverError.phone.state"
            :error-message="serverError.phone.message"
            :loading="supportData.isLoading.phone"
            @blur="onVerifyPhoneNumber"
            @submit="onVerifyPhoneNumber"
          ></q-phone-input>
          <q-sms-input
            v-model="otpValue"
            :phone="phoneValue.phone"
            :region="phoneValue?.code?.region"
            :user-name="userName"
            :rules="rules.otp"
            lazy-rules
            hide-bottom-space
            class="sms"
            type="register"
          ></q-sms-input>
        </div>
      </q-card-section>
      <q-card-actions
        align="center"
        class="q-px-none row no-wrap"
      >
        <q-btn
          color="primary"
          size="lg"
          no-caps
          class="width-half"
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
          type="submit"
        >
          {{ $t('pages.auth.signup.stepForm.Next') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsCheckPhoneNumber } from 'src/core/services/auth-services'
import { CheckPhoneNumberRequest } from 'src/core/types/services/auth-types'

// props/emits
const props = defineProps(['modelValue', 'userName'])
const emits = defineEmits(['preview', 'next', 'update:modelValue'])

// composable
const { smsRules } = useRules()
const { t } = useI18n()

// data
const rules = reactive({
  otp: smsRules,
})

const serverError = reactive({
  phone: {
    state: false,
    message: '',
  },
})

const supportData = reactive({
  isLoading: {
    phone: false,
  },
})

// computed
const phoneValue = computed({
  get() {
    return {
      phone: props.modelValue.phone,
      code: props.modelValue.code,
    }
  },
  set(value) {
    emits('update:modelValue', {
      code: value.code,
      phone: value.phone,
      otp: otpValue.value,
    })
  },
})
const otpValue = computed({
  get() {
    return props.modelValue.otp
  },
  set(value) {
    emits('update:modelValue', {
      code: phoneValue.value.code,
      phone: phoneValue.value.phone,
      otp: value,
    })
  },
})

// methods
function onNext() {
  emits('next')
}

function onGoBack() {
  emits('preview')
}

async function onVerifyPhoneNumber() {
  if (phoneValue.value?.code && phoneValue.value?.phone?.trim()) {
    try {
      handleToggleServerError(false)
      supportData.isLoading.phone = true
      const params: CheckPhoneNumberRequest = {
        phoneNumber: phoneValue.value?.phone,
        cellingCode: phoneValue.value?.code?.region,
        style: 'register',
        userName: props.userName,
      }

      const data = await httpsCheckPhoneNumber(params)

      if (data?.code !== RESPONSE_CODE.SUCCESS) {
        handleToggleServerError(
          true,
          data?.message || t('general.Server validate fail')
        )
      }
    } catch (error) {
    } finally {
      supportData.isLoading.phone = false
    }
  }
}

function handleToggleServerError(state: boolean, message?: string) {
  serverError.phone.state = state

  if (message) {
    serverError.phone.message = message
  }
}
</script>

<style lang="scss">
.sms {
  .q-sms-input__action {
    width: 172px;
    min-width: 172px;
  }
}
</style>
