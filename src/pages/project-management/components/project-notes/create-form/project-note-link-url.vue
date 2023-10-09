<template>
  <q-select
    class="project-note-link-url"
    id="project-note-link-url"
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
    <template #selected-item="scope">
      <q-chip
        removable
        dense
        square
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        icon-remove="delete"
        class="text-caption q-ma-none q-mr-xs q-mt-xs"
        ><span class="ellipsis">
          {{ scope.opt }}
        </span></q-chip
      >
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props
const props = defineProps<{
  modelValue: { value: string }[]
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
.project-note-link-url {
  .q-field__control-container {
    padding-top: 18px !important;
  }
  .q-field__native {
    min-height: 100px !important;
    display: block !important;
  }
}
</style>
