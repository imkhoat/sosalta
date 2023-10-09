<template>
  <q-skeleton
    v-show="loading"
    type="QInput"
    height="40px"
    width="100%"
    class="text-caption"
  />
  <q-select
    v-show="!loading"
    id="l-type-input"
    label="Instance type"
    stack-label
    outlined
    dense
    lazy-rules
    hide-bottom-space
    v-bind="$attrs"
    v-model="selectedType"
    :options="instanceOptions"
    option-disable="inactive"
  >
    <template v-slot:selected>
      <q-item
        v-if="selectedType"
        v-bind="selectedType"
        class="q-px-none"
      >
        <q-item-section>
          <q-item-label>{{ selectedType.label }}</q-item-label>
          <q-item-label caption>{{ selectedType.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :class="{ 'bg-grey-3': scope.opt.value === selectedType?.value }"
      >
        <q-item-section>
          <div class="row no-wrap justify-start items-center">
            <q-avatar
              size="36px"
              color="grey-1"
            >
              <q-avatar
                size="24px"
                color="grey-3"
              >
                <q-icon
                  size="16px"
                  v-if="scope.opt.inactive"
                  name="sym_o_lock"
                />
                <q-icon
                  size="16px"
                  v-else-if="scope.opt.value === selectedType?.value"
                  name="sym_o_done"
                />
                <q-icon
                  size="16px"
                  v-else
                  name="sym_o_radio_button_unchecked"
                />
              </q-avatar>
            </q-avatar>
            <div class="q-ml-xs">
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { MachineInstanceType } from 'src/core/types/machine-instance-types'
import { computed } from 'vue'

// props
const props = defineProps<{
  options: MachineInstanceType[]
  loading?: boolean
  modelValue: {
    label: string
    value: string
    description: string
    inactive: boolean
  } | null
  maxCloudpcHourlyCharge: number
}>()
const emits = defineEmits(['update:modelValue', 'update:captchaUuid', 'submit'])

// computed
const selectedType = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const instanceOptions = computed(() => {
  if (!props.options) {
    return []
  }
  return props.options.map((item) => {
    return {
      label: `${item.type} ${item.useGpu ? '(GPU)' : ''}`,
      value: item.type,
      description: `${item.cpu} CPUs | ${item.memory} (GB) RAMs | $${Number(
        item?.price
      ).toFixed(3)} per hour`,
      inactive: Number(item.price) > Number(props.maxCloudpcHourlyCharge),
    }
  })
})
</script>
