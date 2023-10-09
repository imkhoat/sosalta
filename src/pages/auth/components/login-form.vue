<template>
  <q-card class="login-form q-pa-sm q-py-lg shadow-0">
    <q-form
      ref="loginForm"
      @submit="onLogin"
      class="q-gutter-md"
    >
      <div class="column justify-center items-center q-pa-lg">
        <h3 class="text-h4 text-weight-bold q-my-none text-center">
          {{ $t('pages.auth.login.form.Welcome back') }}
        </h3>
        <url-verification :allow-edit-url="true"></url-verification>
      </div>
      <q-card-section class="q-pb-none">
        <q-input
          id="username"
          :label="$t('pages.auth.login.form.Username')"
          stack-label
          outlined
          :rules="rules.userName"
          lazy-rules
          hide-bottom-space
          class="q-mb-md"
          v-model="form.userName"
        ></q-input>
        <div
          v-if="isLoginWithUserName"
          class="column"
        >
          <q-password-input
            id="password"
            :label="$t('pages.auth.login.form.Password')"
            stack-label
            outlined
            v-model="form.password"
            :rules="rules.password"
            lazy-rules
            hide-bottom-space
          ></q-password-input>
          <q-btn
            color="primary"
            no-caps
            class="text-subtitle1 q-py-none q-px-sm height-fitcontent q-mb-md self-end"
            flat
            unelevated
            @click="onGoToForgetPassword"
            >{{ $t('pages.auth.login.form.Forget your password') }}</q-btn
          >
        </div>
        <q-phone-input
          v-if="!isLoginWithUserName"
          id="phone"
          :label="$t('pages.auth.login.form.Phone number')"
          stack-label
          v-model="form.phone"
          lazy-rules
          hide-bottom-space
          class="q-mb-md"
          bottom-slots
          :error="serverError.phone.state"
          :error-message="serverError.phone.message"
          :loading="supportData.isLoading.phone"
        ></q-phone-input>
        <q-sms-input
          v-if="!isLoginWithUserName"
          v-model="form.otp"
          :phone="smsPhoneNumberProp"
          :region="form.phone?.code?.region"
          :user-name="form.userName"
          :rules="rules.otp"
          :disable="!isActiveSendSMSButton"
          :phone-validate="true"
          lazy-rules
          hide-bottom-space
          class="sms q-mb-md"
          type="login"
          @verify-phone="onVerifyPhoneNumber"
        ></q-sms-input>
        <q-captcha-input
          class="captcha"
          ref="captchaEl"
          v-model="form.captcha"
          :rules="rules.captcha"
          lazy-rules
          hide-bottom-space
          v-model:captcha-uuid="form.captchauuid"
        ></q-captcha-input>
        <q-checkbox
          v-model="form.rememberMe"
          color="primary"
          :label="$t('pages.auth.login.form.Remember me')"
          class="-q-ml-sm"
          @update:model-value="onChangeRememberMe"
        />
      </q-card-section>
      <q-card-actions
        vertical
        align="center"
        class="q-px-md"
      >
        <q-btn
          color="primary"
          size="lg"
          no-caps
          class="full-width"
          unelevated
          type="submit"
          :loading="supportData.isLoading.form"
          >{{ loginButtonLabel }}</q-btn
        >
        <q-btn
          color="primary"
          no-caps
          class="text-subtitle1 q-pa-none height-fitcontent q-mt-sm self-end"
          flat
          unelevated
          @click="onGoToSignupPage"
          >{{ $t('pages.auth.login.form.New to AtlasOS') }}</q-btn
        >
        <q-btn
          color="primary"
          no-caps
          flat
          class="text-subtitle1 q-pa-none height-fitcontent q-mt-sm self-end"
          unelevated
          @click="onChangeLoginType"
          >{{ changeLoginTypeButtonLabel }}</q-btn
        >
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/core/stores/auth'
import useRules from 'src/core/composables/use-rules'
import {
  FILE_SYSTEM_ROUTE_NAMES,
  AUTH_ROUTE_NAMES,
} from 'src/core/router/routes'
import {
  LoginRequest,
  LOGIN_OPTION,
  LOGIN_TYPE,
} from 'src/core/types/services/auth-types'
import { httpsLogin } from 'src/core/services/auth-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import UrlVerification from 'src/core/components/molecules/url-verification.vue'
import { QCaptchaInputElement } from 'src/core/types/q-captcha-input-element-types'

