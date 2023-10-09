<template>
  <q-card
    flat
    class="team-role-card"
  >
    <q-card-section
      class="row justify-between items-center full-width q-pb-none"
    >
      <div class="row justify-start items-center">
        <strong class="text-captions">Roles</strong>
        <q-btn
          v-if="!editMode"
          size="sm"
          flat
          round
          rounded
          @click="onToggleEditBox"
        >
          <q-icon name="sym_o_edit"></q-icon>
        </q-btn>
      </div>
      <div
        v-if="editMode"
        class="row justify-end"
      >
        <q-form-actions :actions="formActions"></q-form-actions>
      </div>
    </q-card-section>
    <q-card-section class="row no-wrap q-mt-sm">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <q-skeleton-suspense>
          <team-management-role-list
            :roles="roleTemplates"
            v-model="assignedRoleId"
            v-model:model-special-role="specialRoles"
            :disable="!editMode"
            :allow-edit="true"
            @create-role="onCreateNewRole"
          ></team-management-role-list>
        </q-skeleton-suspense>
      </div>
    </q-card-section>
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
import { useQuasar } from 'quasar'
import { USER_ROLE, UserRole } from 'src/core/types/user-role-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { TeamMember } from 'src/core/types/team-member-types'
import { computed, ref, defineAsyncComponent, watch } from 'vue'
import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'
import { useTeamMembers } from 'src/pages/team-management/hooks/use-members'
import {
  AssignRoleRequest,
  UpdateTeamUserPermissionRequest,
} from 'src/core/types/services/user-types'

// lazy loading
const TeamManagementRoleList = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/shared/team-management-role-list.vue'
    )
)

// composable
const $q = useQuasar()
const { t } = useI18n()
const {
  loading,
  roleTemplates,
  assignedRoleId,
  onCreateNewRole,
  handleAssignRole,
} = useTeamRoles()
const { activeUserPermission, handleUpdateTeamUserPermission } =
  useTeamMembers()
// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  user: TeamMember | null | undefined
  teamId: string | undefined
}>()

// data
const editMode = ref(false)
const specialRoles = ref<UserRole[]>([])

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
      action: onUpdate,
      loading: loading.value,
    },
  ]
})

const isManager = computed(() => {
  return props.user?.manager
})

const activeUserPermissionString = computed(() => {
  return [...activeUserPermission.value.values()]
    .flat()
    .map((item) => {
      return item.checked ? 1 : 0
    })
    .join('')
})

// methods
function onToggleEditBox() {
  editMode.value = !editMode.value
}

async function onAssignRole() {
  try {
    if (!props.user || !props.teamId) {
      $q.notify({
        message: 'Missing required data',
        type: 'negative',
      })
      return
    }
    const params: AssignRoleRequest = {
      module: 'team',
      roleId: assignedRoleId.value,
      users: [props?.user?.userName],
      moduleItem: props.teamId ?? '',
    }
    const result = await handleAssignRole(params)

    if (result) {
      emits('refresh')
      emits('close')
      onToggleEditBox()
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onUpdateMemberManagerRole(managerUser: boolean) {
  try {
    if (!props.user?.userName) {
      $q.notify({
        message: 'Please select user to update',
        type: 'negative',
      })
      return
    }

    const payload: UpdateTeamUserPermissionRequest = {
      groupAuths: [
        {
          auth: activeUserPermissionString.value,
          groupId: props.teamId || '',
          managerUser,
          userName: props.user?.userName,
        },
      ],
    }

    const result = await handleUpdateTeamUserPermission(payload)
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onUpdate() {
  const isManagerUserRole = specialRoles.value.includes(
    USER_ROLE.MEMBER_MANAGER
  )

  if (isManagerUserRole !== props.user?.manager) {
    await onUpdateMemberManagerRole(isManagerUserRole)
  }
  await onAssignRole()
}

watch(
  () => isManager.value,
  (newVal) => {
    if (newVal) {
      specialRoles.value = ['memberManager']
    }
  },
  {
    immediate: true,
  }
)
</script>
