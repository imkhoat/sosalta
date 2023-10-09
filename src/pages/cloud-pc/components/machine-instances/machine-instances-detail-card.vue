<template>
  <q-card class="machine-instances-detail-card">
    <q-card-section class="row justify-between items-start">
      <machine-instances-status :item="item"></machine-instances-status>
    </q-card-section>
    <q-card-section class="q-px-none">
      <q-card-section v-if="isLaunching">
        <q-alert
          type="negative"
          class="q-my-md"
        >
          <q-chip
            size="sm"
            square
            class="no-border-radius"
            >Warning:</q-chip
          >
          All Cloud PC instances (Machine Instances) are metered in real-time.
          All non-shutdown (e.g., running or paused) Cloud PC instances will
          incurr cost (paused intances will incurr significantly less, but
          non-zero, cost than running instances). To avoid incurring unnecessary
          cost, please shutdown your Cloud PC instances promptly after use,
          using controls at the bottom of this modal.
        </q-alert>
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
      <q-card-section>
        <span class="text-caption text-disable">Access information</span>
        <p class="text-caption text-disable">
          Temporarily assigned login info (e.g., for SSH login, or Web login):
        </p>
        <q-alert
          type="warning"
          class="q-mb-sm"
        >
          <q-chip
            size="sm"
            square
            class="no-border-radius"
            >Warning</q-chip
          >
          Please keep this login info private!
        </q-alert>
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
                  <q-icon name="sym_o_link"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Instance URL</q-item-label>
                  <q-item-label class="font-courier text-weight-bold"
                    >{{ item?.hostName }}
                    <q-btn
                      flat
                      round
                      size="sm"
                      class="text-normal text-primary"
                      @click="onCopySource(item?.hostName)"
                    >
                      <q-icon name="sym_o_content_copy"></q-icon>
                      <q-tooltip max-width="480px"> Copy URL </q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_account_circle"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Username</q-item-label>
                  <q-item-label class="font-courier text-weight-bold">
                    {{ item?.username }}
                    <q-btn
                      flat
                      round
                      size="sm"
                      class="text-normal text-primary"
                      @click="onCopySource(item?.username)"
                    >
                      <q-icon name="sym_o_content_copy"></q-icon>
                      <q-tooltip max-width="480px"> Copy username </q-tooltip>
                    </q-btn></q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_key"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Password</q-item-label>
                  <q-item-label class="font-courier text-weight-bold">
                    {{ item?.password }}
                    <q-btn
                      flat
                      round
                      size="sm"
                      class="text-normal text-primary"
                      @click="onCopySource(item?.password)"
                    >
                      <q-icon name="sym_o_content_copy"></q-icon>
                      <q-tooltip max-width="480px"> Copy password </q-tooltip>
                    </q-btn></q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div
          v-if="isRunning"
          class="row no-wrap q-mt-sm"
        >
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
                  <q-icon name="sym_o_captive_portal"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption
                    >Web URL:
                    <q-btn
                      flat
                      round
                      size="sm"
                      class="text-normal text-primary"
                    >
                      <q-icon name="sym_o_info"></q-icon>
                      <q-tooltip max-width="480px">
                        You can visit this Cloud PC via the Web URL in a new web
                        browser window, or by clicking the button below. Using
                        HTTPS access is recommended.
                      </q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label
                    class="column justify-start items-start q-gutter-y-xs"
                  >
                    <span class="font-courier text-weight-bold"
                      >{{ item?.hostName }}:{{ item?.config?.port }}/</span
                    >
                    <q-btn
                      unelevated
                      size="sm"
                      color="positive"
                      target="_blank"
                      :href="`https://${item?.hostName}`"
                    >
                      Access with HTTPS
                      <q-icon
                        name="sym_o_tab_move"
                        class="q-ml-xs"
                      ></q-icon>
                      <q-tooltip max-width="480px">
                        Access with HTTPS
                      </q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <div
          v-if="isRunning"
          class="row no-wrap q-mt-sm"
        >
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
                  <q-icon name="sym_o_dns"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption
                    >IP address:
                    <q-btn
                      flat
                      round
                      size="sm"
                      class="text-normal text-primary"
                    >
                      <q-icon name="sym_o_info"></q-icon>
                      <q-tooltip max-width="480px">
                        You can visit this Cloud PC via the IP address in a new
                        web browser window, or by clicking the button below. The
                        HTTPS access mode is not available via IP address.
                      </q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label
                    class="column justify-start items-start q-gutter-y-xs"
                  >
                    <span class="font-courier text-weight-bold"
                      >{{ item?.publicIp }}:{{ item?.config?.port2 }}/</span
                    >
                    <q-btn
                      unelevated
                      size="sm"
                      color="positive"
                      target="_blank"
                      :href="`http://${item?.publicIp}/`"
                    >
                      Access with IP
                      <q-icon
                        name="sym_o_tab_move"
                        class="q-ml-xs"
                      ></q-icon>
                      <q-tooltip max-width="480px">
                        Access with HTTPS
                      </q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="column justify-start items-stretch q-px-sm">
        <span class="q-pl-sm text-caption text-disable"
          >Machine Image used for launch</span
        >
        <div class="q-px-md q-py-sm bg-grey-1 rounded-borders">
          <p class="text-body2 text-weight-bold q-pb-sm q-mb-none">
            {{ item?.imageName }}
          </p>
          <p class="text-caption q-mb-none">
            {{ item?.imageInformation }}
          </p>
        </div>
      </q-card-section>
      <q-card-section>
        <span class="q-pl-sm text-caption text-disable"
          >Attached Data Drive</span
        >
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
                  <q-icon name="sym_o_sd"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Data drive name</q-item-label>
                  <q-item-label class="font-courier text-weight-bold"
                    >{{ item?.driveName }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="sym_o_attachment"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption
                    >Data Drive attachment path</q-item-label
                  >
                  <q-item-label class="font-courier text-weight-bold">
                    {{ item?.config?.mountPoint }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <span class="q-pl-sm text-caption text-disable"
          >Current Bill generated by this Cloud PC</span
        >
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
                <q-item-section>
                  <q-item-label caption>Computation (EC2)</q-item-label>
                  <q-item-label class="q-pl-md font-courier">
                    <div
                      v-for="(ec2, ec2Index) in item?.machineCostInfoVO?.ec2s"
                      :key="ec2Index + '__ec2'"
                      class="row justify-between items-start q-mb-xs"
                    >
                      <span>{{ ec2.name }}</span>
                      <span class="text-right">${{ ec2.price }}</span>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section>
                  <q-item-label caption>Storage (EBS)</q-item-label>
                  <q-item-label class="q-pl-md font-courier">
                    <div class="row justify-between items-start q-mb-xs">
                      <span>{{ item?.machineCostInfoVO?.storage.name }}</span>
                      <span class="text-right"
                        >${{ item?.machineCostInfoVO?.storage.price }}</span
                      >
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
              >
                <q-item-section>
                  <q-item-label caption>Outbound Transmission</q-item-label>
                  <q-item-label class="q-pl-md font-courier">
                    <div class="row justify-between items-start q-mb-xs">
                      <span>{{
                        item?.machineCostInfoVO?.outBound.quantity
                      }}</span>
                      <span class="text-right"
                        >${{ item?.machineCostInfoVO?.outBound.price }}</span
                      >
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                class="bg-grey-1"
              >
                <q-item-section>
                  <q-item-label class="row justify-between">
                    <span class="text-caption text-disable">Total cost</span>
                    <strong class="font-courier text-weight-bold text-right"
                      >${{ item?.totalCost }}</strong
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
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
          The outbound network transmission cost number might have a delay up to
          24 hours.
        </q-alert>
        <q-alert
          type="negative"
          class="q-mb-sm"
        >
          <q-chip
            size="sm"
            square
            class="no-border-radius"
            >Attention</q-chip
          >
          Please DO NOT shut down this Cloud PC from within the Cloud PC itself.
          Always shut down the Cloud PC from the controls on this page (i.e.,
          from Atlas OS). Otherwise, data loss might occur.
        </q-alert>
      </q-card-section>
    </q-card-section>
    <q-card-actions
      class="q-px-md q-pb-md"
      align="center"
    >
      <q-btn
        class="col-grow bg-grey-1"
        flat
        unelevated
        color="primary"
        @click="onClose"
        >{{ $t('textActions.Close') }}</q-btn
      >
      <q-btn
        class="col-grow"
        v-if="isRunning || isPausing"
        :disable="isPausing"
        unelevated
        color="warning"
        icon="sym_o_pause_circle"
        :loading="loading"
        @click="onPauseInstance"
        >{{
          isPausing ? $t('textActions.Pausing') : $t('textActions.Pause')
        }}</q-btn
      >
      <q-btn
        class="col-grow"
        v-if="isPaused || isResuming"
        :disable="isResuming"
        unelevated
        color="positive"
        icon="sym_o_resume"
        :loading="loading"
        @click="onResumeInstance"
        >{{
          isResuming ? $t('textActions.Resuming') : $t('textActions.Resume')
        }}</q-btn
      >
      <q-btn
        class="col-grow"
        v-if="isLaunching"
        :disable="isPausing || isResuming || isWaitingInQueue"
        unelevated
        color="negative"
        icon="sym_o_power_settings_new"
        :loading="loading"
        @click="onShutdownInstance"
        >{{ $t('textActions.Shutdown') }}</q-btn
      >
      <q-btn
        class="col-grow"
        v-if="!isLaunching"
        unelevated
        color="positive"
        :loading="loading"
        @click="onLaunchCloudPC"
        >{{ $t('textActions.Launch another Cloud PC like this') }}</q-btn
      >
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { MachineImage } from 'src/core/types/machine-image-types'
import MachineInstancesStatus from './machine-instances-status.vue'
import {
  MACHINE_INSTANCE_STATUS,
  MachineInstanceDetail,
} from 'src/core/types/machine-instance-types'
import { useCloudPCMachineInstances } from 'src/pages/cloud-pc/hooks/use-machine-instances'
import { ShutdownMachineInstanceRequest } from 'src/core/types/services/machine-types'

// props & emits
const emits = defineEmits(['close', 'shutdown', 'refresh'])
const props = defineProps<{
  item: MachineInstanceDetail | null | undefined
}>()

//data
const intervalItem = ref()

// composables
const $q = useQuasar()
const { t } = useI18n()
const {
  onShowConfirmShutdown,
  onLaunchAnotherCloudPC,
  handleShutdownInstance,
  handlePauseInstance,
  handleResumeInstance,
  loading,
} = useCloudPCMachineInstances()

//computed

const currentInstanceStatus = computed(() => {
  return props.item?.status
})
const isRunning = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.RUNNING
})
const isPaused = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.PAUSED
})
const isPausing = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.PAUSING
})
const isShutdown = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.SHUTDOWN
})
const isShutingDown = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.SHUTTING_DOWN
})
const isHandShutingDown = computed(() => {
  return (
    currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.HAND_SHUTTING_DOWN
  )
})
const isResuming = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.RESUMING
})
const isCancel = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.CANCEL
})
const isFailToClear = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.FAILED_TO_CLEAR
})
const isFailure = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.FAILURE
})
const isStarting = computed(() => {
  return currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.STARTING
})
const isWaitingInQueue = computed(() => {
  return (
    currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.WAITING_IN_QUEUE
  )
})
const isEnded = computed(() => {
  return (
    isShutdown.value ||
    isShutingDown.value ||
    isHandShutingDown.value ||
    isCancel.value ||
    isFailToClear.value ||
    isFailure.value
  )
})
const isLaunching = computed(() => {
  return (
    isStarting.value ||
    isRunning.value ||
    isPaused.value ||
    isPausing.value ||
    isResuming.value
  )
})
// methods
function onClose() {
  emits('close')
}

