<template>
  <q-card
    flat
    class="full-width machine-instances-status"
    :class="`bg-${instanceStatusType.originColor}-1`"
  >
    <q-card-section class="row justify-center items-center q-pb-none">
      <q-avatar
        size="90px"
        :color="`${instanceStatusType.originColor}-2`"
      >
        <q-avatar
          size="65px"
          :color="`${instanceStatusType.originColor}-3`"
        >
          <q-icon
            :name="instanceStatusType?.icon"
            size="32px"
            :color="instanceStatusType.textColor"
          ></q-icon>
        </q-avatar>
      </q-avatar>
    </q-card-section>
    <q-card-section
      class="machine-instances-status column justify-center items-center text-center q-pt-none"
    >
      <strong class="text-body2 text-weight-bold">{{ displayLabel }}</strong>
      <span class="text-caption text-disable"
        >{{ shortDescription }}
        <q-btn
          flat
          round
          size="sm"
          class="text-normal text-primary"
        >
          <q-icon name="sym_o_info"></q-icon>
          <q-tooltip max-width="480px">
            {{ description }}
          </q-tooltip>
        </q-btn></span
      >
    </q-card-section>
    <q-chip
      v-if="isShowAutoShutdown"
      class="machine-instances-status__timer bg-red-1 text-negative"
      ><span class="text-caption text-disable q-pr-sm">Auto shutdown after</span
      ><strong class="text-weight-bold font-courier">{{
        autoShutdownTimeString
      }}</strong></q-chip
    >
  </q-card>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  MACHINE_INSTANCE_STATUS,
  MachineInstanceDetail,
} from 'src/core/types/machine-instance-types'
import { MACHINE_INSTANCE_STATUS_TYPE_CONFIGURATIONS } from 'src/core/utils/machine-instance-status'
import { format, intervalToDuration } from 'date-fns'

const props = defineProps<{
  item: MachineInstanceDetail | null
}>()

//data
const today = ref(new Date())
const intervalItem = ref()
//computed
const displayLabel = computed(() => {
  return props.item?.machineStatusMetadata?.displayLabel ?? 'Caculating...'
})

const shortDescription = computed(() => {
  return props.item?.machineStatusMetadata?.shortDescription ?? 'Caculating...'
})

const description = computed(() => {
  return props.item?.machineStatusMetadata?.description ?? 'Caculating...'
})

const instanceStatusType = computed(() => {
  if (props.item?.machineStatusMetadata?.type) {
    return MACHINE_INSTANCE_STATUS_TYPE_CONFIGURATIONS[
      props.item?.machineStatusMetadata?.type
    ]
  }
  return MACHINE_INSTANCE_STATUS_TYPE_CONFIGURATIONS.PENDING
})

const currentInstanceStatus = computed(() => {
  return props.item?.status
})

const isLiveInstance = computed(() => {
  return (
    currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.RUNNING ||
    currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.STARTING ||
    currentInstanceStatus.value === MACHINE_INSTANCE_STATUS.WAITING_IN_QUEUE
  )
})

const isShowAutoShutdown = computed(() => {
  return props.item?.shutdownType === 'AUTO_SHUTDOWN' && isLiveInstance.value
})
const autoShutdownTimeString = computed(() => {
  const diffTime = intervalToDuration({
    start: today.value,
    end: new Date(Number(props.item?.autoShutdownTime) * 1000 ?? 0),
  })
  return `${diffTime.hours}:${diffTime.minutes}:${diffTime.seconds}`
})

// methods
function refreshToday() {
  intervalItem.value = setInterval(() => {
    today.value = new Date()
  }, 1000)
}

onMounted(() => {
  refreshToday()
})

onUnmounted(() => {
  clearInterval(intervalItem.value)
})
</script>
<style lang="scss">
.machine-instances-status {
  position: relative;

  &__timer {
    position: absolute;
    bottom: -38px;
    right: 0;
  }
}
</style>
