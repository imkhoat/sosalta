<template>
  <q-select
    class="project-note-number"
    id="project-note-number"
    stack-label
    outlined
    dense
    v-bind="$attrs"
    v-model="text"
    use-input
    use-chips
    multiple
    type="number"
    hide-dropdown-icon
    hide-bottom-space
    input-debounce="0"
    :hint="totalCharacter"
    @new-value="createValue"
  >
    <template #selected-item="scope">
      <q-chip
        removable
        dense
        square
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        icon-remove="delete"
        class="text-caption q-ma-none q-mr-xs q-mt-xs"
        >{{ scope.opt }}</q-chip
      >
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps<{
  modelValue: { value: string }[]
  integerOnly?: boolean
}>()
const emits = defineEmits(['update:modelValue'])

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
  val: number,
  done: (val: number, type: 'add-unique' | 'add' | 'toggle') => void
) {
  console.log('createValue', Number.isInteger(+val), Number.isFinite(+val))
  if (props.integerOnly && Number.isInteger(+val)) {
    done(val, 'add')
  } else if (!props.integerOnly && Number.isFinite(+val)) {
    done(val, 'add')
  }
}
</script>
