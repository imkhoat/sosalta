<template>
  <q-card class="project-management-rename-card">
    <q-form
      ref="projectManagementRenameCard"
      no-error-focus
      :autofocus="false"
      @submit="onRenameProject"
    >
      <q-card-section>
        <q-section-header
          title="Change project name"
          sub-title="Input new name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="project-name"
          label="New project name"
          stack-label
          outlined
          dense
          :rules="rules.newName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="form.name"
          class="q-mb-md"
        ></q-input>
        <q-input
          id="project-description"
          label="Project description"
          stack-label
          outlined
          dense
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="form.projectDescription"
          class="q-mb-md"
        ></q-input>
        <q-select
          id="project-keywords"
          label="Keywords"
          stack-label
          outlined
          dense
          v-model="form.keyWords"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          hide-bottom-space
          input-debounce="0"
          class="q-mb-md"
          new-value-mode="add-unique"
        >
          <template #selected-item="scope">
            <q-chip
              removable
              dense
              square
              @remove="scope.removeAtIndex(scope.index)"
              :tabindex="scope.tabindex"
              icon-remove="delete"
              class="text-caption q-ma-none q-mr-xs q-mt-xs"
              >{{ scope.opt }}</q-chip
            >
          </template>
        </q-select>
        <q-field
          id="project-tags"
          label="Tags"
          stack-label
          outlined
          dense
        >
          <div class="column justify-start items-stretch q-pa-sm">
            <div class="row justify-start items-center q-gutter-x-xs q-mb-md">
              <q-chip
                v-for="(tag, index) in form.projectProperties"
                :key="index"
                removable
                dense
                square
                @remove="onRemoveProperties(tag)"
                :tabindex="index"
                icon-remove="delete"
                class="text-caption q-ma-none q-mr-xs q-mt-xs"
                >{{ `${tag.ppKey}<>${tag.ppValue}` }}</q-chip
              >
            </div>
            <div
              class="row justify-between items-center q-gutter-x-xs no-wrap bg-grey-1"
            >
              <q-input
                id="key-name"
                placeholder="Key..."
                stack-label
                outlined
                dense
                lazy-rules
                class="bg-grey-2"
                hide-bottom-space
                v-bind="$attrs"
                v-model="property.key"
              ></q-input>
              <q-input
                id="value-name"
                placeholder="Value..."
                stack-label
                outlined
                dense
                lazy-rules
                class="bg-grey-2"
                hide-bottom-space
                v-bind="$attrs"
                v-model="property.value"
              ></q-input>
              <q-btn
                size="md"
                unelevated
                color="primary"
                icon="sym_o_add"
                @click="onCreateNewProperty"
              ></q-btn>
            </div>
          </div>
        </q-field>
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
import { Project } from 'src/core/types/project-types'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  projectId: string | undefined
}>()

// composables
const { t } = useI18n()
const { requiredRules } = useRules()
const {
  handleChangeProjectName,
  handleChangeProjectProperties,
  loading,
  activeProject,
} = useProjects()
const { hasEditProjectNameAuthorization } = useActiveProjectActionsVisible()

// data
const form = reactive({
  name: activeProject?.value?.projectName,
  keyWords: activeProject.value?.keyWords,
  projectDescription: activeProject.value?.projectDescription,
  projectProperties: [...activeProject.value?.projectProperties],
})
const previosForm = reactive({
  name: activeProject?.value?.projectName,
  keyWords: activeProject.value?.keyWords,
  projectDescription: activeProject.value?.projectDescription,
  projectProperties: [...activeProject.value?.projectProperties],
})
const rules = reactive({
  newName: requiredRules,
})
const property = reactive({
  key: '',
  value: '',
})
const projectManagementRenameCard = ref<
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
      name: t('textActions.Save'),
      disable: !hasEditProjectNameAuthorization.value,
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

function onRemoveProperties(tag: {
  id: string
  projectId: string
  ppKey: string
  ppValue: string
}) {
  form.projectProperties = form.projectProperties.filter(
    (item) => item.ppKey === tag.ppKey
  )
}

function onCreateNewProperty() {
  form.projectProperties.push({
    id: '',
    projectId: props.projectId ?? '',
    ppKey: property.key,
    ppValue: property.value,
  })
}
async function onRenameProject() {
  try {
    const valid: boolean | undefined =
      await projectManagementRenameCard?.value?.validate()
    if (!valid || !activeProject.value) return

    const params: Project = {
      ...activeProject.value,
      ...form,
    } as Project
    const response = await handleChangeProjectName(params)

    if (
      JSON.stringify(form.projectProperties) !==
      JSON.stringify(previosForm.projectProperties)
    ) {
      console.log('onRenameProject')
      await handleChangeProjectProperties(params)
    }
    if (response) {
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
.project-management-rename-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
