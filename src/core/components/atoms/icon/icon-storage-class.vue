<template>
  <q-icon
    :size="size"
    :color="defaultColorByType"
    :name="iconByType"
  ></q-icon>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { StorageClass, STORAGE_CLASS } from 'src/core/types/file-types'
import { ColorType, COLOR_TYPE } from 'src/core/types/color-types'
// props
const props = withDefaults(
  defineProps<{
    size?: string
    color?: ColorType
    class: StorageClass
  }>(),
  {
    class: STORAGE_CLASS.STANDARD,
    size: 'md',
  }
)

// computed
const iconByType = computed(() => {
  const iconMap = new Map<StorageClass, string>([
    ['Standard', 'sym_o_mode_heat'],
    ['Glacier', 'sym_o_ac_unit'],
    ['Standard_IA', 'sym_o_cloudy_snowing'],
  ])

  return iconMap.has(props?.class)
    ? iconMap.get(props.class)
    : 'sym_o_mode_heat'
})

const defaultColorByType = computed(() => {
  const colorMap = new Map<StorageClass, string>([
    ['Standard', 'warning'],
    ['Glacier', 'blue'],
    ['Standard_IA', 'green'],
  ])
  return colorMap.has(props?.class)
    ? colorMap.get(props?.class)
    : COLOR_TYPE.PRIMARY
})
</script>
