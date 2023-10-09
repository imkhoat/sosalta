<template>
  <q-card class="member-users-new-role-card">
    <q-form
      ref="memberUsersNewRoleCard"
      no-error-focus
      @submit="onCreateNewRole"
    >
      <q-card-section>
        <q-section-header
          title="Create new role"
          sub-title="Input role name and select role permissions"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="role-name"
          label="Role name"
          stack-label
          outlined
          lazy-rules
          dense
          hide-bottom-space
          class="q-mb-md"
          v-model="roleName"
        ></q-input>
        <div class="member-users-new-role-card__role">
          <q-skeleton-suspense>
            <member-users-permission-expand-list
              v-model="menus"
              :disable="false"
              :limits="limits"
              v-if="isMobileScreen"
            ></member-users-permission-expand-list>
            <member-users-permission-category-list
              v-else
              v-model="menus"
              :disable="false"
              :limits="limits"
            ></member-users-permission-category-list>
          </q-skeleton-suspense>
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { ActionProp } from 'src/core/types/action-prop-types'
import { AllocationLimits } from 'src/core/types/allocation-limit-types'
import { PermissionCodeType } from 'src/core/types/permission-code-types'
import { UserMenu } from 'src/core/types/user-menu'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemberSettings } from '../../hooks/use-member-settings'
import { errorHandler } from 'src/core/utils/error-handler'
import { PERMISSION_INPUT_TYPE } from 'src/core/types/permission-types'
import { useQuasar } from 'quasar'
import { CreateNewRoleRequest } from 'src/core/types/services/user-types'
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

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  type:
    | 'NEW_ROLE_MODAL'
    | 'NEW_ROLE_WITH_EXIST_PERMISSION_MODAL'
    | 'UPDATE_ROLE_MODAL'
}>()

// composables
const $q = useQuasar()
const { t } = useI18n()
const {
  fetchUserDetailMenusByRole,
  fetchUserDetailMenus,
  fetchAllocationLitmit,
  handleCreateNewRole,
  activeUser,
  activeRole,
  loading,
} = useMemberSettings()
const { hasCreateRoleMemberAuthorization } = useActiveMemberActionsVisible()

// data
const roleName = ref('')
const menus = ref<Map<PermissionCodeType, UserMenu>>(new Map())
const limits = ref<AllocationLimits | null>()
const memberUsersNewRoleCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.md
})

const isEditMode = computed(() => {
  return props.type === 'UPDATE_ROLE_MODAL'
})

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
      name: isEditMode.value ? t('textActions.Save') : t('textActions.Create'),
      disable: hasCreateRoleMemberAuthorization.value,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}
async function onFetchUserRolePermissions() {
  try {
    if (isEditMode.value) {
      menus.value = await fetchUserDetailMenusByRole(activeRole.value?.id)
    } else {
      menus.value = await fetchUserDetailMenus(activeUser.value?.userName)
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onFetchAllocationLimit() {
  try {
    limits.value = await fetchAllocationLitmit(activeUser.value?.userName)
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

async function onCreateNewRole() {
  try {
    const valid: boolean | undefined =
      await memberUsersNewRoleCard?.value?.validate()
    if (!valid) {
      $q.notify({
        message: 'There are fields out of scope.',
        type: 'negative',
      })
      return
    }

    const payload: CreateNewRoleRequest = {
      roleId: '',
      module: 'member_user',
      roleName: roleName.value,
      menus: _generateAuthPayload(),
    }

    if (isEditMode.value) {
      if (!activeRole.value?.id) {
        $q.notify({
          message: 'Missing selected role',
          type: 'negative',
        })
      }
      payload.roleId = activeRole.value?.id
    }

    const result = await handleCreateNewRole(payload)

    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function _generateAuthPayload() {
  const updateMenus = [...menus.value.values()]

  const trees = updateMenus.map((menu) => {
    const menuValue =
      menu.type === PERMISSION_INPUT_TYPE.INPUT
        ? parseInt(menu.value?.toString() ?? '0')
        : menu.checked
        ? 0
        : 1

    return {
      menuId: `${menu.menuId}`,
      value: `${menuValue}`,
    }
  })

  return trees
}

// hooks
watch(
  () => isEditMode.value,
  async (newVal) => {
    if (newVal) {
      roleName.value = activeRole.value?.roleName ?? ''
    }
    await Promise.all([onFetchAllocationLimit(), onFetchUserRolePermissions()])
  },
  { immediate: true }
)
</script>
