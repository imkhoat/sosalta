<template>
  <q-page class="signup-by-step-page row items-stretch justify-center">
    <div
      class="col-xs-12 col-sm-8 col-md-7 col-lg-6 col-xl-5 q-pa-xs-none q-pa-sm-none"
    >
      <div
        class="row justify-center"
        :class="$q.screen.lt.sm ? 'visible' : 'hidden'"
      >
        <q-img
          class="logo self-center"
          src="~/assets/common/background.png"
        >
        </q-img>
      </div>
      <q-card class="signup-form q-pa-sm shadow-0">
        <div class="column justify-center items-center q-pa-lg">
          <h3 class="text-h4 text-weight-bold q-my-none text-center">
            {{ $t('pages.auth.signup.form.Welcome to AtlasOS') }}
          </h3>
          <url-verification></url-verification>
        </div>
        <q-card-section>
          <q-stepper
            ref="stepper"
            v-model="currentStep"
            :contracted="$q.screen.lt.md"
            color="primary"
            animated
            class="shadow-0"
          >
            <q-step
              :name="STEPS.ACCOUNT_TYPE"
              :title="$t('pages.auth.signup.stepForm.Account type step title')"
              icon="r_account_circle"
              :done="currentStep > STEPS.ACCOUNT_TYPE"
            >
              <select-account-type-step
                v-model="form.account"
                class="step-card"
                @next="onNextStep()"
              ></select-account-type-step>
            </q-step>

            <q-step
              :name="STEPS.USER_INFOR"
              :title="$t('pages.auth.signup.stepForm.User infor step title')"
              icon="r_password"
              :done="currentStep > STEPS.USER_INFOR"
            >
              <user-infor-step
                v-model="form.user"
                class="step-card"
                @next="onNextStep()"
                @preview="onPreviewStep"
              ></user-infor-step>
            </q-step>

            <q-step
              :name="STEPS.VERIFY_PHONE"
              :title="
                $t('pages.auth.signup.stepForm.Verify phone number step title')
              "
              icon="r_pin"
              :done="currentStep > STEPS.VERIFY_PHONE"
            >
              <verify-phone-step
                v-model="form.phone"
                :userName="form.user.userName"
                class="step-card"
                @next="onNextStep()"
                @preview="onPreviewStep"
              ></verify-phone-step>
            </q-step>

            <q-step
              :name="STEPS.CREATE_ACCOUNT"
              :title="$t('pages.auth.signup.stepForm.Finish step title')"
              icon="r_verified"
              :done="currentStep === STEPS.CREATE_ACCOUNT"
            >
              <verify-captcha-step
                ref="verifyCaptchaStepEl"
                class="step-card"
                v-model="form.register"
                @preview="onPreviewStep"
                @signup="onSignup"
              ></verify-captcha-step>
            </q-step>
          </q-stepper>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { httpsRegister } from 'src/core/services/auth-services'
import { httpsCreateBaseFolder } from 'src/core/services/storage-services'
import { AUTH_ROUTE_NAMES } from 'src/core/router/routes'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { RegisterRequest } from 'src/core/types/services/auth-types'
import { ACCOUNT_TYPE_OPTION } from 'src/core/types/services/account-types'
import UrlVerification from 'src/core/components/molecules/url-verification.vue'
import UserInforStep from 'src/pages/auth/components/signup-step/user-infor-step.vue'
import VerifyPhoneStep from 'src/pages/auth/components/signup-step/verify-phone-step.vue'
import VerifyCaptchaStep from 'pages/auth/components/signup-step/verify-captcha-step.vue'
import SelectAccountTypeStep from 'src/pages/auth/components/signup-step/select-account-type-step.vue'

// composable
const $q = useQuasar()
const router = useRouter()

//data
const STEPS = {
  ACCOUNT_TYPE: 1,
  USER_INFOR: 2,
  VERIFY_PHONE: 3,
  CREATE_ACCOUNT: 4,
}
const currentStep = ref(STEPS.ACCOUNT_TYPE)
const verifyCaptchaStepEl = ref<InstanceType<typeof VerifyCaptchaStep> | null>(
  null
)
const form = reactive({
  user: {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  phone: {
    code: {
      chineseName: '美国',
      country: 'United States of America',
      region: '+1',
      shortName: 'US',
      showName: '+1(United States of America)',
    },
    phone: '',
    otp: '',
  },
  account: {
    accountType: '',
    accessCode: '',
  },
  register: {
    captcha: '',
    captchauuid: '',
    agreeTermAndPolicy: true,
  },
})
const supportState = reactive({
  isLoading: false,
})

// computed
const isMemberAccountType = computed(() => {
  return form.account.accountType === ACCOUNT_TYPE_OPTION.MEMBER
})

// method
function onNextStep() {
  currentStep.value++
}

function onPreviewStep() {
  currentStep.value--
}

function onLogin() {
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}

async function onSignup() {
  try {
    supportState.isLoading = true
    const params: RegisterRequest = {
      accessCode: form?.account.accessCode || '',
      accessCodeFlag: isMemberAccountType.value,
      captchaCode: form.register.captcha,
      captchauuid: form.register.captchauuid,
      smsCode: form.phone.otp,
      style: 'register',
      userItem: {
        cellingCode: form.phone?.code?.region,
        confirmPassword: form.user.confirmPassword,
        email: form.user.email,
        password: form.user.password,
        phoneNumber: form.phone?.phone,
        userName: form.user.userName,
      },
    }

    const data = await httpsRegister(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: 'Register account success!',
        type: 'positive',
      })
      await handleCreateBaseFolder()
    } else {
      refreshCaptcha()
    }
  } catch (error) {
  } finally {
    supportState.isLoading = false
  }
}

async function handleCreateBaseFolder() {
  const data = await httpsCreateBaseFolder(form.user.userName)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    $q.dialog({
      title: 'Success',
      message: `Account ${form.user.userName} is created successfully. <br/> Please login your account`,
      cancel: false,
      html: true,
      persistent: true,
      ok: 'LOGIN',
    }).onOk(onLogin)
  }
}

function refreshCaptcha() {
  form.register.captcha = ''
  verifyCaptchaStepEl?.value?.refreshCaptcha()
}
</script>

<style>
.step-card {
  max-width: 450px;
  min-width: 300px;
  width: 100%;
  margin: 0 auto;
}

.q-stepper--horizontal {
  width: 100%;
}

.q-stepper--horizontal .q-stepper__step-inner {
  padding: 16px;
}

.logo {
  width: 100px;
}
</style>
