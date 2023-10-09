<template>
  <q-card class="machine-images-launch-card">
    <q-form
      ref="machineImagesLaunchCardRef"
      no-error-focus
      :autofocus="false"
      @submit="onLaunchNewMachineInstance"
    >
      <q-card-section>
        <q-section-header
          title="Launch Cloud PC"
          sub-title="Select Cloud PC hardware and start"
        ></q-section-header>
      </q-card-section>
      <q-card-section class="bg-grey-1 column">
        <span class="text-caption text-disable"
          >You are going to use the following image to start an instance:</span
        >
        <q-card
          flat
          class="q-mb-md"
        >
          <q-card-section>
            <div class="row justify-start items-center no-wrap q-mb-md">
              <q-avatar
                size="32px"
                color="grey-1"
              >
                <q-avatar
                  size="24px"
                  color="grey-3"
                >
                  <span class="text-caption text-weight-bold text-disable">{{
                    item.id
                  }}</span>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong>{{ item.imageName }} </strong>
                <q-chip
                  dense
                  flat
                  class="bg-grey-1 text-primary text-caption q-px-sm q-ma-none"
                  >Type: {{ item.type }} machine</q-chip
                >
              </div>
            </div>
            <div class="text-caption rounded-borders q-pa-md bg-grey-1">
              {{ item?.imageInformation }}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section>
        <span class="text-caption text-disable"
          >Machine instance information:</span
        >
        <q-card flat>
          <q-card-section v-if="serverErrors.active || serverErrors.unpaidBill">
            <q-alert
              v-if="serverErrors.active"
              type="negative"
            >
              <q-chip
                size="sm"
                color="negative"
                square
                class="no-border-radius"
                >Error</q-chip
              >
              {{ serverErrors.active }}
            </q-alert>
            <q-alert
              v-if="serverErrors.unpaidBill"
              type="negative"
            >
              <q-chip
                size="sm"
                color="negative"
                square
                class="no-border-radius"
                >Error</q-chip
              >
              {{ serverErrors.unpaidBill }}
            </q-alert>
          </q-card-section>
          <q-card-section class="row">
            <div class="col-12 q-mb-md">
              <l-type-input
                id="instance-options"
                label="Cloud PC Hardware Spec"
                :max-cloudpc-hourly-charge="
                  instanceLimit?.maxCloudpcHourlyCharge ?? -1
                "
                :options="instanceTypeOptions"
                :error="!!serverErrors?.hardware"
                :rules="rules.type"
                :loading="formLoading.type"
                :error-message="serverErrors?.hardware"
                v-model="form.type"
              ></l-type-input>
            </div>
            <div class="col-12 q-mb-md">
              <l-data-drive-input
                id="drive-options"
                :options="instanceDataDriveOptions"
                :rules="rules.dataDrive"
                :loading="formLoading.dataDrive"
                v-model="form.dataDrive"
              ></l-data-drive-input>
            </div>
            <div class="col-12 q-mb-md">
              <q-input
                id="drive-size"
                label="Data Drive instance size (GB)"
                stack-label
                outlined
                dense
                :rules="rules.dataDriveSize"
                type="number"
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                :error="!!serverErrors?.dataDriveLimit"
                :error-message="serverErrors?.dataDriveLimit"
                :min="0"
                v-model="form.dataDriveSize"
              >
                <template #append>
                  <span class="text-caption text-disable">GB</span>
                  <q-btn
                    flat
                    round
                    size="sm"
                    class="text-normal text-warning"
                  >
                    <q-icon name="sym_o_info"></q-icon>
                    <q-tooltip max-width="480px">
                      The instance size for this Data Drive must be larger than
                      the total files in the Data Drive.
                    </q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
            <div class="col-5 q-mb-md q-pr-xs">
              <q-select
                id="root-drive-size-options"
                label="System Drive size"
                stack-label
                outlined
                dense
                :options="systemDriveSizeOptions"
                option-value="value"
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.defaultRootDriveSize"
                @update:model-value="onChangeDefaultRootDriveSize"
              ></q-select>
            </div>
            <div class="col-7 q-mb-md">
              <q-input
                id="root-drive-size"
                :readonly="isDefaultSystemDriveSize"
                :disabled="isDefaultSystemDriveSize"
                stack-label
                outlined
                dense
                :rules="rules.rootDriveSize"
                type="number"
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                :error="!!serverErrors?.systemDriveLimit"
                :min="0"
                :error-message="serverErrors?.systemDriveLimit"
                v-model="form.rootDriveSize"
              >
                <template #append>
                  <span class="text-caption text-disable">GB</span>
                  <q-btn
                    flat
                    round
                    size="sm"
                    class="text-normal text-warning"
                  >
                    <q-icon name="sym_o_info"></q-icon>
                    <q-tooltip max-width="480px">
                      The System Drive size must be large enough to contain the
                      image, e.g., its operating system, and the software
                      installed (or to be installed).
                    </q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
            <div class="col-12 q-mb-md">
              <q-input
                id="cloud-pc-name"
                label="Cloud PC Name"
                stack-label
                outlined
                dense
                :rules="rules.instanceName"
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.instanceName"
              ></q-input>
            </div>
            <div class="col-12 q-mb-md">
              <q-select
                id="shutdown-method"
                label="Cloud PC Shutdown Method"
                stack-label
                outlined
                dense
                :rules="rules.timingShutdown"
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                :error="!!serverErrors?.autoShutdown"
                :error-message="serverErrors?.autoShutdown"
                :options="shutdownOptions"
                v-model="form.timingShutdown"
              >
                <template #append>
                  <q-btn
                    flat
                    round
                    size="sm"
                    class="text-normal text-warning"
                  >
                    <q-icon name="sym_o_info"></q-icon>
                    <q-tooltip max-width="480px">
                      Un-paid subscription Main Account's users (its Main
                      Account user and all its Member Account users) can only
                      use the "auto-shutdown" option
                    </q-tooltip>
                  </q-btn>
                </template>
              </q-select>
            </div>
            <div
              v-if="isAutoShutdown"
              class="col-12 q-mb-md"
            >
              <q-input
                id="auto-shutdown-time"
                label="Auto-shutdown time"
                stack-label
                outlined
                dense
                :rules="rules.runningDuration"
                type="number"
                lazy-rules
                hide-bottom-space
                :min="0"
                v-bind="$attrs"
                :error="!!serverErrors?.autoShutdownDuration"
                :error-message="serverErrors?.autoShutdownDuration"
                v-model="form.runningDuration"
              >
                <template #append>
                  <span class="text-caption text-disable">Hours</span>
                </template>
              </q-input>
            </div>
          </q-card-section>
          <q-card-section>
            <q-alert
              type="warning"
              class="q-mb-sm"
            >
              <q-chip
                size="sm"
                square
                class="no-border-radius"
                >Notes</q-chip
              >
              Accounts without a subscription can only use "auto-shutdown".
            </q-alert>
            <q-alert type="positive">
              <q-chip
                size="sm"
                square
                class="no-border-radius"
                >Tips</q-chip
              >
              To save a running Cloud PC as a new Machine Image, please select
              the "Save Image" option when shutting down a running Cloud PC.
            </q-alert>
          </q-card-section>
        </q-card>
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
import { DataDrive } from 'src/core/types/data-drive-types'
import { ActionProp } from 'src/core/types/action-prop-types'
import { MachineImage } from 'src/core/types/machine-image-types'
import {
  MachineInstanceType,
  MachineServerError,
} from 'src/core/types/machine-instance-types'
import { useCloudPCDataDrives } from 'src/pages/cloud-pc/hooks/use-data-drive'
import { MachineInstanceLimit } from 'src/core/types/machine-instance-limit-types'
import { useCloudPCMachineImages } from 'src/pages/cloud-pc/hooks/use-machine-images'
import LTypeInput from 'src/pages/cloud-pc/components/machine-images/launch-form/l-type-input.vue'
import LDataDriveInput from 'src/pages/cloud-pc/components/machine-images/launch-form/l-data-drive-input.vue'
import {
  EstimateLauchCloudPCInstanceRequest,
  LauchCloudPCInstanceRequest,
} from 'src/core/types/services/machine-types'
// props & emits
const emits = defineEmits(['close', 'success', 'refresh'])
const props = defineProps<{
  item: MachineImage
}>()
// composables
const $q = useQuasar()
const { t } = useI18n()
const { requiredRulesWithMessage, integerRulesWithMessage } = useRules()
const { pagination, handleGetCloudPCDataDrives } = useCloudPCDataDrives()
const {
  loading,
  handleCheckAvailableBalance,
  handleLaunchCloudPCInstance,
  handleGetMachineInstanceCount,
  handleGetMachineInstanceLimit,
  handleGetMachineInstanceTypes,
  handleEstimateLaunchCloudPCInstance,
} = useCloudPCMachineImages()

