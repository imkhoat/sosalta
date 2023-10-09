<template>
  <q-card class="select-accout-type shadow-0">
    <q-card-section class="q-pa-none">
      <span class="q-mb-md">{{
        $t('pages.auth.signup.stepForm.Which type do you want to create')
      }}</span>
      <q-field
        id="account-type"
        outlined
        dense
        :label="$t('pages.auth.signup.stepForm.Account type')"
        stack-label
        class="q-my-md"
      >
        <template v-slot:control>
          <q-radio
            v-model="accountType"
            :val="accountTypes.MAIN"
            :label="$t('pages.auth.signup.stepForm.Main account')"
          />
          <q-radio
            v-model="accountType"
            :val="accountTypes.MEMBER"
            :label="$t('pages.auth.signup.stepForm.Member account')"
          />
        </template>
      </q-field>
      <q-input
        v-if="isMemberAccountType"
        id="invitation-code"
        :label="$t('pages.auth.signup.stepForm.Invitation code')"
        stack-label
        outlined
        class="q-mb-md"
        v-model="accessCodeValue"
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
        @click="onGoToLogin"
      >
        {{ $t('pages.auth.signup.stepForm.Login') }}
      </q-btn>
      <q-btn
        color="primary"
        size="lg"
        no-caps
        class="width-half"
        unelevated
        @click="onNext"
      >
        {{ $t('pages.auth.signup.stepForm.Next') }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, watchEffect, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AUTH_ROUTE_NAMES } from 'src/core/router/routes'
import { ACCOUNT_TYPE_OPTION } from 'src/core/types/services/account-types'

// props/emits
const props = defineProps(['modelValue'])
const emits = defineEmits(['next', 'update:modelValue'])

// composables
const accountTypes = ACCOUNT_TYPE_OPTION
const router = useRouter()
const route = useRoute()

// computed
const accountType = computed({
  get() {
    return form.accountType || props.modelValue.accountType
  },
  set(value) {
    form.accountType = value
  },
})

const accessCodeValue = computed({
  get() {
    return form.accessCode || props.modelValue.accessCode
  },
  set(value) {
    form.accessCode = value
  },
})

const isMemberAccountType = computed(() => {
  return accountType.value === ACCOUNT_TYPE_OPTION.MEMBER
})

// data
const form = reactive({
  accessCode: '',
  accountType: '',
})

// hook
watchEffect(() => {
  const { accessCode } = route.query
  form.accessCode = accessCodeValue.value
    ? accessCodeValue.value
    : (accessCode as string) ?? ''

  form.accountType = form.accountType
    ? form.accountType
    : accountType.value
    ? accountType.value
    : accessCode
    ? ACCOUNT_TYPE_OPTION.MEMBER
    : ACCOUNT_TYPE_OPTION.MAIN
})

// methods
function onGoToLogin() {
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}

function onNext() {
  emits('update:modelValue', {
    accountType: form.accountType,
    accessCode: form.accessCode,
  })
  emits('next')
}
</script>
