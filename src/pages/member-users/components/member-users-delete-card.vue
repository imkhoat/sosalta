<template>
  <q-card class="member-users-delete-card">
    <q-card-section>
      <q-section-header title="Delete member user"></q-section-header>
    </q-card-section>
    <q-card-section class="q-px-lg">
      <p class="text-body2">
        You are in the process of deleting
        <strong class="text-negative">{{ user?.userName }}</strong> member
        account. Once confirmed, deleted accounts cannot be restored.
        <br />
      </p>
      <p class="text-disable">
        We will contact you for any unpaid bills and/or remaining balance for
        refund once your account is closed. For this matter, please leave your
        contact person's name and e-mail address below:
      </p>
    </q-card-section>
    <q-card-section
      class="q-px-lg bg-grey-1 column justify-start items-stretch q-gutter-y-md"
    >
      <div class="block-form row">
        <div class="text-subtitle2 col-12">Password verification</div>
        <div class="q-mb-md col-12">
          <q-password-input
            id="email-section__password"
            label="Main account password"
            stack-label
            outlined
            lazy-rules
            dense
            hide-bottom-space
            v-model="form.password"
          ></q-password-input>
        </div>
      </div>
      <div class="block-form row">
        <div class="text-subtitle2 col-12">
          {{ $t('pages.account.otherSettings.Verification code') }}
        </div>
        <div class="text-caption text-disable q-mb-sm">
          {{ smsSendingNotificationContent }}
        </div>
        <div class="q-mb-md col-12">
          <q-sms-input
            id="verification-code"
            stack-label
            outlined
            lazy-rules
            dense
            type="deleteUser"
            hide-bottom-space
            v-model="form.smsCode"
            :phone="currentPhoneNumber"
            :region="currentCellingCode"
            :user-name="currentUserName"
            @sending="onSendSMS"
          ></q-sms-input>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-px-lg">
      <q-alert
        type="warning"
        class="q-mb-sm"
        >Delete a member user account will delete everything stored inside this
        member user account, e.g., files, Machine Images, and logs.</q-alert
      >
      <q-alert type="info"
        >if there are launch Cloud PC instances or Cloud App tasks inside a
        member user account, please shutdown or terminate these launch Cloud
        PC/App tasks first, and then delete the member user account.</q-alert
      >
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { UserInfo } from 'src/core/types/user-info'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  deleteType: 'DELETE_MODAL' | 'DELETE_ACTIVE_MODAL'
  user?: UserInfo | null
}>()

// composables
const { t } = useI18n()
const { getUserName, getUserInformation } = storeToRefs(useAuthStore())
const { handleDeleteUser, loading } = useMemberSettings()

// data
const form = reactive({
  password: '',
  smsCode: '',
})

// computed

const currentUserName = computed(() => {
  return getUserName.value || ''
})

const currentPhoneNumber = computed(() => {
  return getUserInformation.value?.phoneNumber || ''
})

const currentCellingCode = computed(() => {
  return getUserInformation.value?.cellingCode || ''
})

const currentEmail = computed(() => {
  return getUserInformation.value?.email || ''
})

const isActiveSendSMSButton = computed(() => {
  return form.password
})

const smsSendingNotificationContent = computed(() => {
  const smsPhoneNumber = `********${currentPhoneNumber.value.substring(
    currentPhoneNumber.value.length - 4,
    currentPhoneNumber.value.length
  )}`
  return t('pages.account.otherSettings.A message will be sent to', {
    phone: smsPhoneNumber,
  })
})

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Confirm'),
      action: onDeleteObject,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}
async function onDeleteObject() {
  try {
    const deleteResult = await handleDeleteUser(
      currentEmail.value,
      form.password,
      form.smsCode,
      currentUserName.value,
      props.user?.userName
    )
    if (deleteResult) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.member-users-delete-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
