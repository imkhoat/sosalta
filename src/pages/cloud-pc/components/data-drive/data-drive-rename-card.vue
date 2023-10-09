<template>
  <q-card class="data-drive-rename-card">
    <q-form
      ref="dataDriveRenameCard"
      no-error-focus
      :autofocus="false"
      @submit="onRenameDataDrive"
    >
      <q-card-section>
        <q-section-header
          title="Change data drive name"
          sub-title="Input new name and click save button"
        ></q-section-header>
      </q-card-section>
      <q-card-section>
        <q-input
          id="data-drive-name"
          label="New data drive name"
          stack-label
          outlined
          dense
          :rules="rules.newName"
          lazy-rules
          hide-bottom-space
          v-bind="$attrs"
          v-model="form.driveName"
          class="q-mb-sm"
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
import { useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { errorHandler } from 'src/core/utils/error-handler'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useCloudPCDataDrives } from 'src/pages/cloud-pc/hooks/use-data-drive'

// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  userName: string
}>()
// composables
const $q = useQuasar()
const { t } = useI18n()
const { requiredRules } = useRules()
const {
  handleChangeDataDriveName,
  loading,
  activeDataDrive,
  handleCheckDataDriveName,
} = useCloudPCDataDrives()

// data
const form = reactive({
  driveName: activeDataDrive?.value?.driveName,
})
const rules = reactive({
  newName: requiredRules,
})
const dataDriveRenameCard = ref<
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

async function onRenameDataDrive() {
  try {
    const valid: boolean | undefined =
      await dataDriveRenameCard?.value?.validate()
    if (!valid || !activeDataDrive.value) return

    const nameValid = await handleCheckDataDriveName(
      form.driveName,
      props.userName
    )

    if (!nameValid) {
      $q.notify({
        message: 'Name invalid',
        type: 'negative',
      })
      return
    }

    const response = await handleChangeDataDriveName(
      activeDataDrive?.value?.dataDriveId,
      form.driveName
    )

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
.data-drive-rename-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
