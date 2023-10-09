<template>
  <q-card class="member-users-new-user-card">
    <q-card-section>
      <q-section-header
        title="Create new member user"
        sub-title="We will send a register link to input emails"
      ></q-section-header>
    </q-card-section>
    <q-card-section
      class="row justify-start items-center no-wrap q-gutter-x-sm"
    >
      <q-input
        id="member-email"
        label="Member email"
        stack-label
        outlined
        dense
        lazy-rules
        hide-bottom-space
        v-bind="$attrs"
        v-model="form.email"
        class="col-grow"
        @keydown.enter.prevent="onAddNewEmail"
      ></q-input>
      <q-btn
        unelevated
        color="grey-1"
        text-color="primary"
        :disable="!isAvailableSlots"
        @click="onAddNewEmail"
        >{{ $t('textActions.Add') }}</q-btn
      >
    </q-card-section>
    <q-card-section v-if="[...emails.values()].length > 0">
      <q-list
        bordered
        separator
        class="rounded-borders"
      >
        <q-item
          v-for="(email, index) in emails.values()"
          clickable
          v-ripple
          :key="index + '__member-users-new-user-card'"
          @click="onSelectEmail(email)"
        >
          <div class="row justify-start items-center no-wrap full-width">
            <div class="col-2">
              <q-avatar
                size="30px"
                color="grey-1"
              >
                <q-avatar
                  size="20px"
                  color="grey-3"
                >
                  <q-icon name="sym_o_email"></q-icon>
                </q-avatar>
              </q-avatar>
            </div>
            <div class="col-8 overflow-hidden">{{ email }}</div>
            <q-btn
              class="col-2"
              size="sm"
              flat
              round
              rounded
              @click="onRemoveEmail(email)"
            >
              <q-icon name="sym_o_delete"></q-icon>
            </q-btn>
          </div>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { useMemberSettings } from '../hooks/use-member-settings'
import { useAuthStore } from 'src/core/stores/auth'
import { useQuasar } from 'quasar'

// props & emits
const emits = defineEmits(['close', 'created', 'refresh'])

// composables
const $q = useQuasar()
const { t } = useI18n()
const {
  handleCreateNewMember,
  handleCheckEmailLimit,
  handleGetRegisterLimit,
  loading,
} = useMemberSettings()
const { getUserName } = storeToRefs(useAuthStore())

// data
const form = reactive({
  email: '',
})

const emails = reactive<Map<string, string>>(new Map())
const registerLimit = ref(0)

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Send invitations'),
      action: onCreateNewMembers,
      loading: loading.value,
    },
  ]
})

const isAvailableSlots = computed(() => {
  return registerLimit.value - [...emails.values()].length > 0
})
// methods
function onClose() {
  emits('close')
}

async function onCreateNewMembers() {
  try {
    const emailCheckResult = await handleCheckEmailLimit([...emails.values()])
    if (!emailCheckResult) {
      $q.notify({
        message: 'You are out of limit',
        type: 'negative',
      })
      return
    }

    if ([...emails.values()].length === 0) {
      $q.notify({
        message: 'Please add at least one email to create',
        type: 'negative',
      })
      return
    }

    const createResult = await handleCreateNewMember(
      [...emails.values()],
      getUserName.value || ''
    )
    if (createResult) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function onAddNewEmail() {
  if (!form.email) {
    return
  }
  emails.set(form.email, form.email)
}

function onRemoveEmail(email: string) {
  emails.delete(email)
}

function onSelectEmail(email: string) {
  form.email = email
}

async function onFetchRegisterLimit() {
  registerLimit.value = await handleGetRegisterLimit()
}

onFetchRegisterLimit()
</script>
<style lang="scss">
.member-users-new-user-card {
  min-width: 300px;
}
</style>
