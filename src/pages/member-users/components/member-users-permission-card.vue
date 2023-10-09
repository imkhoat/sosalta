<template>
  <q-card
    flat
    class="member-users-permission-card"
  >
    <q-form
      ref="memberUsersPermissionCard"
      no-error-focus
      @submit="onUpdatePermission"
    >
      <q-card-section
        class="row justify-between items-center full-width q-pb-none"
      >
        <div class="row justify-start items-center">
          <strong class="text-captions">Permissions</strong>
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
        <div>
          <q-btn
            v-if="!editMode"
            size="sm"
            color="brand"
            flat
            icon="sym_o_add"
            class="q-px-sm"
            @click="onCreateNewRoleWithCurrentPermission"
            >Create new role with current permissions</q-btn
          >
          <q-form-actions
            v-else
            :actions="formActions"
          ></q-form-actions>
        </div>
      </q-card-section>
      <q-skeleton-suspense>
        <q-card-section>
          <member-users-permission-expand-list
            v-model="flatMenus"
            :disable="!editMode || !hasEditMemberAuthorization(activeUser)"
            :limits="allocationLimits"
            v-if="isMobileScreen"
          ></member-users-permission-expand-list>
          <member-users-permission-category-list
            v-else
            v-model="flatMenus"
            :disable="!editMode || !hasEditMemberAuthorization(activeUser)"
            :limits="allocationLimits"
          ></member-users-permission-category-list>
        </q-card-section>
      </q-skeleton-suspense>
      <q-card-actions
        v-if="editMode"
        class="row justify-end"
      >
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, defineAsyncComponent } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import { PERMISSION_INPUT_TYPE } from 'src/core/types/permission-types'
import { UpdateAuthRequest } from 'src/core/types/services/user-types'
import { useQuasar } from 'quasar'
import { useActiveMemberActionsVisible } from '../hooks/use-member-actions-visible'

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

// composable
const $q = useQuasar()
const { t } = useI18n()
const {
  handleGetUserDetail,
  handleUpdateAuth,
  handleGetAllocationLitmit,
  onCreateNewRoleWithCurrentPermission,
  loading,
  flatMenus,
  activeUser,
  allocationLimits,
} = useMemberSettings()
const { hasEditMemberAuthorization } = useActiveMemberActionsVisible()

// props & emits
const emits = defineEmits(['close', 'refresh'])

// data
const editMode = ref(false)
const memberUsersPermissionCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const isMobileScreen = computed(() => {
  return $q.screen.lt.md
})
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
      mode: 'submit',
      color: 'primary',
      unelevated: true,
      name: t('textActions.Update'),
      disable: !hasEditMemberAuthorization(activeUser.value),
      loading: loading.value,
    },
  ]
})

// methods
function onToggleEditBox() {
  editMode.value = !editMode.value
}

async function onUpdatePermission() {
  try {
    const valid: boolean | undefined =
      await memberUsersPermissionCard?.value?.validate()
    if (!valid) {
      $q.notify({
        message: 'There are fields out of scope.',
        type: 'negative',
      })
      return
    }

    if (!activeUser.value?.userName) {
      $q.notify({
        message: 'Please select user to update',
        type: 'negative',
      })
      return
    }

    const payload: UpdateAuthRequest = {
      trees: _generateAuthPayload(),
      userNames: [activeUser.value?.userName],
    }

    const result = await handleUpdateAuth(payload)

    if (result) {
      onToggleEditBox()
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}

function _generateAuthPayload() {
  const menus = [...flatMenus.value.values()]

  const trees = menus
    .filter((menu) => {
      return menu.checked
    })
    .map((menu) => {
      const menuValue =
        menu.type === PERMISSION_INPUT_TYPE.INPUT
          ? menu.value
          : menu.checked
          ? 0
          : 1

      return {
        menuId: menu.menuId,
        type: menu.type,
        value: menuValue,
      }
    })

  return trees
}

Promise.all([
  handleGetUserDetail(),
  handleGetAllocationLitmit(activeUser.value?.userName || ''),
])
</script>
