<template>
  <q-card
    flat
    class="member-users-role-card"
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
          <project-management-role-list
            :roles="roleTemplates"
            v-model="assignedRoleId"
            v-model:model-special-role="managementRole"
            :disable="!editMode"
            :allow-edit="true"
            @create-role="onCreateNewRole"
          ></project-management-role-list>
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
import { UserRole } from 'src/core/types/user-role-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { computed, ref, defineAsyncComponent, watch } from 'vue'
import { ProjectMember } from 'src/core/types/project-member-types'
import { AssignRoleRequest } from 'src/core/types/services/user-types'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'

// lazy loading
const ProjectManagementRoleList = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/shared/project-management-role-list.vue'
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
  handleSetManagementRole,
  handleCancelManagementRole,
} = useProjectRoles()

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  user: ProjectMember | null | undefined
  projectId: string | undefined
}>()

// data
const editMode = ref(false)
const managementRole = ref<boolean>(false)

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
      loading: loading.value,
    },
  ]
})

const isManager = computed(() => {
  return props.user?.managerUser
})

// methods
function onToggleEditBox() {
  editMode.value = !editMode.value
}

async function onAssignRole() {
  try {
    if (!props.user || !props.projectId) {
      $q.notify({
        message: 'Missing required data',
        type: 'negative',
      })
      return
    }
    const params: AssignRoleRequest = {
      module: 'project',
      roleId: assignedRoleId.value,
      users: [props?.user?.userName],
      moduleItem: props.projectId ?? '',
    }
    const result = await handleAssignRole(params)

    if (managementRole.value) {
      handleSetManagementRole(
        props.projectId?.toString() ?? '',
        props?.user?.userName
      )
    } else {
      handleCancelManagementRole(
        props.projectId?.toString() ?? '',
        props?.user?.userName
      )
    }

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

watch(
  () => isManager.value,
  (newVal) => {
    if (newVal) {
      managementRole.value = newVal
    }
  },
  {
    immediate: true,
  }
)
</script>
