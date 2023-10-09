<template>
  <div
    class="file-system-select-file-type row justify-start items-center q-gutter-x-sm"
  >
    <label
      v-for="(item, index) in types"
      :key="index + '__file-system-select-file-type'"
      class="column justify-center items-center q-gutte-y-xs cursor-pointer"
      @click="onSelectType(item)"
    >
      <q-avatar
        size="60px"
        color="grey-1"
        text-color="grey-3"
        class="file-system-select-file-type__item"
        :class="{
          'file-system-select-file-type__selected': selectedType === item.code,
        }"
      >
        <q-avatar
          size="40px"
          color="grey-3"
          text-color="accent"
        >
          <q-icon
            size="sm"
            :name="item.icon"
          ></q-icon>
        </q-avatar>
      </q-avatar>
      <span class="text-disable text-caption">{{ item.name }}</span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
interface FileType {
  name: string
  icon: string
  code: 'TXT' | 'HTML' | 'WORD' | 'MARKDOWN'
}
const types: FileType[] = [
  {
    name: 'Text',
    icon: 'sym_o_text_snippet',
    code: 'TXT',
  },
  {
    name: 'Html',
    icon: 'sym_o_code_blocks',
    code: 'HTML',
  },
  {
    name: 'Markdown',
    icon: 'sym_o_markunread_mailbox',
    code: 'MARKDOWN',
  },
  {
    name: 'Word',
    icon: 'sym_o_feed',
    code: 'WORD',
  },
]

// props
const props = defineProps(['modelValue', 'modelTypeName'])
const emits = defineEmits(['update:modelValue', 'update:modelTypeName'])

// data
const selectedType = ref(props.modelValue)

// method
function onSelectType(type: FileType) {
  selectedType.value = type.code
  emits('update:modelValue', type.code)
  emits('update:modelTypeName', type.name)
}
</script>
<style lang="scss">
.file-system-select-file-type {
  &__item {
    border: 2px solid transparent;
    box-sizing: content-box;
  }
  &__selected {
    border-color: $primary;
  }
}
</style>
