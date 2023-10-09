<template>
  <q-card class="project-notepages-new-card">
    <q-form
      ref="projectNotepagesCreateCard"
      no-error-focus
      :autofocus="false"
      @submit="onCreateNewNotepage"
    >
      <q-card-section>
        <q-section-header
          title="Create new notepage"
          sub-title="Input name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="notepage-name"
          label="Notepages name"
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
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  projectId: string | number
}>()
// composables
const { t } = useI18n()
const { handleCreateNewNotepage, loading } = useProjectNotepages()
const { requiredRules } = useRules()

// data
const form = reactive({
  name: '',
})
const rules = reactive({
  newName: requiredRules,
})
const projectNotepagesCreateCard = ref<
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
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onCreateNewNotepage() {
  try {
    const valid: boolean | undefined =
      await projectNotepagesCreateCard?.value?.validate()
    if (!valid) return

    await handleCreateNewNotepage(form.name, props.projectId)
    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.project-notepages-new-card {
  min-width: 300px;
}
</style>
