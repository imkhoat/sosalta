<template>
  <q-card class="signup-form q-pa-sm shadow-0">
    <q-form
      ref="signupForm"
      @submit="onSignup"
      class="q-gutter-md"
    >
      <div class="column justify-center items-center q-pa-lg">
        <h3 class="text-h4 text-weight-bold q-my-none text-center">
          {{ $t('pages.auth.signup.form.Welcome to AtlasOS') }}
        </h3>
        <url-verification :allow-edit-url="true"></url-verification>
      </div>
      <q-card-section>
        <q-input
          id="user-name"
          :label="$t('pages.auth.signup.form.Username')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="form.userName"
          :rules="rules.userName"
          lazy-rules
          hide-bottom-space
          bottom-slots
          :error="serverError.userName.state"
          :error-message="serverError.userName.message"
          :loading="supportData.isLoading.userName"
          @blur="onVerifyUserName"
        ></q-input>
        <q-password-input
          id="password"
          :label="$t('pages.auth.signup.form.Password')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="form.password"
          :rules="rules.password"
          lazy-rules
          hide-bottom-space
        >
        </q-password-input>
        <q-password-input
          id="confirm-password"
          :label="$t('pages.auth.signup.form.Confirm password')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="form.confirmPassword"
          :rules="rules.confirmPassword"
          lazy-rules
          hide-bottom-space
        >
        </q-password-input>
        <q-input
          id="email"
          :label="$t('pages.auth.signup.form.Email')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="form.email"
          :rules="rules.email"
          lazy-rules
          hide-bottom-space
        ></q-input>
        <q-phone-input
          id="phone"
          :label="$t('pages.auth.signup.form.Phone number')"
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
          type="register"
          @verify-phone="onVerifyPhoneNumber"
        ></q-sms-input>
        <q-captcha-input
          ref="captchaEl"
          class="captcha"
          v-model="form.captcha"
          :rules="rules.captcha"
          lazy-rules
          hide-bottom-space
          v-model:captcha-uuid="form.captchauuid"
        ></q-captcha-input>
        <q-input
          v-if="isMemberAccountType"
          v-model="form.accessCode"
          id="invitation-code"
          :label="$t('pages.auth.signup.form.Invitation code')"
          stack-label
          outlined
          class="q-my-md"
        ></q-input>
        <q-field
          id="account-type"
          outlined
          dense
          :label="$t('pages.auth.signup.form.Account type')"
          stack-label
          class="q-my-md"
        >
          <template v-slot:control>
            <q-radio
              v-model="form.accountType"
              :val="accountTypes.MAIN"
              :label="$t('pages.auth.signup.form.Main account')"
            />
            <q-radio
              v-model="form.accountType"
              :val="accountTypes.MEMBER"
              :label="$t('pages.auth.signup.form.Member account')"
            />
          </template>
        </q-field>
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
          type="submit"
          unelevated
          :loading="supportData.isLoading.form"
          :disable="isDisableSignupButton"
          >{{ $t('pages.auth.signup.form.Create new account') }}</q-btn
        >
        <q-btn
          color="primary"
          no-caps
          class="text-subtitle1 q-pa-none height-fitcontent q-mt-md self-end"
          flat
          unelevated
          @click="onLogin"
          >{{ $t('pages.auth.signup.form.Already have an account') }}</q-btn
        >
        <q-item class="q-mt-lg q-px-none">
          <q-checkbox
            color="primary"
            v-model="form.agreeTermAndPolicy"
          />
          <q-item-section>
            <q-item-label>
              {{
                $t('pages.auth.signup.form.I have read and accept the Atlas OS')
              }}
              <a
                href="https://www.shannonbit.com/termsAndConditions"
                target="_blank"
                class="text-primary"
              >
                {{ $t(`pages.auth.signup.form.Terms and Conditions of Use`) }}
              </a>
              <a
                href="https://www.shannonbit.com/privacy"
                target="_blank"
                class="text-primary"
                >{{ $t(`pages.auth.signup.form.Privacy Policy`) }}</a
              >
              {{ $t('pages.auth.signup.form.and') }}
              <a
                href="https://www.shannonbit.com/disclaimer"
                target="_blank"
                class="text-primary"
                >{{ $t('pages.auth.signup.form.Disclaimer') }}</a
              >
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import {
  httpsRegister,
  httpsCheckUserName,
} from 'src/core/services/auth-services'
import { httpsCreateBaseFolder } from 'src/core/services/storage-services'
import {
  CheckUserNameRequest,
  RegisterRequest,
} from 'src/core/types/services/auth-types'
import { AUTH_ROUTE_NAMES } from 'src/core/router/routes'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { ACCOUNT_TYPE_OPTION } from 'src/core/types/services/account-types'
import UrlVerification from 'src/core/components/molecules/url-verification.vue'
import { QCaptchaInputElement } from 'src/core/types/q-captcha-input-element-types'

