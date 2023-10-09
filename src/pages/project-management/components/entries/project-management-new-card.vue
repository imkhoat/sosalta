<template>
  <q-card class="project-management-new-card">
    <q-form
      ref="projectManagementCreateCard"
      no-error-focus
      :autofocus="false"
      @submit="onCreateNewProject"
    >
      <q-card-section>
        <q-section-header
          title="Create new project"
          sub-title="Input name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="project-name"
          label="Project name"
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
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const { handleCreateNewProject, loading } = useProjects()
const { hasCreateProjectAuthorization } = useActiveProjectActionsVisible()

// data
const form = reactive({
  name: '',
})
const rules = reactive({
  newName: requiredRules,
})
const projectManagementCreateCard = ref<
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
      disable: !hasCreateProjectAuthorization.value,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onCreateNewProject() {
  try {
    const valid: boolean | undefined =
      await projectManagementCreateCard?.value?.validate()
    if (!valid) return

    await handleCreateNewProject(form.name)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.project-management-new-card {
  min-width: 300px;
}
</style>
