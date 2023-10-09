<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      v-if="isSelectedUser && hasDeleteProjectMemberAuthorization"
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
      v-if="isSelectedUser && hasAssignProjectMemberAuthorization"
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
      v-if="hasAddProjectMemberAuthorization"
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
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useProjectMembers } from 'src/pages/project-management/hooks/use-members'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { PROJECT_MEMBER_TYPE } from 'src/core/types/project-member-types'

// composables
const $q = useQuasar()
const { isMainAccount } = storeToRefs(useAuthStore())
const { selectUsers, onAddNewMember, onAssignRole, onDeleteMembers } =
  useProjectMembers()
const {
  hasAddProjectMemberAuthorization,
  hasDeleteProjectMemberAuthorization,
  hasAssignProjectMemberAuthorization,
} = useActiveProjectActionsVisible()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectUsers.value?.length > 0
})

const hasOwnerInclude = computed(() => {
  return selectUsers.value?.some(
    (item) => item.type === PROJECT_MEMBER_TYPE.OWNER
  )
})

const disableManipulationOwnerAction = computed(() => {
  return !isMainAccount.value && hasOwnerInclude.value
})
</script>