// composable
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const {
  confirmPasswordRules,
  emailRules,
  passwordRules,
  userNameRules,
  captchaRules,
  smsRules,
} = useRules()

// data
const accountTypes = ACCOUNT_TYPE_OPTION

const signupForm = ref<(HTMLElement & { validate: () => boolean }) | null>(null)

const captchaEl = ref<InstanceType<QCaptchaInputElement> | null>(null)

const supportData = reactive({
  isLoading: {
    form: false,
    userName: false,
    phone: false,
  },
})

const form = reactive({
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  captcha: '',
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
  accountType: ACCOUNT_TYPE_OPTION.MAIN,
  agreeTermAndPolicy: true,
  referenceCode: '',
  captchauuid: '',
  accessCode: '',
})

const rules = reactive({
  userName: userNameRules,
  password: passwordRules,
  confirmPassword: confirmPasswordRules(toRef(form, 'password')),
  email: emailRules,
  captcha: captchaRules,
  otp: smsRules,
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
  email: {
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

// computed
const isMemberAccountType = computed(() => {
  return form.accountType === ACCOUNT_TYPE_OPTION.MEMBER
})

const smsPhoneNumberProp = computed(() => {
  return serverError.phone.state ? '' : form.phone.phone
})

const isDisableSignupButton = computed(() => {
  return !form.agreeTermAndPolicy
})

const isActiveSendSMSButton = computed(() => {
  return form.phone.phone
})

// watch
watch(
  () => route.query,
  () => {
    const { userName, email, accessCode } = route.query
    form.accessCode = (accessCode as string) ?? form?.accessCode ?? ''
    form.userName = (userName as string) ?? form.userName
    form.email = (email as string) ?? form.email
    form.accountType = accessCode
      ? ACCOUNT_TYPE_OPTION.MEMBER
      : ACCOUNT_TYPE_OPTION.MAIN
  },
  { immediate: true }
)

// methods
function onLogin() {
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}

async function onSignup() {
  const valid: boolean | undefined = await signupForm?.value?.validate()
  if (!valid) return
  try {
    supportData.isLoading.form = true
    const params: RegisterRequest = {
      accessCode: form?.accessCode || '',
      accessCodeFlag: isMemberAccountType.value,
      captchaCode: form.captcha,
      captchauuid: form.captchauuid,
      smsCode: form.otp,
      style: 'register',
      userItem: {
        cellingCode: form.phone?.code?.region,
        confirmPassword: form.confirmPassword,
        email: form.email,
        password: form.password,
        phoneNumber: form.phone?.phone,
        userName: form.userName,
      },
    }

    const data = await httpsRegister(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: t('pages.auth.signup.form.Register account success'),
        type: 'positive',
      })
      await handleCreateBaseFolder()
    } else {
      refreshCaptcha()
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}

async function onVerifyPhoneNumber(payload: {
  valid: boolean
  message: string
}) {
  if (!payload.valid) {
    handleToggleServerError(
      'phone',
      true,
      payload.message || t('general.Server validate fail')
    )
  } else {
    handleToggleServerError('phone', false)
  }
}

async function onVerifyUserName() {
  if (form.userName?.trim()) {
    try {
      handleToggleServerError('userName', false)
      supportData.isLoading.userName = true

      const params: CheckUserNameRequest = {
        userName: form.userName,
      }

      const data = await httpsCheckUserName(params)

      if (data?.code !== RESPONSE_CODE.SUCCESS) {
        handleToggleServerError(
          'userName',
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

async function handleCreateBaseFolder() {
  const data = await httpsCreateBaseFolder(form.userName)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.dialog({
      title: 'Success',
      message: t('pages.auth.signup.form.Account is created successfully', {
        userName: form.userName,
      }),
      cancel: false,
      persistent: true,
      html: true,
      ok: 'LOGIN',
    }).onOk(onLogin)
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
