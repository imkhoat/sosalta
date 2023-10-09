<template>
  <div
    class="row justify-end items-center full-width q-gutter-x-sm q-gutter-y-sm q-gutter-xs-y-sm"
  >
    <q-btn
      v-if="isSelectedUser && hasDeleteTeamMemberAuthorization"
      :disable="disableManipulationOwnerAction"
      outline
      unelevated
      color="primary"
      no-wrap
      @click="onDeleteMembers"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
        class="q-mr-xs"
      ></q-icon
      >Remove users
    </q-btn>
    <q-btn
      v-if="isSelectedUser && hasAssignTeamMemberAuthorization"
      :disable="disableManipulationOwnerAction"
      outline
      unelevated
      color="primary"
      no-wrap
      @click="onAssignRole"
    >
      <q-icon
        size="xs"
        name="sym_o_data_saver_on"
        class="q-mr-xs"
      ></q-icon
      >Assign role
    </q-btn>
    <q-btn
      v-if="hasAddTeamMemberAuthorization"
      push
      color="primary"
      no-wrap
      @click="onAddNewMember"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'Add member' : 'Add new member' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/core/stores/auth'
import { TEAM_MEMBER_TYPE } from 'src/core/types/team-member-types'
import { useTeamMembers } from 'src/pages/team-management/hooks/use-members'
import { useActiveTeamActionsVisible } from 'src/pages/team-management/hooks/authorization/use-team-actions-visible'

// composables
const $q = useQuasar()
const { isMainAccount } = storeToRefs(useAuthStore())
const { selectUsers, onAddNewMember, onAssignRole, onDeleteMembers } =
  useTeamMembers()
const {
  hasAddTeamMemberAuthorization,
  hasDeleteTeamMemberAuthorization,
  hasAssignTeamMemberAuthorization,
} = useActiveTeamActionsVisible()
// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectUsers.value?.length > 0
})
const hasOwnerInclude = computed(() => {
  return selectUsers.value?.some((item) => item.type === TEAM_MEMBER_TYPE.OWNER)
})

const disableManipulationOwnerAction = computed(() => {
  return !isMainAccount.value && hasOwnerInclude.value
})
</script>
