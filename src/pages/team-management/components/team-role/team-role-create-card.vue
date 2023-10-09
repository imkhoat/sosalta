<template>
  <q-card class="team-management-new-role-card">
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
          :rules="rules.newName"
          class="q-mb-md"
          v-model="roleName"
        ></q-input>
        <div class="team-management-new-role-card__role">
          <q-skeleton-suspense>
            <team-management-permission-expand-list
              v-model="menus"
              :disable="false"
              :limits="limits"
              v-if="isMobileScreen"
            ></team-management-permission-expand-list>
            <team-management-permission-category-list
              v-else
              v-model="menus"
              :disable="false"
              :limits="limits"
            ></team-management-permission-category-list>
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
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { UserMenu } from 'src/core/types/user-menu'
import useRules from 'src/core/composables/use-rules'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'
import { AllocationLimits } from 'src/core/types/allocation-limit-types'
import { CreateNewRoleRequest } from 'src/core/types/services/user-types'
import { computed, defineAsyncComponent, reactive, ref, watch } from 'vue'
import { TeamPermissionCodeType } from 'src/core/types/team-permission-code-types'

// lazy loading
const TeamManagementPermissionCategoryList = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/shared/team-management-permission-category-list.vue'
    )
)
const TeamManagementPermissionExpandList = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/shared/team-management-permission-expand-list.vue'
    )
)

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  modalType: 'CREATE_NEW_ROLE_MODAL' | 'UPDATE_ROLE_MODAL'
}>()

// composables
const $q = useQuasar()
const { t } = useI18n()
const { requiredRules } = useRules()
const {
  loading,
  activeRole,
  defaultRole,
  handleCreateNewRole,
  handleFetchingUserDetailMenusByRole,
} = useTeamRoles()

// data
const roleName = ref('')
const limits = ref<AllocationLimits | null>()
const menus = ref<Map<TeamPermissionCodeType, UserMenu[]>>(new Map())
const memberUsersNewRoleCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

const rules = reactive({
  newName: requiredRules,
})

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.md
})

const isEditMode = computed(() => {
  return props.modalType === 'UPDATE_ROLE_MODAL'
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
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onFetchRolePermissions() {
  try {
    if (isEditMode.value) {
      menus.value = await handleFetchingUserDetailMenusByRole(
        activeRole.value?.id
      )
    } else {
      menus.value = await handleFetchingUserDetailMenusByRole(
        defaultRole?.value?.id
      )
    }
  } catch (error) {}
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
      module: 'team',
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
    return menu
      .filter((item) => item.checked)
      .map((item) => {
        const menuValue = item.checked ? 1 : 0

        return {
          menuId: `${item.menuId}`,
          value: `${menuValue}`,
        }
      })
  })
  return trees.flat()
}

// hooks
watch(
  () => isEditMode.value,
  async (newVal) => {
    if (newVal) {
      roleName.value = activeRole.value?.roleName ?? ''
    }
    await onFetchRolePermissions()
  },
  { immediate: true }
)
</script>
