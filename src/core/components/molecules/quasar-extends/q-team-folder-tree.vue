<template>
  <div class="q-team-folder-tree">
    <q-folder-tree
      v-model="selectedFolder"
      v-model:model-object="selectedFolderObject"
      :user-name="userName"
      :roots="teamGroupRoots"
    ></q-folder-tree>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Team } from 'src/core/types/team-types'
import { FolderNode } from 'src/core/types/folder-node-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetTeamGroupList } from 'src/core/services/user-services'

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
const teamGroupRoots = ref<FolderNode[]>([])

// methods
async function fetchGroup() {
  try {
    const data = await httpsGetTeamGroupList()

    if (data?.code === RESPONSE_CODE.SUCCESS) {
      teamGroupRoots.value = _generateTeamGroupRootTreeData(data?.data?.list)
    }
  } catch (error) {}
}

function _generateTeamGroupRootTreeData(data: Team[]) {
  const teamNodeArr: FolderNode[] = data.map((item) => {
    return {
      id: item.groupId,
      children: [],
      lazy: true,
      icon: 'groups_3',
      type: 'folder',
      name: item.groupName,
      selectable: false,
      isParent: true,
    }
  })
  return [
    {
      id: props.rootId,
      lazy: false,
      icon: 'groups_3',
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
