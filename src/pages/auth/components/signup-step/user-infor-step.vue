<template>
  <q-form @submit="onNext">
    <q-card class="user-infor q-pa-sm shadow-0">
      <q-card-section class="q-pa-none">
        <p>{{ $t('pages.auth.signup.stepForm.Provide your informations') }}</p>
        <q-input
          id="user-name"
          :label="$t('pages.auth.signup.stepForm.Username')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="userNameValue"
          :rules="rules.userName"
          lazy-rules
          hide-bottom-space
          :error="serverError.userName.state"
          :error-message="serverError.userName.message"
          :loading="supportData.isLoading.userName"
          @blur="onVerifyUserName"
        >
        </q-input>
        <q-input
          id="password"
          :label="$t('pages.auth.signup.stepForm.Password')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="passwordValue"
          :type="supportData.hasShowPassword.password ? 'text' : 'password'"
          :rules="rules.password"
          lazy-rules
          hide-bottom-space
        >
          <template #append>
            <q-icon
              class="cursor-pointer"
              :name="
                supportData.hasShowPassword.password
                  ? 'visibility_off'
                  : 'visibility'
              "
              @click="
                supportData.hasShowPassword.password =
                  !supportData.hasShowPassword.password
              "
            >
            </q-icon>
          </template>
        </q-input>
        <q-input
          id="confirm-password"
          :label="$t('pages.auth.signup.stepForm.Confirm password')"
          stack-label
          outlined
          class="q-mb-md"
          :type="
            supportData.hasShowPassword.confirmPassword ? 'text' : 'password'
          "
          v-model="confirmPasswordValue"
          :rules="rules.confirmPassword"
          lazy-rules
          hide-bottom-space
        >
          <template #append>
            <q-icon
              class="cursor-pointer"
              :name="
                supportData.hasShowPassword.confirmPassword
                  ? 'visibility_off'
                  : 'visibility'
              "
              @click="
                supportData.hasShowPassword.confirmPassword =
                  !supportData.hasShowPassword.confirmPassword
              "
            >
            </q-icon>
          </template>
        </q-input>
        <q-input
          id="email"
          :label="$t('pages.auth.signup.stepForm.Email')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="emailValue"
          :rules="rules.email"
          lazy-rules
          hide-bottom-space
        >
        </q-input>
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
          :loading="supportData.isLoading.form"
        >
          {{ $t('pages.auth.signup.stepForm.Next') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsCheckUserName } from 'src/core/services/auth-services'
import { CheckUserNameRequest } from 'src/core/types/services/auth-types'

// props/emits
const props = defineProps(['modelValue'])
const emits = defineEmits(['preview', 'next', 'update:modelValue'])

// composables
const route = useRoute()
const { t } = useI18n()
const { confirmPasswordRules, emailRules, passwordRules, userNameRules } =
  useRules()

// computed
const userNameValue = computed({
  get() {
    return form.userName || props.modelValue.userName
  },
  set(value) {
    form.userName = value
  },
})

const emailValue = computed({
  get() {
    return form.email || props.modelValue.email
  },
  set(value) {
    form.email = value
  },
})

const passwordValue = computed({
  get() {
    return form.password || props.modelValue.password
  },
  set(value) {
    form.password = value
  },
})

const confirmPasswordValue = computed({
  get() {
    return form.confirmPassword || props.modelValue.confirmPassword
  },
  set(value) {
    form.confirmPassword = value
  },
})

// data
const form = reactive({
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const supportData = reactive({
  isLoading: {
    form: false,
    userName: false,
  },
  hasShowPassword: {
    password: false,
    confirmPassword: false,
  },
})

const rules = reactive({
  userName: userNameRules,
  password: passwordRules,
  confirmPassword: confirmPasswordRules(passwordValue),
  email: emailRules,
})

const serverError = reactive({
  userName: {
    state: false,
    message: '',
  },
})

// hook
watchEffect(() => {
  const { userName, email } = route.query
  form.userName = !!form.userName
    ? form.userName
    : !!userNameValue.value
    ? userNameValue.value
    : (userName as string)
  form.email = !!form.email
    ? form.email
    : !!emailValue.value
    ? emailValue.value
    : (email as string)
  form.password = !!form.password ? form.password : passwordValue.value
  form.confirmPassword = !!form.confirmPassword
    ? form.confirmPassword
    : confirmPasswordValue.value
})

// methods
function onNext() {
  if (serverError.userName.state) return
  emits('update:modelValue', {
    userName: form.userName,
    email: form.email,
    password: form.password,
    confirmPassword: form.confirmPassword,
  })
  emits('next')
}

function onGoBack() {
  emits('update:modelValue', {
    userName: form.userName,
    email: form.email,
    password: form.password,
    confirmPassword: form.confirmPassword,
  })
  emits('preview')
}

async function onVerifyUserName() {
  if (userNameValue.value?.trim()) {
    try {
      handleToggleServerError(false)
      supportData.isLoading.userName = true

      const params: CheckUserNameRequest = {
        userName: userNameValue.value,
      }

      const data = await httpsCheckUserName(params)

      if (data?.code !== RESPONSE_CODE.SUCCESS) {
        handleToggleServerError(
          true,
          data?.message || t('general.Server validate fail')
        )
      }
    } catch (error) {
    } finally {
      supportData.isLoading.userName = false
    }
  }
}

function handleToggleServerError(state: boolean, message?: string) {
  serverError.userName.state = state

  if (message) {
    serverError.userName.message = message
  }
}
</script>
