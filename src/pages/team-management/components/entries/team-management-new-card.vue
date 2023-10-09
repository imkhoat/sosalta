<template>
  <q-card class="team-management-new-card">
    <q-form
      ref="teamManagementCreateCard"
      no-error-focus
      :autofocus="false"
      @submit="onCreateNewTeam"
    >
      <q-card-section>
        <q-section-header
          title="Create new team"
          sub-title="Input name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="team-name"
          label="Team name"
          stack-label
          outlined
          dense
          :rules="rules.newName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="form.name"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useTeams } from 'src/pages/team-management/hooks/use-teams'
import { useActiveTeamActionsVisible } from '../../hooks/authorization/use-team-actions-visible'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { handleCreateNewTeam, loading } = useTeams()
const { requiredRules } = useRules()
const { hasCreateTeamAuthorization } = useActiveTeamActionsVisible()

// data
const form = reactive({
  name: '',
})
const rules = reactive({
  newName: requiredRules,
})
const teamManagementCreateCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'primary',
      flat: true,
      name: t('textActions.Create'),
      disable: !hasCreateTeamAuthorization.value,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onCreateNewTeam() {
  try {
    const valid: boolean | undefined =
      await teamManagementCreateCard?.value?.validate()
    if (!valid) return

    await handleCreateNewTeam(form.name)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.team-management-new-card {
  min-width: 300px;
}
</style>