// data
const machineImagesLaunchCardRef = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

const instanceDataDriveOptions = ref<DataDrive[]>()
const instanceTypeOptions = ref<MachineInstanceType[]>([])
const instanceLimit = ref<MachineInstanceLimit>()
const instanceCount = ref<{
  numOfRunningMachineCurrentUser: number
  numOfRunningMachineAllUsers: number
} | null>()

const form = reactive<{
  amiId: string | null
  dataDrive: {
    label: string
    value: string
    description: string
    inactive: boolean
  } | null
  dataDriveSize: number | null
  instanceName: string | null
  rootDriveSize: number | null
  defaultRootDriveSize: { label: string; value: boolean }
  runningDuration: number | undefined
  timingShutdown: { label: string; value: 'true' | 'false' }
  type: {
    label: string
    value: string
    description: string
    inactive: boolean
  } | null
}>({
  amiId: null,
  dataDrive: null,
  dataDriveSize: null,
  instanceName: null,
  rootDriveSize: 16,
  defaultRootDriveSize: { label: 'Default', value: true },
  runningDuration: undefined,
  timingShutdown: { label: 'Auto-shutdown on time', value: 'true' },
  type: null,
})
const serverErrors = ref<MachineServerError>({
  hardware: undefined,
  dataDriveLimit: undefined,
  systemDriveLimit: undefined,
  autoShutdown: undefined,
  autoShutdownDuration: undefined,
  active: undefined,
  unpaidBill: undefined,
})
const formLoading = reactive({
  type: false,
  dataDrive: false,
})
// computed
const isDefaultSystemDriveSize = computed(() => {
  return form.defaultRootDriveSize?.value
})
const isAutoShutdown = computed(() => {
  return form?.timingShutdown?.value === 'true'
})
const systemDriveSizeOptions = computed(() => {
  return [
    { label: 'Default', value: true },
    { label: 'Customize', value: false },
  ]
})
const shutdownOptions = computed(() => {
  return instanceLimit.value?.allowManualShutdownOption === 1
    ? [
        { label: 'Manual shutdown', value: 'false' },
        { label: 'Auto-shutdown on time', value: 'true' },
      ]
    : [{ label: 'Auto-shutdown on time', value: 'true' }]
})

