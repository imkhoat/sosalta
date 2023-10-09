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
          v-if="editMode && hasEditTeamMemberPermissionsAuthorization"
          class="row justify-end"
        >
          <q-form-actions :actions="formActions"></q-form-actions>
        </div>
        <q-btn
          v-else-if="!editMode && hasCreateTeamRoleAuthorization"
          size="sm"
          color="brand"
          flat
          icon="sym_o_add"
          class="q-px-sm"
          >Create new role with current permissions</q-btn
        >
      </q-card-section>
      <q-skeleton-suspense>
        <q-card-section>
          <team-management-permission-expand-list
            v-model="activeUserPermission"
            :disable="!editMode"
            v-if="isMobileScreen"
          ></team-management-permission-expand-list>
          <team-management-permission-category-list
            v-else
            v-model="activeUserPermission"
            :disable="!editMode"
          ></team-management-permission-category-list>
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
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, ref, defineAsyncComponent } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { TeamMember } from 'src/core/types/team-member-types'
import { useTeamMembers } from 'src/pages/team-management/hooks/use-members'
import { UpdateTeamUserPermissionRequest } from 'src/core/types/services/user-types'
import { useActiveTeamActionsVisible } from 'src/pages/team-management/hooks/authorization/use-team-actions-visible'

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

// composable
const $q = useQuasar()
const { t } = useI18n()
const { loading, activeUserPermission, handleUpdateTeamUserPermission } =
  useTeamMembers()
const {
  hasCreateTeamRoleAuthorization,
  hasEditTeamMemberPermissionsAuthorization,
} = useActiveTeamActionsVisible()

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  teamId?: string | null | undefined
  user: TeamMember | null | undefined
}>()
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
      disable: !hasEditTeamMemberPermissionsAuthorization.value,
      loading: loading.value,
    },
  ]
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

async function onUpdatePermission() {
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
          managerUser: props.user?.manager ?? false,
          userName: props.user?.userName,
        },
      ],
    }

    const result = await handleUpdateTeamUserPermission(payload)
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
</script>
