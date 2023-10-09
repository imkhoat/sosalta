<template>
  <q-card class="member-users-assign-role-card">
    <q-form
      ref="memberUsersNewRoleCard"
      no-error-focus
      @submit="onAssignRole"
    >
      <q-card-section>
        <q-section-header
          title="Assign role"
          sub-title="Select role and click assign button"
        ></q-section-header>
      </q-card-section>
      <q-card-section class="column justify-start items-stretch bg-grey-1">
        <span class="text-caption text-disable">Assign to below users</span>
        <q-checkbox
          v-for="(user, index) in selectUsers"
          :key="index + '__member-users-assign-role-card-user'"
          :model-value="true"
          :label="user.userName"
        ></q-checkbox>
      </q-card-section>
      <q-skeleton-suspense>
        <member-users-role-assign-list
          v-model="form.roleId"
          :roles="roleTemplates"
        ></member-users-role-assign-list>
      </q-skeleton-suspense>

      <q-card-actions class="row justify-end">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { ActionProp } from 'src/core/types/action-prop-types'
import { AssignRoleRequest } from 'src/core/types/services/user-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { computed, defineAsyncComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemberSettings } from '../../hooks/use-member-settings'
import { useActiveMemberActionsVisible } from '../../hooks/use-member-actions-visible'

const MemberUsersRoleAssignList = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/partials/member-users-role-assign-list.vue'
    )
)

// props & emits
const emits = defineEmits(['close', 'refresh'])

// composable
const { t } = useI18n()
const {
  handleGetPermissionRoles,
  handleAssignRole,
  roleTemplates,
  selectUsers,
  loading,
} = useMemberSettings()
const { hasAssignMemberAuthorization } = useActiveMemberActionsVisible()

//data
const form = reactive({
  roleId: null,
})

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Cancel'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      unelevated: true,
      name: t('textActions.Assign'),
      disable: hasAssignMemberAuthorization.value,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onAssignRole() {
  try {
    const params: AssignRoleRequest = {
      module: 'member_user',
      roleId: form.roleId,
      users: selectUsers.value?.map((user) => user.userName),
      moduleItem: '',
    }
    const result = await handleAssignRole(params)

    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

await handleGetPermissionRoles()
</script>
<style lang="scss">
.member-users-assign-role-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