const rules = computed(() => ({
  amiId: requiredRulesWithMessage('Machine type'),
  dataDrive: [
    (
      val: {
        label: string
        value: string
        description: string
        inactive: boolean
      } | null
    ) =>
      (val && val.value.trim().length > 0) || 'You must select a Data Drive.',
  ],
  dataDriveSize: requiredRulesWithMessage(
    'The Data Drive instance size is needed.'
  ),
  instanceName: requiredRulesWithMessage(
    'You must provide a unique Cloud PC name.'
  ),
  rootDriveSize: isDefaultSystemDriveSize.value
    ? []
    : requiredRulesWithMessage('The System Drive instance size is needed.'),
  runningDuration: isAutoShutdown.value
    ? [
        ...requiredRulesWithMessage('You must specify an auto-shutdown time.'),
        ...integerRulesWithMessage(
          'Auto-shutdown time must be a positive integer!'
        ),
      ]
    : [],
  timingShutdown: [
    (
      val: {
        label: string
        value: string
        description: string
        inactive: boolean
      } | null
    ) =>
      (val && val.value.trim().length > 0) || 'Shutdown method field required',
  ],
  type: [
    (
      val: {
        label: string
        value: string
        description: string
        inactive: boolean
      } | null
    ) =>
      (val && val.value.trim().length > 0) ||
      'You must select a hardware spec.',
  ],
}))

