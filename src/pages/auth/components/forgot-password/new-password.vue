<template>
  <q-card class="new-password shadow-0">
    <q-form @submit="onNext">
      <q-card-section>
        <q-input
          id="password"
          :type="supportData.hasShowPassword.password ? 'text' : 'password'"
          :label="$t('pages.auth.forgotPassword.form.New password')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="form.password"
          :rules="rules.password"
          lazy-rules
          hide-bottom-space
        >
          <template v-slot:append>
            <q-icon
              :name="
                supportData.hasShowPassword.password
                  ? 'visibility_off'
                  : 'visibility'
              "
              class="cursor-pointer"
              @click="
                supportData.hasShowPassword.password =
                  !supportData.hasShowPassword.password
              "
            />
          </template>
        </q-input>
        <q-input
          id="confirm-password"
          :type="
            supportData.hasShowPassword.confirmPassword ? 'text' : 'password'
          "
          :label="$t('pages.auth.forgotPassword.form.Confirm password')"
          stack-label
          outlined
          class="q-mb-md"
          v-model="form.confirmPassword"
          :rules="rules.confirmPassword"
          lazy-rules
          hide-bottom-space
        >
          <template v-slot:append>
            <q-icon
              :name="
                supportData.hasShowPassword.confirmPassword
                  ? 'visibility_off'
                  : 'visibility'
              "
              class="cursor-pointer"
              @click="
                supportData.hasShowPassword.confirmPassword =
                  !supportData.hasShowPassword.confirmPassword
              "
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions
        align="center"
        class="q-px-md row no-wrap"
      >
        <q-btn
          color="primary"
          size="lg"
          no-caps
          class="width-half bg-grey-1"
          unelevated
          flat
          @click="onGoBack"
        >
          {{ $t('pages.auth.forgotPassword.form.Back') }}
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
          {{ $t('pages.auth.forgotPassword.form.Next') }}
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script setup lang="ts">
import { reactive, toRef } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import {
  httpsCheckingEmailExpire,
  httpsResetPassword,
} from 'src/core/services/auth-services'
import {
  EmailExpiredRequest,
  ResetPasswordRequest,
} from 'src/core/types/services/auth-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'

// props/emits
const prop = defineProps(['userMsg'])
const emits = defineEmits(['next', 'preview'])

// composables
const $q = useQuasar()
const route = useRoute()
const { t } = useI18n()
const { confirmPasswordRules, passwordRules } = useRules()

// data
const form = reactive({
  password: '',
  confirmPassword: '',
})

const rules = reactive({
  password: passwordRules,
  confirmPassword: confirmPasswordRules(toRef(form, 'password')),
})

const supportData = reactive({
  isLoading: {
    form: false,
  },
  hasShowPassword: {
    password: false,
    confirmPassword: false,
  },
})

// method
function onGoBack() {
  emits('preview')
}

async function onNext() {
  const { accessCode } = route.query
  accessCode ? ResetPasswordByEmail() : ResetPasswordByPhone()
}

async function ResetPasswordByPhone() {
  supportData.isLoading.form = true
  try {
    let params: ResetPasswordRequest = {
      userName: prop.userMsg.userName,
      phoneEmail: prop.userMsg.phoneEmail,
      password: form.password,
      key: prop.userMsg.key,
      code: prop.userMsg.code,
    }

    const data = await httpsResetPassword(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: t('pages.auth.forgotPassword.form.Reset password success'),
        type: 'positive',
      })
      emits('next')
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}

async function ResetPasswordByEmail() {
  supportData.isLoading.form = true
  try {
    const { userName, email, accessCode, event } = route.query
    const expireParams: EmailExpiredRequest = {
      accessCode: accessCode as string,
      email: email as string,
      event: event as string,
      userName: userName as string,
    }

    const expireData = await httpsCheckingEmailExpire(expireParams)

    if (expireData?.code === RESPONSE_CODE.SUCCESS) {
      const params: ResetPasswordRequest = {
        userName: expireData.data.userName,
        phoneEmail: expireData.data.phoneEmail,
        code: expireData.data.code,
        key: expireData.data.key,
        password: form.password,
      }

      const data = await httpsResetPassword(params)

      if (data?.code === RESPONSE_CODE.SUCCESS) {
        $q.notify({
          message: t('pages.auth.forgotPassword.form.Reset password success'),
          type: 'positive',
        })
        emits('next')
      }
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}
</script>
