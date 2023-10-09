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
          readonly
          disable
        ></q-checkbox>
      </q-card-section>
      <q-skeleton-suspense>
        <q-card-section>
          <project-management-role-list
            :roles="roleTemplates"
            v-model="form.roleId"
            v-model:model-special-role="form.managementRole"
            :allow-edit="true"
            @create-role="onCreateNewRole"
          ></project-management-role-list>
        </q-card-section>
      </q-skeleton-suspense>

      <q-card-actions class="row justify-end">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { computed, defineAsyncComponent, reactive, watch } from 'vue'
import { AssignRoleRequest } from 'src/core/types/services/user-types'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'
import { P } from 'app/dist/spa/assets/permission-types.cf20d8bb'

// lazy loading
const ProjectManagementRoleList = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/shared/project-management-role-list.vue'
    )
)
// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  projectId: string | number | undefined
}>()

// composable
const { t } = useI18n()
const { selectUsers } = useProjectMembers()
const {
  loading,
  roleTemplates,
  handleGetPermissionRoles,
  handleAssignRole,
  onCreateNewRole,
  handleSetManagementRole,
  handleCancelManagementRole,
} = useProjectRoles()

//data
const form = reactive({
  roleId: null,
  managementRole: false,
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
      module: 'project',
      roleId: form.roleId,
      users: selectUsers.value?.map((user) => user.userName),
      moduleItem: props.projectId ?? '',
    }
    const result = await handleAssignRole(params)

    if (form.managementRole) {
      await Promise.all(
        selectUsers.value?.map((user) => {
          return handleSetManagementRole(
            props.projectId?.toString() ?? '',
            user.userName
          )
        })
      )
    } else {
      await Promise.all(
        selectUsers.value?.map((user) => {
          return handleCancelManagementRole(
            props.projectId?.toString() ?? '',
            user.userName
          )
        })
      )
    }

    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

// hooks
await handleGetPermissionRoles()

watch(
  () => selectUsers.value,
  () => {
    form.managementRole = selectUsers.value?.some((item) => item?.managerUser)
  },
  {
    immediate: true,
  }
)
</script>
<style lang="scss">
.member-users-assign-role-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
