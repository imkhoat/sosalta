<template>
  <q-card class="team-management-delete-card">
    <q-card-section>
      <q-section-header
        title="Delete team"
        sub-title="Check team name and click confirm button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p
        class="q-mb-sm"
        v-html="deleteAlertMessage"
      ></p>
      <q-alert type="warning"
        >Note: Before deleting a team, please check whether all files in the
        group have been deleted。</q-alert
      >
    </q-card-section>
    <q-card-section class="column justify-start items-stretch bg-grey-1">
      <span class="text-caption text-disable">Delete below teams</span>
      <q-checkbox
        v-for="(team, index) in removeTeams"
        :key="index + '__team-management-delete-card'"
        :model-value="true"
        :label="team?.groupName"
        readonly
        disable
      ></q-checkbox>
    </q-card-section>
    <q-card-actions align="right">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Team } from 'src/core/types/team-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { useActiveTeamActionsVisible } from 'src/pages/team-management/hooks/authorization/use-team-actions-visible'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  deleteType: 'DELETE_TEAM_MODAL' | 'DELETE_TEAMS_MODAL'
  user?: Team | null
}>()

// composables
const { t } = useI18n()
const {
  handleDeleteActiveTeam,
  handleDeleteSelectedTeam,
  loading,
  activeTeam,
  selectTeams,
} = useTeams()
const { hasDeleteTeamAuthorization } = useActiveTeamActionsVisible()

// computed
const removeTeams = computed(() => {
  return props.deleteType === 'DELETE_TEAMS_MODAL'
    ? selectTeams.value
    : [activeTeam.value]
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
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Confirm'),
      action: onDeleteObject,
      disable: !hasDeleteTeamAuthorization.value,
      loading: loading.value,
    },
  ]
})

const deleteAlertMessage = computed(() => {
  if (props.deleteType === 'DELETE_TEAM_MODAL') {
    return `Do you want to delete <span class="text-weight-bold text-negative">${activeTeam.value?.groupName}</span> team?`
  } else {
    return `Do you want to delete those <span class="text-weight-bold text-negative">${selectTeams.value?.length}</span> teams?`
  }
})

// methods
function onClose() {
  emits('close')
}

async function onDeleteObject() {
  try {
    let result: boolean | undefined = false
    if (props.deleteType === 'DELETE_TEAMS_MODAL') {
      result = await handleDeleteSelectedTeam()
    } else {
      result = await handleDeleteActiveTeam()
    }
    if (result) {
      emits('refresh')
      emits('close')
    }
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.team-management-delete-card {
  min-width: 300px;
}
</style>
