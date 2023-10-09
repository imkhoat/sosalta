<template>
  <div
    class="team-management-role-list"
    :class="{ 'team-management-role-list__select-hidden': !allowEdit }"
  >
    <div class="column justify-start items-start">
      <span class="text-caption text-disable q-mb-sm">Special roles</span>
      <q-list
        bordered
        separator
        dense
        class="column justify-start items-start q-gutter-y-xs full-width rounded-borders"
      >
        <q-item
          v-for="(role, index) in specialRoles"
          :key="index + '__team-management-role-list'"
          class="row justify-between items-center full-width"
        >
          <div class="column justify-start items-stretch full-width">
            <div>
              <q-checkbox
                v-model="selectedSpecialRole"
                :val="role.id"
                :label="role.roleName"
                :readonly="disable"
                :disable="disable"
              ></q-checkbox>
              <q-icon
                size="xs"
                v-if="role?.tooltip"
                name="sym_o_help"
                class="q-ml-sm"
              >
                <q-tooltip max-width="200px">{{ role.tooltip }}</q-tooltip>
              </q-icon>
            </div>
          </div>
        </q-item>
      </q-list>
    </div>
    <div
      v-for="(group, groupIndex) in Object.values(rolesByGroup)"
      :key="groupIndex + '__team-management-role-list-group'"
      class="column justify-start items-start q-mt-md"
    >
      <div class="row justify-between items-center full-width q-mb-sm">
        <span class="text-caption text-disable">{{ group.name }}</span>
        <q-btn
          v-if="group.isNew && hasCreateTeamRoleAuthorization"
          size="sm"
          color="brand"
          flat
          icon="sym_o_add"
          class="q-px-sm"
          @click="onCreateNewRole"
          >Create new role</q-btn
        >
      </div>
      <q-list
        bordered
        separator
        dense
        class="column justify-start items-start q-gutter-y-xs full-width rounded-borders"
      >
        <template v-if="group?.roles?.length > 0">
          <q-item
            v-for="(role, index) in group.roles"
            :key="index + '__team-management-role-list'"
            class="row justify-between items-center full-width"
          >
            <div>
              <q-radio
                v-model="selectedRole"
                :val="role.id.toString()"
                :label="role.roleName"
                :readonly="disable"
                :disable="disable"
              ></q-radio>
              <q-icon
                size="xs"
                v-if="group?.isShowDialog"
                name="sym_o_help"
                class="q-ml-sm"
                @click="onViewDetailRolePermissions(role)"
              >
                <q-tooltip max-width="200px"
                  >Click to view detail modal</q-tooltip
                >
              </q-icon>
            </div>
            <div v-if="group.isUpdate">
              <q-btn
                v-if="hasDeleteTeamRoleAuthorization"
                size="sm"
                flat
                round
                rounded
                class="col-1"
                @click="onDeleteRole(role)"
              >
                <q-icon name="sym_o_delete"></q-icon>
              </q-btn>
              <q-btn
                v-if="hasEditTeamRoleAuthorization"
                size="sm"
                flat
                round
                rounded
                class="col-1"
                @click="onUpdateRole(role)"
              >
                <q-icon name="sym_o_edit"></q-icon>
              </q-btn>
            </div>
          </q-item>
        </template>
        <q-empty-data
          v-else
          content="Roles not found"
          class="bg-grey-1"
        ></q-empty-data>
      </q-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { PermissionRole } from 'src/core/types/permission-role-types'
import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'
import { useActiveTeamActionsVisible } from '../../hooks/authorization/use-team-actions-visible'

interface RoleGroup {
  name: string
  roles: PermissionRole[]
  inputType: 'CHECKBOX' | 'RADIO'
  isUpdate: boolean
  isShowDialog?: boolean
  isNew: boolean
}

// composable
const $q = useQuasar()
const { t } = useI18n()
const { fetchTeamMembers } = useTeams()
const { onDeleteRole, onUpdateRole, onViewDetailRolePermissions } =
  useTeamRoles()
const {
  hasCreateTeamRoleAuthorization,
  hasEditTeamRoleAuthorization,
  hasDeleteTeamRoleAuthorization,
} = useActiveTeamActionsVisible()
// props
const props = defineProps<{
  roles?: PermissionRole[] | undefined
  modelValue?: string | number | undefined | null
  disable?: boolean
  allowEdit?: boolean
  modelSpecialRole?: string[]
}>()
const emits = defineEmits([
  'update:modelValue',
  'update:modelSpecialRole',
  'create-role',
])

// computed
const selectedRole = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const selectedSpecialRole = computed({
  get() {
    return props.modelSpecialRole
  },
  set(value) {
    emits('update:modelSpecialRole', value)
  },
})

const rolesByGroup = computed(() => {
  const group: {
    default_role: RoleGroup
    custom_role: RoleGroup
  } = {
    default_role: {
      name: 'Default role',
      roles: [],
      inputType: 'RADIO',
      isUpdate: false,
      isShowDialog: true,
      isNew: false,
    },
    custom_role: {
      name: 'Custom role',
      roles: [],
      inputType: 'RADIO',
      isUpdate: true,
      isShowDialog: true,
      isNew: true,
    },
  }

  if (props.roles) {
    props.roles?.forEach((role) => {
      group[`${role.type}`].roles.push(role)
    })
  }

  return group
})

const specialRoles = computed(() => {
  return [
    {
      id: 'memberManager',
      module: 'member_user',
      owner: '-',
      type: 'special_role',
      roleName: 'Team manager',
      tooltip: 'Allow this user to manage this team.',
      selectMember: true,
    },
  ]
})

// methods
function onCreateNewRole() {
  emits('create-role')
}

// hooks
fetchTeamMembers()
</script>
<style lang="scss">
.team-management-role-list {
  &__select-hidden {
    .q-checkbox__inner,
    .q-radio__inner {
      visibility: hidden;
      width: 0;
      display: inline-block;
      min-width: 0;
    }
  }
}
</style>
