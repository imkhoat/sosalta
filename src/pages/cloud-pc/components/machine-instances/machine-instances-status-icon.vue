<template>
  <q-avatar
    size="40px"
    :color="`${instanceStatusType.originColor}-1`"
  >
    <q-avatar
      size="25px"
      :color="`${instanceStatusType.originColor}-2`"
    >
      <q-icon
        :name="instanceStatusType?.icon"
        :color="instanceStatusType.textColor"
      ></q-icon>
    </q-avatar>
    <q-tooltip max-width="480px"
      >[{{ displayLabel }}] {{ description }}</q-tooltip
    >
  </q-avatar>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { MachineInstance } from 'src/core/types/machine-instance-types'
import { MACHINE_INSTANCE_STATUS_TYPE_CONFIGURATIONS } from 'src/core/utils/machine-instance-status'

const props = defineProps<{
  item: MachineInstance
}>()

//computed
const displayLabel = computed(() => {
  return props.item?.machineStatusMetadata?.displayLabel
})

const shortDescription = computed(() => {
  return props.item?.machineStatusMetadata?.shortDescription
})

const description = computed(() => {
  return props.item?.machineStatusMetadata?.description
})

const instanceStatusType = computed(() => {
  if (props.item?.machineStatusMetadata?.type) {
    return MACHINE_INSTANCE_STATUS_TYPE_CONFIGURATIONS[
      props.item?.machineStatusMetadata?.type
    ]
  }
  return MACHINE_INSTANCE_STATUS_TYPE_CONFIGURATIONS.PENDING
})
</script>
