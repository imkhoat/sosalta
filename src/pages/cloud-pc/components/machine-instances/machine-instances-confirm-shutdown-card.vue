<template>
  <q-card class="machine-instances-confirm-shutdown-card">
    <q-form
      ref="machineInstancesConfirmShutdownCard"
      no-error-focus
      :autofocus="false"
      @submit="onShutdownInstance"
    >
      <q-card-section>
        <q-section-header
          title="Shutdown confirm"
          sub-title="Shutdown & Save Current Machine As An Image"
        ></q-section-header>
      </q-card-section>

      <q-card-section>
        <span class="text-caption text-disable">Instance information</span>
        <div class="row no-wrap q-mt-sm">
          <div class="col-12">
            <q-list
              bordered
              separator
              class="rounded-borders"
            >
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_badge"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Instance Name</q-item-label>
                  <q-item-label>{{ item?.instanceName }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_nature"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Instance ID</q-item-label>
                  <q-item-label>{{ item?.machineInstanceId }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_manage_accounts"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Launched by</q-item-label>
                  <q-item-label>{{ item?.createdBy }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_timer"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Duration</q-item-label>
                  <q-item-label>{{ item?.duration }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_calendar_month"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Submitted On</q-item-label>
                  <q-item-label>{{ item?.startTimeString }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_paid"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Cost</q-item-label>
                  <q-item-label>${{ item?.totalCost }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="column justify-start items-stretch q-px-sm">
        <span class="q-pl-sm text-caption text-disable"
          >Data Storage Information</span
        >
        <div class="q-px-md q-py-sm bg-grey-1 rounded-borders">
          <p class="text-caption q-mb-none">
            Data stored at mounting point:
            <span class="font-courier text-weight-bold">{{
              item?.config?.mountPoint
            }}</span>
            will be save back to:
            <span class="font-courier text-weight-bold">{{
              item?.driveName
            }}</span>
          </p>
        </div>
        <q-alert
          type="warning"
          class="q-my-md"
        >
          <q-chip
            size="sm"
            square
            class="no-border-radius"
            >Warning:</q-chip
          >
          Files with the same file name and path will be overwritten, this may
          lead to data loss! So please double check before shutting down this
          instance.
        </q-alert>
      </q-card-section>
      <q-card-section class="column justify-start items-stretch">
        <span class="text-caption text-disable">Image information</span>
        <q-checkbox
          id="machine-instances-confirm-shutdown-card__save-as-image"
          v-model="form.saveAsImage"
          label=" Save current machine as an image"
        ></q-checkbox>
        <template v-if="form.saveAsImage">
          <q-card-section class="q-px-xs">
            <q-input
              id="machine-instances-confirm-shutdown-card__name"
              label="New Image Name"
              outlined
              dense
              stack-label
              lazy-rules
              hide-bottom-space
              v-bind="$attrs"
              :model-value="form?.imageName"
            ></q-input>
            <q-field
              id="machine-instances-confirm-shutdown-card__type"
              outlined
              dense
              label="Save To"
              stack-label
              class="q-my-md"
            >
              <template v-slot:control>
                <div
                  class="row justify-end items-center full-width q-gutter-x-sm"
                >
                  <q-radio
                    v-model="form.type"
                    dense
                    :val="MACHINE_TYPE.PRIVATE"
                    label="Private Images"
                    size="xs"
                  />
                  <q-radio
                    v-model="form.type"
                    dense
                    :val="MACHINE_TYPE.TEAM"
                    label="Team Images"
                    size="xs"
                  />
                </div>
              </template>
            </q-field>
            <q-select
              v-if="!isSaveToPrivate"
              id="machine-instances-confirm-shutdown-card__team"
              label="Teams"
              stack-label
              :disable="isSaveToPrivate"
              :readonly="isSaveToPrivate"
              :class="{ 'bg-grey-1': isSaveToPrivate }"
              outlined
              dense
              lazy-rules
              emit-value
              map-options
              :options="teamOptions"
              hide-bottom-space
              v-bind="$attrs"
              v-model="form.groupId"
            ></q-select>
          </q-card-section>
        </template>
      </q-card-section>
      <q-card-section
        v-if="form.saveAsImage"
        class="q-px-sm"
      >
        <q-expansion-item
          v-model="formOptions.imageInformationExpand"
          expand-icon-toggle
          class="bg-grey-1 rounded-borders"
          :header-class="{ 'bg-grey-1': formOptions.imageInformationExpand }"
        >
          <template v-slot:header>
            <div class="row justify-start items-center full-width">
              <span class="text-caption text-disable block"
                >New Image Settings & Information</span
              >
              <q-btn
                v-if="formOptions.imageInformationExpand"
                flat
                round
                rounded
                size="sm"
                color="primary"
                icon="sym_o_edit"
                class="q-px-sm"
                @click="onToggleEditImageInformation"
              ></q-btn>
            </div>
          </template>
          <q-card-section class="bg-grey-1 row q-col-gutter-sm">
            <div class="col-12">
              <q-input
                id="machine-instances-confirm-shutdown-card__image-information"
                label="Image Information"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                autogrow
                lazy-rules
                type="textarea"
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.imageInformation"
              ></q-input>
            </div>
            <div class="col-4">
              <q-input
                id="machine-instances-confirm-shutdown-card__cpu"
                label="Minimal CPU Number"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.machineConfiguration.cpu"
              ></q-input>
            </div>
            <div class="col-4">
              <q-input
                id="machine-instances-confirm-shutdown-card__ram"
                label="Minimal RAM (MB)"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.machineConfiguration.memory"
              ></q-input>
            </div>
            <div class="col-4">
              <q-input
                id="machine-instances-confirm-shutdown-card__drive-size"
                label="Root Drive Size (GB)"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.rootDriveSize"
              ></q-input>
            </div>
            <div class="col-6">
              <q-input
                id="machine-instances-confirm-shutdown-card__port"
                :label="`Default ${form?.machineConfiguration?.method} Access Port`"
                prefix="hostname:"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.machineConfiguration.port"
              ></q-input>
            </div>
            <div class="col-6">
              <q-input
                id="machine-instances-confirm-shutdown-card__port2"
                :label="`Default ${form?.machineConfiguration?.method2} Access Port`"
                prefix="IP Address:"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.machineConfiguration.port2"
              >
              </q-input>
            </div>
          </q-card-section>
          <q-card-section class="bg-grey-1 row q-col-gutter-sm">
            <div class="col-12">
              <q-input
                id="machine-instances-confirm-shutdown-card__mount-point"
                label="Default Data Drive Mounting Point"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.machineConfiguration.mountPoint"
              ></q-input>
            </div>
            <div class="col-12">
              <q-input
                id="machine-instances-confirm-shutdown-card__url"
                label="Default Web URL Path"
                stack-label
                prefix="hostname:port"
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                lazy-rules
                hide-bottom-space
                v-bind="$attrs"
                v-model="form.machineConfiguration.urlPath"
              >
              </q-input>
            </div>
          </q-card-section>
          <q-card-section class="bg-grey-1 row q-col-gutter-sm">
            <div class="col-12">
              <q-select
                id="machine-instances-confirm-shutdown-card__keywords"
                label="Keywords"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                autogrow
                lazy-rules
                type="textarea"
                hide-bottom-space
                v-bind="$attrs"
                use-chips
                multiple
                use-input
                new-value-mode="add-unique"
                v-model="form.keyWords"
              ></q-select>
            </div>
            <div class="col-12">
              <q-tag-input
                id="machine-instances-confirm-shutdown-card__tags"
                label="Tags"
                stack-label
                :class="{ 'bg-white': !isImageInformationReadOnly }"
                :disable="isImageInformationReadOnly"
                :readonly="isImageInformationReadOnly"
                outlined
                dense
                autogrow
                lazy-rules
                type="textarea"
                hide-bottom-space
                v-bind="$attrs"
                use-chips
                multiple
                use-input
                v-model="form.machineImageTagEntity"
              ></q-tag-input>
            </div>
          </q-card-section>
        </q-expansion-item>
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-px-md q-pb-md"
      >
        <q-form-actions :actions="formActions"></q-form-actions>
      </q-card-actions>
    </q-form>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, reactive, ref } from 'vue'
import useRules from 'src/core/composables/use-rules'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useQuasar } from 'quasar'
import { MachineInstanceDetail } from 'src/core/types/machine-instance-types'
import { MACHINE_TYPE } from 'src/core/types/machine-image-types'
import { useCloudPCMachineInstances } from '../../hooks/use-machine-instances'
import { ShutdownMachineInstanceRequest } from 'src/core/types/services/machine-types'
interface ShutdownMachineInstanceForm extends ShutdownMachineInstanceRequest {
  machineImageTagEntity: { key: string; value: string }[]
}
// props & emits
const emits = defineEmits(['close', 'refresh'])
const props = defineProps<{
  userName: string
  item: MachineInstanceDetail | null | undefined
}>()

// composables
const $q = useQuasar()
const { t } = useI18n()

const { loading, handleGetListTeamGroup, handleShutdownInstance } =
  useCloudPCMachineInstances()

const { requiredRules } = useRules()

// data
const formOptions = reactive({
  editImageInformation: false,
  imageInformationExpand: false,
})
const form = ref<ShutdownMachineInstanceForm>(generateDefaultValue())
const rules = reactive({
  newName: requiredRules,
})
const teams = ref<{ groupId: string; groupName: string }[]>([])
const machineInstancesConfirmShutdownCard = ref<
  (HTMLElement & { validate: () => boolean }) | null
>(null)

// computed
const teamOptions = computed(() => {
  return (
    teams.value?.map((item) => {
      return { label: item.groupName, value: item?.groupId }
    }) ?? []
  )
})
const isSaveToPrivate = computed(() => {
  return form.value.type === MACHINE_TYPE.PRIVATE
})
const isImageInformationReadOnly = computed(() => {
  return !formOptions.editImageInformation
})
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      class: 'col-grow bg-grey-1',
      action: onClose,
    },
    {
      mode: 'submit',
      color: 'negative',
      unelevated: true,
      name: t('textActions.Confirm shutdown'),
      class: 'col-grow',
      loading: loading.value,
    },
  ]
})

