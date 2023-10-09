<template>
  <q-icon
    :size="size"
    :color="defaultColorByType"
    :name="iconByType"
  ></q-icon>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import {
  StorageFileStatus,
  STORAGE_FILE_STATUS,
} from 'src/core/types/file-types'
import { ColorType, COLOR_TYPE } from 'src/core/types/color-types'
// props
const props = withDefaults(
  defineProps<{
    size?: string
    color?: ColorType
    status: StorageFileStatus
  }>(),
  {
    status: STORAGE_FILE_STATUS.AVALIABLE,
    size: 'md',
  }
)

// computed
const iconByType = computed(() => {
  const iconMap = new Map<StorageFileStatus, string>([
    ['0', 'sym_o_mode_heat'],
    ['1', 'sym_o_shield'],
    ['2', 'sym_o_snowing'],
    ['3', 'sym_o_light_mode'],
    ['4', 'sym_o_ac_unit'],
    ['5', 'sym_o_local_fire_department'],
    ['6', 'sym_o_lock'],
  ])

  return iconMap.has(props?.status)
    ? iconMap.get(props.status)
    : 'sym_o_verified_user'
})

const defaultColorByType = computed(() => {
  const colorMap = new Map<StorageFileStatus, string>([
    ['0', 'warning'],
    ['1', 'positive'],
    ['2', 'accent'],
    ['3', 'gray-4'],
    ['4', 'gray-4'],
    ['5', 'warning'],
    ['6', 'gray-4'],
  ])
  return colorMap.has(props?.status)
    ? colorMap.get(props?.status)
    : COLOR_TYPE.PRIMARY
})
</script>
