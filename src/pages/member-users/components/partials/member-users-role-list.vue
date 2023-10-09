<template>
  <q-card
    flat
    class="member-users-role-list"
  >
    <q-card-section class="column justify-start items-stretch">
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
            :key="index + '__member-users-role-list'"
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
              <q-card
                v-if="
                  role.selectMember &&
                  selectedSpecialRole?.includes('memberManager')
                "
                flat
                class="rounded-borders bg-grey-2"
              >
                <q-card-section>
                  <q-checkbox
                    v-for="(user, userIndex) in users"
                    :key="userIndex + '__member-users-role-list-user'"
                    v-model="selectedManagingUsers"
                    :val="user.userName"
                    :label="user.userName"
                  ></q-checkbox>
                </q-card-section>
              </q-card>
            </div>
          </q-item>
        </q-list>
      </div>
      <div
        v-for="(group, groupIndex) in Object.values(rolesByGroup)"
        :key="groupIndex + '__member-users-role-list-group'"
        class="column justify-start items-start q-mt-md"
      >
        <div class="row justify-between items-center full-width q-mb-sm">
          <span class="text-caption text-disable">{{ group.name }}</span>
          <q-btn
            v-if="group.isNew && hasCreateRoleMemberAuthorization"
            size="sm"
            color="brand"
            flat
            icon="sym_o_add"
            class="q-px-sm"
            @click="onCreateNewRole"
            >Create new</q-btn
          >
        </div>
        <q-list
          bordered
          separator
          dense
          class="column justify-start items-start q-gutter-y-xs full-width rounded-borders"
        >
          <q-item
            v-for="(role, index) in group.roles"
            :key="index + '__member-users-role-list'"
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
                @click="onOpenRolePermissionDetail(role)"
              >
                <q-tooltip max-width="200px"
                  >Click to view detail modal</q-tooltip
                >
              </q-icon>
            </div>
            <div v-if="group.isUpdate">
              <q-btn
                v-if="hasDeleteRoleMemberAuthorization"
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
                v-if="hasEditRoleMemberAuthorization"
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
        </q-list>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="modal.open"
    :full-width="true"
    class="member-settings-page__dialog"
  >
    <q-card
      flat
      class="rounded-borders"
    >
      <q-card-section>
        <q-section-header
          title="Role permissions"
          :sub-title="`Role:${modal.activeRole?.roleName}`"
        ></q-section-header>
      </q-card-section>
      <q-skeleton-suspense>
        <q-card-section>
          <member-users-permission-expand-list
            :model-value="modal.menus"
            v-if="isMobileScreen"
          ></member-users-permission-expand-list>
          <member-users-permission-category-list
            v-else
            :model-value="modal.menus"
          ></member-users-permission-category-list>
        </q-card-section>
      </q-skeleton-suspense>
      <q-card-actions class="row justify-end">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import {
  computed,
  defineAsyncComponent,
  reactive,
  watch,
  watchEffect,
} from 'vue'
import { UserMenu } from 'src/core/types/user-menu'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useMemberSettings } from '../../hooks/use-member-settings'
import { PermissionRole } from 'src/core/types/permission-role-types'
import { PermissionCodeType } from 'src/core/types/permission-code-types'
import { useQuasar } from 'quasar'
import { useActiveMemberActionsVisible } from '../../hooks/use-member-actions-visible'

const MemberUsersPermissionCategoryList = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/partials/member-users-permission-category-list.vue'
    )
)
const MemberUsersPermissionExpandList = defineAsyncComponent(
  () =>
    import(
      'src/pages/member-users/components/partials/member-users-permission-expand-list.vue'
    )
)

interface RoleGroup {
  name: string
  roles: PermissionRole[]
  inputType: 'CHECKBOX' | 'RADIO'
  isUpdate: boolean
  isShowDialog?: boolean
  isNew?: boolean
}

// composable
const { t } = useI18n()
const $q = useQuasar()
const {
  onDeleteRole,
  fetchUserDetailMenusByRole,
  onFetchingData,
  onUpdateRole,
  users,
  activeUser,
} = useMemberSettings()
const {
  hasDeleteRoleMemberAuthorization,
  hasEditRoleMemberAuthorization,
  hasCreateRoleMemberAuthorization,
} = useActiveMemberActionsVisible()

// props
const props = defineProps<{
  roles: PermissionRole[] | undefined
  modelValue: string | number | undefined | null
  disable?: boolean
  modelSpecialRole: string[]
  modelSpecialRolesUser: string[]
}>()
const emits = defineEmits([
  'update:modelValue',
  'update:modelSpecialRole',
  'update:modelSpecialRolesUser',
  'create-role',
])

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.md
})

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

const selectedManagingUsers = computed({
  get() {
    return props.modelSpecialRolesUser
  },
  set(value) {
    emits('update:modelSpecialRolesUser', value)
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
      roleName: 'Member manager',
      tooltip: 'Allow this Member User to manage other Member Users.',
      selectMember: true,
    },
    {
      id: 'paymentManager',
      module: 'member_user',
      owner: '-',
      type: 'special_role',
      roleName: 'Payment manager',
      tooltip:
        'Allow this Member User to access and operate account-billing/payment related functions.',
      selectMember: false,
    },
  ]
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
  ]
})

// datas
const modal = reactive<{
  open: boolean
  activeRole: PermissionRole | null
  menus: Map<PermissionCodeType, UserMenu>
}>({
  open: false,
  activeRole: null,
  menus: new Map<PermissionCodeType, UserMenu>(),
})
// methods
function onClose() {
  modal.open = false
}

function onCreateNewRole() {
  emits('create-role')
}

async function onOpenRolePermissionDetail(role: PermissionRole) {
  modal.open = true
  modal.activeRole = role
  modal.menus = await fetchUserDetailMenusByRole(role.id)
}

onFetchingData()

watchEffect(() => {
  if (
    activeUser.value?.memberManagerList &&
    activeUser.value?.memberManagerList?.includes('all') &&
    users.value
  ) {
    selectedManagingUsers.value = users.value?.map((item) => item.userName)
  } else if (
    activeUser.value?.memberManagerList &&
    activeUser.value?.memberManagerList?.length > 0 &&
    users.value
  ) {
    selectedManagingUsers.value = activeUser.value?.memberManagerList
  }
})
</script>
