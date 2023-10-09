<template>
  <div class="q-folder-tree">
    <q-tree
      ref="folderTreeRef"
      :nodes="folders"
      v-model:selected="selectedFolder"
      @lazy-load="onLazyLoad"
      node-key="id"
      label-key="name"
      icon="r_navigate_next"
      selected-color="primary"
    />
  </div>
</template>
<script lang="ts" setup>
import { QTree } from 'quasar'
import { computed, ref, watch } from 'vue'
import { errorHandler } from 'src/core/utils/error-handler'
import { FolderNode } from 'src/core/types/folder-node-types'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { httpsGetFolderTree } from 'src/core/services/storage-services'
import { GetFolderTreeRequest } from 'src/core/types/services/storage-types'

// props & emits
const props = defineProps<{
  folderId?: string
  userName?: string
  modelValue: string
  modelObject?: FolderNode
  roots?: FolderNode[]
  recursive?: boolean
  withFileNode?: boolean
}>()
const emits = defineEmits(['update:modelValue', 'update:modelObject'])
// data
const folderTreeRef = ref<(QTree & { validate: () => boolean }) | null>(null)
const loading = ref(false)
const folders = ref<FolderNode[]>([])

// computed
const selectedFolder = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
    emits('update:modelObject', folderTreeRef.value?.getNodeByKey(value))
  },
})

// methods
function refresh() {
  if (props.roots) {
    folders.value = props.roots
  } else {
    folders.value = _generateRootFolder()
    fetchFolderTreeData()
  }
}
async function fetchFolderTreeData() {
  try {
    loading.value = true
    const data = await _handleGetFolderTree(
      props.folderId || '',
      props.userName || '',
      props.recursive,
      props.withFileNode
    )
    folders.value[0].children = data
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  } finally {
    loading.value = false
  }
}

function _generateRootFolder() {
  return [
    {
      id: props.folderId,
      name: props.folderId,
      isParent: true,
      type: 'folder',
      s3FileKey: props.folderId,
      size: '0',
      parentId: props.folderId,
      bucketName: props.folderId,
      lazy: true,
      icon: 'sym_o_folder',
      filePathItems: [
        {
          id: props.folderId,
          name: props.folderId,
        },
      ],
      children: [],
      parent: true,
    },
  ] as FolderNode[]
}

async function _handleGetFolderTree(
  folderId: string,
  userName: string,
  recursive: boolean,
  withFileNode?: boolean
): Promise<FolderNode[]> {
  let responseData: FolderNode[] = []
  try {
    const query: GetFolderTreeRequest = {
      id: folderId,
      name: userName,
    }
    if (recursive) {
      query.recursive = recursive
    }
    if (withFileNode) {
      query.withFileNode = withFileNode
    }
    const data = await httpsGetFolderTree(query)
    if (data?.code === RESPONSE_CODE.SUCCESS) {
      responseData = data?.data.map((item) => {
        return { ...item, lazy: true, icon: 'sym_o_folder' }
      })
    }
  } catch (error) {
    responseData = []
    errorHandler.log(error)
    errorHandler.notify(error)
  } finally {
    return responseData
  }
}

async function onLazyLoad({
  node,
  key,
  done,
}: {
  node: FolderNode
  key: string
  done: (nodes: FolderNode[]) => void
}) {
  if (key.indexOf('Lazy load empty') > -1) {
    done([])
    return
  }

  const treeNodes = await _handleGetFolderTree(
    node?.id,
    props.userName || '',
    props.recursive,
    props.withFileNode
  )
  done(treeNodes)
}

watch(
  [() => props.folderId, () => props.userName, () => props.roots],
  () => {
    refresh()
  },
  { immediate: true }
)
</script>
<style lang="scss">
.q-folder-tree {
  .q-tree__node--selected {
    font-weight: bold;
  }

  .q-tree__node--selected .q-focus-helper {
    background-color: $primary !important;
    opacity: 0.1 !important;
  }
}
</style>
