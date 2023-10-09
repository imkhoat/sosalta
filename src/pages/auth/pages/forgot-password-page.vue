<template>
  <q-page class="forgot-password-page row items-stretch justify-center">
    <div
      class="col-xs-12 col-sm-8 col-md-8 col-lg-7 col-xl-6 q-pa-xs-none q-pa-sm-none"
    >
      <q-card class="signup-form q-pa-sm shadow-0">
        <div class="column justify-center items-center q-pa-lg">
          <h3 class="text-h4 text-weight-bold q-my-none text-center">
            {{
              $t(
                'pages.auth.forgotPassword.form.Follow steps to change password'
              )
            }}
          </h3>
          <url-verification></url-verification>
        </div>
        <q-card-section class="q-pa-none">
          <q-stepper
            ref="stepper"
            v-model="currentStep"
            :contracted="$q.screen.lt.md"
            color="primary"
            animated
            class="shadow-0"
          >
            <q-step
              :name="STEPS.VERIFY_ACCOUNT"
              :title="
                $t('pages.auth.forgotPassword.form.Verifying registed account')
              "
              icon="r_admin_panel_settings"
              :done="currentStep > STEPS.VERIFY_ACCOUNT"
            >
              <verify-account
                class="step-card"
                v-model="form.info"
                @next="onNextStep"
              ></verify-account>
            </q-step>

            <q-step
              :name="STEPS.VERIFY_PHONE"
              :title="$t('pages.auth.forgotPassword.form.Verification Code')"
              icon="r_pin"
              :done="currentStep > STEPS.VERIFY_PHONE"
            >
              <verify-phone
                v-if="resetType === LOGIN_OPTION.PHONE"
                v-model="form.userMsg"
                :phoneProp="form.info.phone"
                :userNameProp="form.info.userName"
                class="step-card"
                @next="onNextStep"
                @preview="onPreviewStep"
              ></verify-phone>
              <email-sended v-else></email-sended>
            </q-step>

            <q-step
              :name="STEPS.NEW_PASSWORD"
              :title="$t('pages.auth.forgotPassword.form.Reset password')"
              icon="r_password"
              :done="currentStep > STEPS.NEW_PASSWORD"
            >
              <new-password
                class="step-card"
                :userMsg="form.userMsg"
                @next="onNextStep"
                @preview="onPreviewStep"
              ></new-password>
            </q-step>

            <q-step
              :name="STEPS.RESET_COMPLETED"
              :title="$t('pages.auth.forgotPassword.form.Finish')"
              icon="r_verified"
              :done="currentStep === STEPS.RESET_COMPLETED"
            >
              <reset-completed class="step-card"></reset-completed>
            </q-step>
          </q-stepper>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { LOGIN_OPTION, LOGIN_TYPE } from 'src/core/types/services/auth-types'
import VerifyAccount from 'pages/auth/components/forgot-password/verify-account.vue'
import VerifyPhone from 'pages/auth/components/forgot-password/verify-phone.vue'
import NewPassword from 'pages/auth/components/forgot-password/new-password.vue'
import ResetCompleted from 'pages/auth/components/forgot-password/reset-completed.vue'
import EmailSended from 'pages/auth/components/forgot-password/email-sended.vue'
import UrlVerification from 'src/core/components/molecules/url-verification.vue'

// composables
const route = useRoute()

// data
const STEPS = {
  VERIFY_ACCOUNT: 1,
  VERIFY_PHONE: 2,
  NEW_PASSWORD: 3,
  RESET_COMPLETED: 4,
}
const currentStep = ref(STEPS.VERIFY_ACCOUNT)
const resetType = ref<LOGIN_TYPE | null>(null)
const form = reactive({
  info: {
    userName: '',
    email: '',
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
  },
  userMsg: {
    code: '',
    key: '',
    phoneEmail: '',
    userName: '',
  },
})

// watch
watchEffect(() => {
  const { accessCode } = route.query
  currentStep.value = accessCode ? STEPS.NEW_PASSWORD : STEPS.VERIFY_ACCOUNT
})

// method
function onNextStep(type: LOGIN_TYPE) {
  resetType.value = type ?? resetType.value
  currentStep.value++
}
function onPreviewStep() {
  currentStep.value--
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

.verify-email {
  font-size: 18px;
}
</style>
