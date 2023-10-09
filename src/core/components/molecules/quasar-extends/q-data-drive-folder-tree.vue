<template>
  <div class="q-data-drive-folder-tree">
    <q-folder-tree
      v-model="selectedFolder"
      v-model:model-object="selectedFolderObject"
      :user-name="userName"
      :roots="dataDriveRoots"
    ></q-folder-tree>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { DataDrive } from 'src/core/types/data-drive-types'
import { FolderNode } from 'src/core/types/folder-node-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetDataDrives } from 'src/core/services/machine-services'

// props & emits
const props = defineProps<{
  rootId?: string
  rootName?: string
  userName?: string
  modelValue: string
  modelObject?: FolderNode
}>()
const emits = defineEmits(['update:modelValue', 'update:modelObject'])

// computed
const selectedFolder = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
    emits('update:modelObject', selectedFolderObject.value)
  },
})

// data
const selectedFolderObject = ref<FolderNode>()
const dataDriveRoots = ref<FolderNode[]>([])

// methods
async function fetchGroup() {
  try {
    const data = await httpsGetDataDrives()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      dataDriveRoots.value = _generateDataDriveRootTreeData(data?.data?.list)
    }
  } catch (error) {}
}

function _generateDataDriveRootTreeData(data: DataDrive[]) {
  const dataDriveNodeArr: FolderNode[] = data.map((item) => {
    return {
      id: item.dataDriveId,
      children: [],
      lazy: true,
      icon: 'apps',
      type: 'folder',
      name: item.driveName,
      selectable: false,
      isParent: true,
    }
  })
  return [
    {
      id: props.rootId,
      lazy: false,
      icon: 'apps',
      name: props.rootName,
      isParent: true,
      type: 'folder',
      selectable: false,
      children: [...dataDriveNodeArr],
    },
  ] as FolderNode[]
}

// hooks
onMounted(() => {
  Promise.all([fetchGroup()])
})
</script>
