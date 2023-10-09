<template>
  <q-select
    class="project-note-link-file"
    id="project-note-link-file"
    stack-label
    outlined
    dense
    v-bind="$attrs"
    v-model="text"
    use-input
    use-chips
    multiple
    hide-dropdown-icon
    hide-bottom-space
    input-debounce="0"
    :hint="totalCharacter"
    @new-value="createValue"
  >
    <template #no-option>
      <q-card>
        <q-card-section>
          <project-files-tree
            class="q-my-md project-note-link-file__tree"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :folder-id="projectTeamId"
            :root-name="getUserName"
            :userName="getUserName"
            :with-file-node="true"
            @update:model-object="text = selectedFolderObject"
          ></project-files-tree>
        </q-card-section>
      </q-card>
    </template>
    <template #selected-item="scope">
      <q-chip
        removable
        dense
        square
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        icon-remove="delete"
        class="text-caption q-ma-none q-mr-xs q-mt-xs"
      >
        <span class="ellipsis">{{ scope.opt }}</span>
      </q-chip>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import ProjectFilesTree from './project-files-tree.vue'
import { FolderNode } from 'src/core/types/folder-node-types'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { StorageFile } from 'src/core/types/file-types'

// props
const props = defineProps<{
  modelValue: { value: string }[]
  projectTeamId: string | undefined
}>()
const emits = defineEmits(['update:modelValue'])

//composables
const { getUserName } = storeToRefs(useAuthStore())

// data
const selectedFolder = ref([])
const selectedFolderObject = ref<FolderNode[] | StorageFile[] | undefined>([])

// computed
const text = computed({
  get() {
    return noteContent.value
  },
  set(value) {
    emits(
      'update:modelValue',
      value.map((item) => {
        return { value: item }
      })
    )
  },
})

const noteContent = computed(() => {
  return props.modelValue?.map((item) => item?.value ?? '')
})
const totalCharacter = computed(() => {
  return `${text.value?.length} numbers`
})

//methods
function createValue(
  val: string,
  done: (val: string, type: 'add-unique' | 'add' | 'toggle') => void
) {
  if (isValidUrl(val)) {
    done(val, 'add')
  }
}
function isValidUrl(urlString: string) {
  try {
    return Boolean(new URL(urlString))
  } catch (e) {
    return false
  }
}
</script>
<style lang="scss">
.project-note-link-file {
  .q-field__control-container {
    padding-top: 18px !important;
  }
  &__tree {
    max-height: 200px;
    overflow: auto;
  }
}
</style>
