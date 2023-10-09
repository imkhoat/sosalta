<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      v-if="isSelectedUser && hasTeamDeleteActionVisible"
      outline
      unelevated
      color="primary"
      @click="onDeleteTeams"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
        class="q-mr-xs"
      ></q-icon
      >Delete teams
    </q-btn>
    <q-btn
      v-if="hasTeamCreateActionVisible"
      push
      color="primary"
      @click="onCreateNewTeam"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'New team' : 'Create new team' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { useMenusVisible } from 'src/pages/team-management/hooks/authorization/use-menus-visible'

// composables
const $q = useQuasar()
const { hasTeamCreateActionVisible, hasTeamDeleteActionVisible } =
  useMenusVisible()
const { onCreateNewTeam, onDeleteTeams, selectTeams } = useTeams()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectTeams.value?.length > 0
})
</script>