function onLaunchCloudPC() {
  const payload = {
    amiId: props.item?.amiId,
    imageName: props.item?.imageName,
    imageInformation: props.item?.imageInformation,
  } as MachineImage

  onLaunchAnotherCloudPC(payload)
}

async function onShutdownInstance() {
  if (
    isRunning.value ||
    isPaused.value ||
    isPausing.value ||
    isResuming.value
  ) {
    onShowConfirmShutdown()
    return
  }

  const payload = {
    machineInstanceId: props.item?.machineInstanceId,
    saveAsImage: false,
  } as ShutdownMachineInstanceRequest

  const result = await handleShutdownInstance(payload)
  if (result) {
    emits('refresh')
  }
}

async function onPauseInstance() {
  const result = await handlePauseInstance(props.item?.machineInstanceId)
  if (result) {
    emits('refresh')
  }
}

async function onResumeInstance() {
  const result = await handleResumeInstance(props.item?.machineInstanceId)
  if (result) {
    emits('refresh')
  }
}
function onCopySource(val: string | undefined) {
  if (!val) {
    $q.notify({
      message: t('general.Copy fail'),
      type: 'negative',
    })
    return
  }
  copyToClipboard(val)
    .then(() => {
      $q.notify({
        message: t('general.Copy success'),
        type: 'positive',
      })
    })
    .catch(() => {
      $q.notify({
        message: t('general.Copy fail'),
        type: 'negative',
      })
    })
}

function refreshData() {
  intervalItem.value = setInterval(() => {
    emits('refresh')
  }, 60000)
}

// hooks
onMounted(async () => {
  emits('refresh')
  refreshData()
})

onUnmounted(() => {
  clearInterval(intervalItem.value)
})
</script>
<style lang="scss">
.machine-instances-detail-card {
  min-width: 300px;
  max-width: calc(100vw - 48px);
}
</style>
