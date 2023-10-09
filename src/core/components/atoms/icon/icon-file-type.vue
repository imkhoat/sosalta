<template>
  <q-icon
    :size="size"
    :color="colorByType"
    :name="iconByType"
  ></q-icon>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { StorageFileType, STORAGE_FILE_TYPE } from 'src/core/types/file-types'
import { ColorType, COLOR_TYPE } from 'src/core/types/color-types'
// props
const props = withDefaults(
  defineProps<{
    size?: string
    color?: ColorType
    type?: StorageFileType
  }>(),
  {
    type: STORAGE_FILE_TYPE.SYS_FOLDER,
  }
)

// computed
const iconByType = computed(() => {
  const iconMap = new Map<StorageFileType, string>([
    ['docx', 'sym_o_description'],
    ['sys-folder', 'folder'],
    ['folder', 'folder'],
    ['svg', 'sym_o_image'],
    ['xlsx', 'sym_o_analytics'],
    ['pdf', 'sym_o_picture_as_pdf'],
  ])

  return iconMap.has(props?.type)
    ? iconMap.get(props.type)
    : 'sym_o_description'
})

const colorByType = computed(() => {
  const iconMap = new Map<StorageFileType, string>([
    ['docx', COLOR_TYPE.PRIMARY],
    ['sys-folder', COLOR_TYPE.BRAND],
    ['folder', COLOR_TYPE.PRIMARY],
    ['svg', COLOR_TYPE.PRIMARY],
    ['xlsx', COLOR_TYPE.PRIMARY],
    ['pdf', COLOR_TYPE.PRIMARY],
  ])

  return props.color || iconMap.has(props?.type)
    ? iconMap.get(props.type)
    : COLOR_TYPE.PRIMARY
})
</script>
