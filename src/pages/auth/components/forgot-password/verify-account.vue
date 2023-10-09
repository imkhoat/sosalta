<template>
  <q-card class="verify-account shadow-0">
    <q-form
      ref="verifyAccountEl"
      @submit="onNext"
    >
      <q-card-section>
        <q-input
          id="username"
          ref="userNameEl"
          :label="$t('pages.auth.forgotPassword.form.Username')"
          stack-label
          outlined
          :rules="rules.userName"
          lazy-rules
          hide-bottom-space
          class="q-mb-md"
          v-model="form.userName"
        >
        </q-input>
        <q-input
          v-if="isResetWithEmail"
          id="email"
          v-model="form.email"
          :label="$t('pages.auth.forgotPassword.form.Email')"
          stack-label
          outlined
          :rules="rules.email"
          class="q-mb-md"
        >
        </q-input>
        <div
          v-else
          class="column"
        >
          <q-phone-input
            id="phone"
            :label="$t('pages.auth.forgotPassword.form.Phone number')"
            stack-label
            v-model="form.phone"
            lazy-rules
            hide-bottom-space
            class="q-mb-md"
            bottom-slots
          ></q-phone-input>
          <q-captcha-input
            class="captcha"
            ref="captchaEl"
            v-model="form.captcha"
            :rules="rules.captcha"
            lazy-rules
            hide-bottom-space
            v-model:captcha-uuid="form.captchauuid"
          ></q-captcha-input>
        </div>
      </q-card-section>
      <q-card-actions
        vertical
        align="right"
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
        >
          {{ $t('pages.auth.forgotPassword.form.Next') }}
        </q-btn>
        <q-btn
          color="primary"
          no-caps
          class="text-subtitle1 q-pa-none height-fitcontent q-mt-md self-end"
          flat
          unelevated
          @click="onChangeResetType"
        >
          {{
            isResetWithEmail
              ? $t('pages.auth.forgotPassword.form.Reset password by phone')
              : $t('pages.auth.forgotPassword.form.Reset password by e-mail')
          }}
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import useRules from 'src/core/composables/use-rules'
import { computed, reactive, ref, watchEffect } from 'vue'
import {
  httpsCheckPhoneNumber,
  httpsFindPasswordByEmail,
} from 'src/core/services/auth-services'
import {
  FindPasswordByEmailRequest,
  CheckPhoneNumberRequest,
  LOGIN_OPTION,
} from 'src/core/types/services/auth-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { QCaptchaInputElement } from 'src/core/types/q-captcha-input-element-types'

// props/emits
const prop = defineProps(['modelValue'])
const emits = defineEmits(['next', 'update:modelValue'])

// composables
const { t } = useI18n()
const $q = useQuasar()
const { userNameRules, emailRules, captchaRules } = useRules()

// data
const userNameEl = ref<
  (HTMLElement & { focus: () => void } & { select: () => void }) | null
>(null)
const verifyAccountEl = ref<(HTMLElement & { validate: () => boolean }) | null>(
  null
)
const captchaEl = ref<InstanceType<QCaptchaInputElement> | null>(null)

const form = reactive({
  userName: '',
  email: '',
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
  type: LOGIN_OPTION.PHONE,
})

const rules = reactive({
  userName: userNameRules,
  email: emailRules,
  captcha: captchaRules,
})

const supportData = reactive({
  isLoading: {
    form: false,
  },
})

// computed
const isResetWithEmail = computed(() => {
  return form.type === LOGIN_OPTION.EMAIL
})

// watch
watchEffect(() => {
  form.userName = !!form.userName ? form.userName : prop.modelValue?.userName
  form.email = !!form.email ? form.email : prop.modelValue?.email
  if (form.phone.phone || prop.modelValue?.phone.phone) {
    form.phone =
      !form.phone.phone && prop.modelValue?.phone
        ? prop.modelValue?.phone
        : form.phone
  }
})

// method
async function _onResetWithEmail() {
  try {
    supportData.isLoading.form = true
    const params: FindPasswordByEmailRequest = {
      emails: [form.email],
      userName: form.userName,
      event: 'findPassword',
    }

    const data = await httpsFindPasswordByEmail(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: t(
          'pages.auth.forgotPassword.Find password by email successfully'
        ),
        type: 'positive',
      })
      emits('next', LOGIN_OPTION.EMAIL)
    } else {
      refreshCaptcha()
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}

async function _onResetWithPhone() {
  try {
    supportData.isLoading.form = true
    const params: CheckPhoneNumberRequest = {
      style: 'findPassword',
      phoneNumber: form.phone.phone,
      cellingCode: form.phone.code.region,
      userName: form.userName,
      captchaCode: form.captcha,
      captchauuid: form.captchauuid,
    }

    const data = await httpsCheckPhoneNumber(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: 'Check phone number successfull.',
        type: 'positive',
      })
      emits('update:modelValue', {
        userName: form.userName,
        email: form.email,
        phone: form.phone,
      })
      emits('next', LOGIN_OPTION.PHONE)
    } else {
      refreshCaptcha()
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}

function onChangeResetType() {
  userNameEl.value?.focus()
  userNameEl.value?.select()
  if (form.type === LOGIN_OPTION.EMAIL) {
    form.type = LOGIN_OPTION.PHONE
    return
  }
  form.type = LOGIN_OPTION.EMAIL
}

async function onNext() {
  const valid: boolean | undefined = await verifyAccountEl?.value?.validate()
  if (!valid) return
  isResetWithEmail.value ? _onResetWithEmail() : _onResetWithPhone()
}

function refreshCaptcha() {
  captchaEl?.value?.refresh()
}
</script>
