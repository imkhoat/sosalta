<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      v-if="isSelectedUser && hasAssignMemberAuthorization"
      outline
      unelevated
      color="primary"
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
      v-if="hasCreateMemberAuthorization"
      push
      color="primary"
      @click="onCreateNewUser"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'New member' : 'Create new member' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useMemberSettings } from 'src/pages/member-users/hooks/use-member-settings'
import { useActiveMemberActionsVisible } from 'src/pages/member-users/hooks/use-member-actions-visible'

const $q = useQuasar()
const { selectUsers, onCreateNewUser, onAssignRole } = useMemberSettings()
const { hasCreateMemberAuthorization, hasAssignMemberAuthorization } =
  useActiveMemberActionsVisible()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectUsers.value?.length > 0
})
</script>
