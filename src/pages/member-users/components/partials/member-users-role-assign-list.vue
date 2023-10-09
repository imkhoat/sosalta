<template>
  <q-card
    flat
    class="member-users-role-list"
  >
    <q-card-section class="column justify-start items-stretch">
      <div
        v-for="(group, groupIndex) in Object.values(rolesByGroup)"
        :key="groupIndex + '__member-users-role-list-group'"
        class="column justify-start items-start"
        :class="{ 'q-mt-md': groupIndex !== 0 }"
      >
        <span class="text-caption text-disable q-mb-sm">{{ group.name }}</span>
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
                v-model="radio"
                :val="role.id"
                :label="role.roleName"
              ></q-radio>
              <q-icon
                size="xs"
                name="sym_o_help"
                class="q-ml-sm"
                @click="onOpenRolePermissionDetail(role)"
              >
                <q-tooltip max-width="200px"
                  >Click to view detail modal</q-tooltip
                >
              </q-icon>
            </div>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="modal.open"
    class="member-users-role-list__dialog"
  >
    <q-card
      flat
      class="member-users-role-list__dialog-permission rounded-borders"
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
import { computed, defineAsyncComponent, reactive } from 'vue'
import {
  PermissionRole,
  PermissionRoleType,
} from 'src/core/types/permission-role-types'
import { UserMenu } from 'src/core/types/user-menu'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useMemberSettings } from '../../hooks/use-member-settings'
import { PermissionCodeType } from 'src/core/types/permission-code-types'
import { useQuasar } from 'quasar'

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
type CustomType = Exclude<PermissionRoleType, 'special_role'>
interface RoleGroup {
  name: string
  roles: PermissionRole[]
  inputType: 'CHECKBOX' | 'RADIO'
  isUpdate: boolean
}

// composable
const { t } = useI18n()
const $q = useQuasar()
const { fetchUserDetailMenusByRole } = useMemberSettings()

// props
const props = defineProps<{
  roles: PermissionRole[] | undefined
  modelValue: number | null
}>()
const emits = defineEmits(['update:modelValue'])

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.md
})

const radio = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
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
    },
    custom_role: {
      name: 'Custom role',
      roles: [],
      inputType: 'RADIO',
      isUpdate: true,
    },
  }

  if (props.roles) {
    props.roles?.forEach((role) => {
      const roleType = role.type as CustomType
      group[`${roleType}`].roles.push(role)
    })
  }

  return group
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

// data
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

async function onOpenRolePermissionDetail(role: PermissionRole) {
  modal.open = true
  modal.activeRole = role
  modal.menus = await fetchUserDetailMenusByRole(role.id)
}
</script>
<style lang="scss">
.member-users-role-list {
  &__dialog-permission {
    width: 980px;
    max-width: 100vw !important;
  }
}
</style>
