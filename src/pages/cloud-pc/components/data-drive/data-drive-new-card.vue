<template>
  <q-card class="cloudpc-data-drive-new-card">
    <q-form
      ref="dataDrivesCreateCard"
      no-error-focus
      :autofocus="false"
      @submit="onCreateNewDataDrive"
    >
      <q-card-section>
        <q-section-header
          title="Create new data drive"
          sub-title="Input name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="data-drive-name"
          label="Data drive name"
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
import { useCloudPCDataDrives } from 'src/pages/cloud-pc/hooks/use-data-drive'
import { useQuasar } from 'quasar'

// props & emits
const emits = defineEmits(['close', 'rename', 'refresh'])
const props = defineProps<{
  userName: string
}>()
// composables
const $q = useQuasar()
const { t } = useI18n()
const { handleCreateNewDataDrive, handleCheckDataDriveName, loading } =
  useCloudPCDataDrives()
const { requiredRules } = useRules()

// data
const form = reactive({
  name: '',
})
const rules = reactive({
  newName: requiredRules,
})
const dataDrivesCreateCard = ref<
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

async function onCreateNewDataDrive() {
  try {
    const valid: boolean | undefined =
      await dataDrivesCreateCard?.value?.validate()
    if (!valid) return

    const nameValid = await handleCheckDataDriveName(form.name, props.userName)

    if (!nameValid) {
      $q.notify({
        message: 'Name invalid',
        type: 'negative',
      })
      return
    }

    const result = await handleCreateNewDataDrive(form.name, props.userName)
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
.cloudpc-data-drive-new-card {
  min-width: 300px;
}
</style>