// composables
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { saveLoggedinAuthData } = useAuthStore()
const { passwordRules, userNameRules, captchaRules, smsRules } = useRules()

// data
const loginForm = ref<(HTMLElement & { validate: () => boolean }) | null>(null)

const captchaEl = ref<InstanceType<QCaptchaInputElement> | null>(null)

const form = reactive({
  userName: '',
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
  otp: '',
  type: LOGIN_OPTION.USERNAME,
  rememberMe: true,
})

const supportData = reactive({
  isLoading: {
    form: false,
    userName: false,
    phone: false,
  },
})

const serverError = reactive({
  userName: {
    state: false,
    message: '',
  },
  phone: {
    state: false,
    message: '',
  },
  captcha: {
    state: false,
    message: '',
  },
  otp: {
    state: false,
    message: '',
  },
})

const rules = reactive({
  userName: userNameRules,
  password: passwordRules,
  captcha: captchaRules,
  otp: smsRules,
})

// computed
const isLoginWithUserName = computed(() => {
  return form.type === LOGIN_OPTION.USERNAME
})

const smsPhoneNumberProp = computed(() => {
  return serverError.phone.state ? '' : form.phone.phone
})

const loginButtonLabel = computed(() => {
  return isLoginWithUserName.value
    ? t('pages.auth.login.form.Login with username')
    : t('pages.auth.login.form.Login with your phone')
})

const changeLoginTypeButtonLabel = computed(() => {
  return isLoginWithUserName.value
    ? t('pages.auth.login.form.Login with your phone')
    : t('pages.auth.login.form.Login with username')
})

const isActiveSendSMSButton = computed(() => {
  return form.phone.phone
})

// methods
function onLogin() {
  const valid: boolean | undefined = loginForm?.value?.validate()
  if (!valid) return
  let params: LoginRequest
  if (isLoginWithUserName.value) {
    params = {
      captchaCode: form.captcha,
      captchauuid: form.captchauuid,
      loginStyle: 'userNameLogin',
      userItem: {
        password: form.password,
        userName: form.userName,
      },
    }
  } else {
    params = {
      captchaCode: form.captcha,
      captchauuid: form.captchauuid,
      loginStyle: 'phoneNumberLogin',
      smsCodeItem: {
        userName: form.userName,
        cellingCode: form.phone.code.region,
        phoneNumber: form.phone.phone,
        sms: form.otp,
        type: 'login',
      },
    }
  }
  handleLogin(params)
}

function onChangeLoginType() {
  if (isLoginWithUserName.value) {
    changeLoginType(LOGIN_OPTION.PHONE)
  } else {
    changeLoginType(LOGIN_OPTION.USERNAME)
  }
}

function onVerifyPhoneNumber(payload: { valid: boolean; message: string }) {
  handleToggleServerError('phone', !payload.valid, payload?.message)
}

function onGoToForgetPassword() {
  router.push({ name: AUTH_ROUTE_NAMES.FORGOT_PASSWORD })
}

function onGoToSignupPage() {
  router.push({ name: AUTH_ROUTE_NAMES.SIGNUP })
}

function onChangeRememberMe() {
  console.log('onRememberMe')
}

async function handleLogin(params: LoginRequest) {
  try {
    supportData.isLoading.form = true
    const data = await httpsLogin(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      const { bucketName, region, userInfo, userMenus } = data?.data
      saveLoggedinAuthData({
        authentication: true,
        bucketName,
        region,
        userInfo,
        userMenus,
      })
      if (route.query?.redirect) {
        router.push({ path: route.query?.redirect?.toString() })
      } else {
        router.push({ name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES })
      }
    } else {
      refreshCaptcha()
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}

function handleToggleServerError(
  control: 'userName' | 'phone',
  state: boolean,
  message?: string
) {
  serverError[control].state = state

  if (message) {
    serverError[control].message = message
  }
}

function changeLoginType(type: LOGIN_TYPE) {
  form.type = type
}

function refreshCaptcha() {
  captchaEl?.value?.refresh()
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
