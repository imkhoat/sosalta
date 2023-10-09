<template>
  <q-card class="member-users-new-user-card">
    <q-card-section>
      <q-section-header
        title="Change user name"
        sub-title="Input user first and lastname"
      ></q-section-header>
    </q-card-section>
    <q-card-section class="row justify-between items-center q-col-gutter-sm">
      <div class="col-12 col-6">
        <q-input
          id="first-name"
          label="First name"
          stack-label
          outlined
          lazy-rules
          dense
          hide-bottom-space
          class="col-grow"
          v-model="form.trueName.firstName"
        ></q-input>
      </div>
      <div class="col-12 col-6">
        <q-input
          id="last-name"
          label="Last name"
          stack-label
          outlined
          lazy-rules
          dense
          hide-bottom-space
          class="col-grow"
          v-model="form.trueName.lastName"
        ></q-input>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, reactive } from 'vue'
import { UserInfo } from 'src/core/types/user-info'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useMemberSettings } from '../hooks/use-member-settings'

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  user: UserInfo | null
}>()

// composables
const $q = useQuasar()
const { t } = useI18n()
const { handleUpdateTrueName, handleGetUserDetail, loading } =
  useMemberSettings()

// data

const form = reactive({
  trueName: props.user?.trueName ?? { firstName: '', lastName: '' },
})

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
      mode: 'submit',
      color: 'primary',
      unelevated: true,
      name: t('textActions.Save'),
      action: onUpdateUserInformation,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onUpdateUserInformation() {
  const updateResult = await handleUpdateTrueName(form.trueName)
  if (updateResult) {
    await handleGetUserDetail()
    emits('close')
  }
}
</script>
<style lang="scss">
.member-users-new-user-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
