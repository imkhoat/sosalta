<template>
  <q-card class="project-management-delete-card">
    <q-card-section>
      <q-section-header
        title="Delete project"
        sub-title="Check project name and click confirm button"
      ></q-section-header>
    </q-card-section>
    <q-card-section>
      <p
        class="q-mb-sm"
        v-html="deleteAlertMessage"
      ></p>
      <q-alert type="warning"
        >Note: all the project files and notepages in a project must be removed
        before this project can be deleted.</q-alert
      >
    </q-card-section>

    <q-card-section class="column justify-start items-stretch bg-grey-1">
      <span class="text-caption text-disable">Delete below projects</span>
      <q-checkbox
        v-for="(team, index) in removeProjects"
        :key="index + '__project-management-delete-card'"
        :model-value="true"
        :label="team?.projectName"
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
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { Project } from 'src/core/types/project-types'
import { useActiveProjectActionsVisible } from '../../hooks/authorization/use-project-actions-visible'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])

const props = defineProps<{
  deleteType: 'DELETE_PROJECT_MODAL' | 'DELETE_PROJECTS_MODAL'
  user?: Project | null
}>()

// composables
const { t } = useI18n()
const {
  loading,
  activeProject,
  selectProjects,
  handleDeleteActiveProject,
  handleDeleteSelectedProjects,
} = useProjects()
const { hasDeleteProjectAuthorization } = useActiveProjectActionsVisible()

// computed
const removeProjects = computed(() => {
  return props.deleteType === 'DELETE_PROJECTS_MODAL'
    ? selectProjects.value
    : [activeProject.value]
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
      disable: !hasDeleteProjectAuthorization.value,
      loading: loading.value,
    },
  ]
})

const deleteAlertMessage = computed(() => {
  if (props.deleteType === 'DELETE_PROJECT_MODAL') {
    return `Do you want to delete <span class="text-weight-bold text-negative">${activeProject.value?.projectName}</span> project?`
  } else {
    return `Do you want to delete those <span class="text-weight-bold text-negative">${selectProjects.value?.length}</span> projects?`
  }
})

// methods
function onClose() {
  emits('close')
}

async function onDeleteObject() {
  try {
    let result: boolean | undefined = false
    if (props.deleteType === 'DELETE_PROJECTS_MODAL') {
      result = await handleDeleteSelectedProjects()
    } else {
      result = await handleDeleteActiveProject()
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
.project-management-delete-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