// methods
function generateDefaultValue() {
  return {
    machineInstanceId: props.item?.machineInstanceId,
    saveAsImage: false,
    imageName: props.item?.imageName,
    imageInformation: props.item?.imageInformation,
    keyWords: [],
    machineImageTagEntity: [],
    type: MACHINE_TYPE.PRIVATE,
    groupId: '',
    machineConfiguration: {
      cpu: props.item?.config?.cpu,
      memory: props.item?.config?.memory,
      port: props.item?.config?.port,
      port2: props.item?.config?.port2,
      urlPath: props.item?.config?.urlPath,
      mountPoint: props.item?.config?.mountPoint,
      method: props.item?.config?.method,
      method2: props.item?.config?.method2,
      version: props.item?.config?.version,
    },
    rootDriveSize: props.item?.rootDriveSize,
  } as ShutdownMachineInstanceForm
}
function onClose() {
  emits('close')
}

async function onFetchListTeamGroup() {
  teams.value = await handleGetListTeamGroup()
}

function onToggleEditImageInformation() {
  formOptions.editImageInformation = !formOptions.editImageInformation
  if (!formOptions.editImageInformation) {
  }
}

async function onShutdownInstance() {
  const payload = {
    ...form.value,
    machineImageTagEntity: form.value?.machineImageTagEntity.map((item) => {
      return { amiKey: item.key, amiValue: item.value }
    }),
  } as ShutdownMachineInstanceRequest

  const result = await handleShutdownInstance(payload)
  if (result) {
    emits('refresh')
    emits('close')
  }
}

onMounted(() => {
  onFetchListTeamGroup()
})
</script>
<style lang="scss">
.machine-instances-confirm-shutdown-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
