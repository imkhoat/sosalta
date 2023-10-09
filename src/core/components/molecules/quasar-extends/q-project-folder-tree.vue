<template>
  <div class="q-project-folder-tree">
    <q-folder-tree
      v-model="selectedFolder"
      v-model:model-object="selectedFolderObject"
      :user-name="userName"
      :roots="projectRoots"
      :with-file-node="withFileNode"
    ></q-folder-tree>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Project } from 'src/core/types/project-types'
import { FolderNode } from 'src/core/types/folder-node-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetProjects } from 'src/core/services/project-services'

// props & emits
const props = defineProps<{
  rootId?: string
  rootName?: string
  userName?: string
  modelValue: string
  modelObject?: FolderNode
  withFileNode?: boolean
}>()
const emits = defineEmits(['update:modelValue', 'update:modelObject', 'select'])

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
const projectRoots = ref<FolderNode[]>([])

// methods
async function fetchGroup() {
  try {
    const data = await httpsGetProjects()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      projectRoots.value = _generateProjectRootTreeData(data?.data?.list)
    }
  } catch (error) {}
}

function _generateProjectRootTreeData(data: Project[]) {
  const teamNodeArr: FolderNode[] = data.map((item) => {
    return {
      id: item.projectTeamId.toString(),
      children: [],
      lazy: true,
      icon: 'source',
      type: 'folder',
      name: item.projectName,
      selectable: false,
      isParent: true,
    }
  })
  return [
    {
      id: props.rootId,
      lazy: false,
      icon: 'source',
      name: props.rootName,
      isParent: true,
      type: 'folder',
      selectable: false,
      children: [...teamNodeArr],
    },
  ] as FolderNode[]
}

// hooks
onMounted(() => {
  Promise.all([fetchGroup()])
})
</script>
