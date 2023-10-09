<template>
  <q-card class="member-role-delete-card">
    <q-card-section>
      <q-section-header title="Delete role"></q-section-header>
    </q-card-section>
    <q-card-section>
      <span>
        Do you want to delete
        <span class="text-weight-bold text-negative">{{
          activeRole?.roleName
        }}</span>
        role?
      </span>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ActionProp } from 'src/core/types/action-prop-types'

import { errorHandler } from 'src/core/utils/error-handler'
import { useMemberSettings } from '../../hooks/use-member-settings'
import { useActiveMemberActionsVisible } from '../../hooks/use-member-actions-visible'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { activeRole, handleDeleteRole, loading } = useMemberSettings()
const { hasDeleteRoleMemberAuthorization } = useActiveMemberActionsVisible()

// computed
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
      disable: hasDeleteRoleMemberAuthorization.value,
      loading: loading.value,
    },
  ]
})

function onClose() {
  emits('close')
}
async function onDeleteObject() {
  try {
    const result = await handleDeleteRole()

    if (result) {
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
.member-role-delete-card {
  min-width: 300px;
}
</style>
