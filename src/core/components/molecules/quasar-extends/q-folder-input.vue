<template>
  <div class="q-folder-input">
    <q-input
      id="q-folder-input__file-path"
      class="q-folder-input__file-path"
      label="File path(optional)"
      stack-label
      outlined
      readonly
      dense
      v-bind="$attrs"
      :model-value="selectedFolderObject?.name"
      @click="modal = true"
    >
      <template v-slot:prepend>
        <q-icon
          size="xs"
          class="q-folder-input__prepend-icon"
          name="sym_o_folder"
        />
      </template>
    </q-input>
    <q-dialog v-model="modal">
      <q-card class="q-folder-input__dialog-content">
        <q-card-section>
          <q-section-header
            title="Select save folder"
            sub-title="Select the folder to store the file"
          ></q-section-header>
        </q-card-section>
        <q-card-section>
          <q-folder-tree
            class="q-my-md"
            v-model="selectedFolder"
            v-model:model-object="selectedFolderObject"
            :folder-id="folderId"
            :user-name="userName"
            :roots="roots"
          ></q-folder-tree>
        </q-card-section>
        <q-card-actions align="right">
          <q-form-actions :actions="formActions"></q-form-actions>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { FolderNode } from 'src/core/types/folder-node-types'
import { ActionProp } from 'src/core/types/action-prop-types'

// composable
const { t } = useI18n()

// props
const props = defineProps<{
  folderId?: string
  userName?: string
  modelValue: string
  modelObject?: FolderNode
  roots?: FolderNode[]
}>()
const emits = defineEmits(['update:modelValue', 'update:modelObject', 'close'])

// data
const selectedFolder = ref('')
const selectedFolderObject = ref<FolderNode>(props.modelObject as FolderNode)
const modal = ref(false)

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Next'),
      action: onSelect,
    },
  ]
})

//  methods

function onClose() {
  modal.value = false
}

function onSelect() {
  emits('update:modelValue', selectedFolder.value)
  emits('update:modelObject', selectedFolderObject.value)
  modal.value = false
  emits('close')
}
</script>
<style lang="scss">
.q-folder-input {
  &__dialog-content {
    min-width: 300px;
  }

  &__file-path {
    .q-field__control:before {
      border-style: solid !important;
    }
    .q-field__label {
      left: -24px;
    }
  }
  &__prepend-icon {
    bottom: -6px;
  }
}
</style>
