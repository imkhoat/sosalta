<template>
  <q-card class="notepage-management-rename-card">
    <q-form
      ref="projectManagementRenameCard"
      no-error-focus
      :autofocus="false"
      @submit="onRenameProjectNotepage"
    >
      <q-card-section>
        <q-section-header
          title="Change notepage name"
          sub-title="Input new name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="notepage-name"
          label="New notepage name"
          stack-label
          outlined
          dense
          :rules="rules.newName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="form.pageName"
          class="q-mb-md"
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
import { Notepage } from 'src/core/types/notepage-types'

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  projectId: string | undefined | number
}>()

// composables
const { t } = useI18n()
const { handleChangeNotepageName, loading, activeNotepage } =
  useProjectNotepages()
const { requiredRules } = useRules()

// data
const form = reactive({
  pageName: activeNotepage?.value?.pageName,
})
const rules = reactive({
  newName: requiredRules,
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
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onRenameProjectNotepage() {
  try {
    const valid: boolean | undefined =
      await projectManagementRenameCard?.value?.validate()
    if (!valid || !activeNotepage.value) return

    const params: Notepage = {
      ...activeNotepage.value,
      ...form,
    } as Notepage
    const response = await handleChangeNotepageName(params)

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
.notepage-management-rename-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
