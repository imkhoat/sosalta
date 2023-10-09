<template>
  <q-card
    flat
    class="member-users-role-form"
  >
    <q-card-section
      class="row justify-between items-center full-width q-pb-none"
    >
      <div class="row justify-start items-center">
        <strong class="text-captions">Roles</strong>
        <q-btn
          v-if="!editMode && hasEditMemberAuthorization(activeUser)"
          size="sm"
          flat
          round
          rounded
          @click="onToggleEditBox"
        >
          <q-icon name="sym_o_edit"></q-icon>
        </q-btn>
      </div>
      <div v-if="editMode">
        <q-form-actions :actions="formActions"></q-form-actions>
      </div>
    </q-card-section>
    <q-skeleton-suspense>
      <member-users-role-list
        :roles="roleTemplates"
        v-model="assignedRoleId"
        v-model:model-special-role="specialRoles"
        v-model:model-special-roles-user="specialRolesUser"
        :disable="!editMode || !hasEditMemberAuthorization(activeUser)"
        @create-role="onCreateNewRole"
      ></member-users-role-list>
    </q-skeleton-suspense>
    <q-card-actions
      v-if="editMode"
      class="row justify-end"
    >
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, defineAsyncComponent } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useMemberSettings } from '../hooks/use-member-settings'
import { AssignRoleRequest } from 'src/core/types/services/user-types'
import { UserRole } from 'src/core/types/user-role-types'
import { useActiveMemberActionsVisible } from '../hooks/use-member-actions-visible'

const MemberUsersRoleList = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/partials/member-users-role-list.vue'
    )
)

// composable
const { t } = useI18n()
const {
  handleGetPermissionRoles,
  handleUpdateManagingUser,
  handleAssignSpecialRole,
  handleAssignRole,
  fetchAssignedRole,
  onCreateNewRole,
  roleTemplates,
  assignedRoleId,
  activeUser,
  loading,
} = useMemberSettings()
const { hasEditMemberAuthorization } = useActiveMemberActionsVisible()

// props & emits
const emits = defineEmits(['close', 'refresh'])

// data
const editMode = ref(false)
const specialRoles = ref<UserRole[]>([])
const specialRolesUser = ref([])

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Cancel'),
      action: onToggleEditBox,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Update'),
      action: onAssignRole,
      disable: !hasEditMemberAuthorization(activeUser.value),
      loading: loading.value,
    },
  ]
})
// methods
function onToggleEditBox() {
  editMode.value = !editMode.value
}

async function onAssignRole() {
  try {
    const params: AssignRoleRequest = {
      module: 'member_user',
      roleId: assignedRoleId.value,
      users: [activeUser.value?.userName ?? ''],
      moduleItem: '',
    }
    const result = await handleAssignRole(params)
    const result2 = await handleAssignSpecialRole(
      _generateSpecialRoleArrToString(specialRoles.value)
    )
    const result3 = await handleUpdateManagingUser(specialRolesUser.value)
    if (result && result2 && result3) {
      emits('refresh')
      emits('close')
      editMode.value = !editMode.value
      onFetchingAllData()
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onFetchingAllData() {
  await Promise.all([handleGetPermissionRoles(), fetchAssignedRole()])
  specialRoles.value = _generateSpecialRole(activeUser.value?.roleName)
}

function _generateSpecialRole(roleName: UserRole | undefined) {
  switch (roleName) {
    case 'memberManager':
    case 'paymentManager':
      return [roleName] as UserRole[]
    case 'memberPaymentManager':
      return ['memberManager', 'paymentManager'] as UserRole[]
    case 'orgUser':
    case 'orgAdmin':
      return [] as UserRole[]
    default:
      return [] as UserRole[]
  }
}

function _generateSpecialRoleArrToString(roleNames: UserRole[] | undefined) {
  switch (roleNames?.length) {
    case 0:
      return 'orgUser'
    case 1:
      return roleNames[0]
    default:
      return 'memberPaymentManager'
  }
}

onFetchingAllData()
</script>