const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Cancel'),
      action: onClose,
    },
    {
      mode: 'submit',
      unelevated: true,
      color: 'primary',
      name: t('textActions.Launch'),
      loading: loading.value,
    },
  ]
})

// methods
function onClose() {
  emits('close')
}

async function onLaunchNewMachineInstance() {
  try {
    form.amiId = props.item?.amiId

    const valid: boolean | undefined =
      await machineImagesLaunchCardRef?.value?.validate()
    if (!valid) {
      return
    }

    if (
      !form.amiId ||
      !form.dataDrive?.value ||
      !form.dataDriveSize ||
      !form.instanceName ||
      !form.rootDriveSize ||
      !form.type?.value
    ) {
      $q.notify({
        message: 'Missing required data',
        type: 'negative',
      })
      return
    }

    const payload: LauchCloudPCInstanceRequest = {
      amiId: form.amiId ?? props.item?.amiId,
      dataDriveId: form.dataDrive?.value,
      dataDriveSize: form.dataDriveSize.toString(),
      instanceName: form.instanceName,
      rootDriveSize: form.rootDriveSize,
      timingShutdown: form.timingShutdown?.value,
      type: form.type?.value,
      runningDuration: Number(form.runningDuration),
    }

    const response = await handleEstimateLaunchCloudPCInstance(
      payload as EstimateLauchCloudPCInstanceRequest
    )
    if (response?.result) {
      const launchResult = await handleLaunchCloudPCInstance(payload)
      if (launchResult?.result) {
        $q.notify({
          message: 'Launch Cloud PC success',
          type: 'positive',
        })
        resetServerErrors()
        emits('success', {
          instanceName: form.instanceName,
          dataDriveName: form.dataDrive?.label,
          instanceTypeName: form.type?.label,
        })
      } else {
        serverErrors.value = launchResult?.data as MachineServerError
      }
    } else {
      serverErrors.value.autoShutdownDuration = `Your account's current balance (cash + Atlas OS Coins) is not sufficient to run the specified time.  Your current balance can only run ${response.duration} hours with your selected hardware spec.`
    }
  } catch (error) {
    console.log(error)
  }
}

async function onPreparingData() {
  const validBalance = await handleCheckAvailableBalance()
  if (!validBalance) {
    $q.notify({
      message: 'Not enough balance',
      type: 'negative',
    })
    return
  }

  instanceCount.value = await handleGetMachineInstanceCount()
  instanceLimit.value = await handleGetMachineInstanceLimit()

  toogleFormLoading('type')
  instanceTypeOptions.value = await handleGetMachineInstanceTypes(
    props.item?.amiId
  )
  toogleFormLoading('type')

  toogleFormLoading('dataDrive')
  instanceDataDriveOptions.value = await handleGetCloudPCDataDrives(
    pagination.value,
    undefined,
    undefined,
    0
  )
  toogleFormLoading('dataDrive')
}

function onChangeDefaultRootDriveSize() {
  if (form.defaultRootDriveSize?.value) {
    form.rootDriveSize = 16
  }
}

function resetServerErrors() {
  serverErrors.value = {
    hardware: undefined,
    dataDriveLimit: undefined,
    systemDriveLimit: undefined,
    autoShutdown: undefined,
    autoShutdownDuration: undefined,
    active: undefined,
    unpaidBill: undefined,
  }
}

function toogleFormLoading(property: 'type' | 'dataDrive') {
  formLoading[property] = !formLoading[property]
}
onPreparingData()
</script>
<style lang="scss">
.machine-images-launch-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);

  &__title {
    font-size: 18px;
  }
}
</style>
