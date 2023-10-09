<template>
  <q-select
    class="project-note-date"
    id="project-note-date"
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
    new-value-mode="add"
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
    <template v-slot:append>
      <q-icon
        :name="timeOnly ? 'sym_o_schedule' : 'sym_o_calendar_month'"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-time
            v-if="timeOnly"
            v-model="selectedTime"
            format24h
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Select"
                color="primary"
                flat
                @click="onSelectDateTime"
              />
            </div>
          </q-time>
          <q-date
            v-else
            v-model="selectedTime"
            multiple
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Select"
                color="primary"
                flat
                @click="onSelectDateTime"
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'

// props
const props = defineProps<{
  modelValue: { value: string }[]
  timeOnly?: boolean
}>()
const emits = defineEmits(['update:modelValue'])

//data
const selectedTime = ref()
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
  return `${text.value?.length} times`
})

//methods

function onSelectDateTime() {
  text.value = props.timeOnly
    ? [...text.value, selectedTime.value]
    : [...text.value, ...selectedTime.value]
}
</script>
