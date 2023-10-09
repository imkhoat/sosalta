<template>
  <q-card class="verify-phone shadow-0">
    <q-form
      ref="verifyPhoneEl"
      @submit="onNext"
    >
      <q-card-section>
        <div class="column">
          <q-phone-input
            :label="$t('pages.auth.forgotPassword.form.Phone number')"
            stack-label
            v-model="phoneValue"
            disable
            lazy-rules
            hide-bottom-space
            class="q-mb-md"
            bottom-slots
          ></q-phone-input>
          <q-sms-input
            v-model="form.otp"
            :phone="phoneProp?.phone"
            :region="phoneProp?.code?.region"
            :user-name="userNameProp"
            :rules="rules.otp"
            :phone-validate="true"
            lazy-rules
            hide-bottom-space
            class="sms"
            type="findPassword"
          ></q-sms-input>
        </div>
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
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { reactive, computed, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsFindPasswordByPhone } from 'src/core/services/auth-services'
import { FindPasswordByPhoneRequest } from 'src/core/types/services/auth-types'

// props/emits
const props = defineProps(['modelValue', 'phoneProp', 'userNameProp'])
const emits = defineEmits(['next', 'preview', 'update:modelValue'])

// composables
const { t } = useI18n()
const $q = useQuasar()
const { smsRules } = useRules()

// computed
const phoneValue = computed(() => {
  return props.phoneProp
})

// data
const verifyPhoneEl = ref<(HTMLElement & { validate: () => boolean }) | null>(
  null
)
const form = reactive({
  otp: '',
})

const rules = reactive({
  otp: smsRules,
})

const supportData = reactive({
  isLoading: {
    form: false,
  },
})

// method
function onGoBack() {
  emits('preview')
}

async function onNext() {
  const valid: boolean | undefined = await verifyPhoneEl?.value?.validate()
  if (!valid) return
  try {
    supportData.isLoading.form = true
    const params: FindPasswordByPhoneRequest = {
      sms: form.otp,
      phoneNumber: props.phoneProp.phone,
      userName: props.userNameProp,
      type: 'findPassword',
      cellingCode: props.phoneProp.code.region,
    }

    const data = await httpsFindPasswordByPhone(params)

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      $q.notify({
        message: t(
          'pages.auth.forgotPassword.form.Find password by phone successfully'
        ),
        type: 'positive',
      })
      emits('update:modelValue', {
        code: data.data.code,
        key: data.data.key,
        phoneEmail: data.data.phoneEmail,
        userName: data.data.userName,
      })
      emits('next')
    }
  } catch (error) {
  } finally {
    supportData.isLoading.form = false
  }
}
</script>
<style lang="scss"></style>
