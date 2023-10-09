<template>
  <q-select
    class="project-note-link-notepage"
    id="project-note-link-notepage"
    stack-label
    outlined
    dense
    v-bind="$attrs"
    v-model="text"
    use-input
    use-chips
    multiple
    :options="noteOptions"
    hide-dropdown-icon
    hide-bottom-space
    input-debounce="0"
    options-selected-class="bg-grey-2"
    :hint="totalCharacter"
    @new-value="createValue"
  >
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-avatar
            size="lg"
            color="grey-1"
          >
            <q-avatar
              size="md"
              color="grey-3"
            >
              <span class="text-caption text-disable">
                {{ scope.opt.notePageId }}
              </span>
            </q-avatar>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.pageName }}</q-item-label>
          <q-item-label caption>{{ scope.opt.createdBy }}</q-item-label>
        </q-item-section>
      </q-item>
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
        <span class="ellipsis">{{ scope.opt.pageName }}</span>
      </q-chip>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Notepage } from 'src/core/types/notepage-types'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'

// composable
const { handleFetchLinkProjectNotepages } = useProjectNotepages()
// props
const props = defineProps<{
  modelValue: { value: string; pageName?: string }[]
  notepageId: string | number
}>()
const emits = defineEmits(['update:modelValue'])

// data
const noteOptions = ref<Notepage[]>()

// computed
const text = computed({
  get() {
    return noteContent.value
  },
  set(value: Notepage[]) {
    emits(
      'update:modelValue',
      value.map((item) => {
        return { value: item.notePageId, pageName: item.pageName }
      })
    )
  },
})

const noteContent = computed(() => {
  return (
    noteOptions.value?.filter((item) => {
      return props.modelValue.some((note) => note.value == item.notePageId)
    }) ?? []
  )
})

const totalCharacter = computed(() => {
  return `${text.value?.length} notepages`
})

//methods
function createValue(
  val: Notepage,
  done: (val: Notepage, type: 'add-unique' | 'add' | 'toggle') => void
) {
  done(val, 'add')
}

async function onFetchingData() {
  noteOptions.value = await handleFetchLinkProjectNotepages(props.notepageId)
}

onFetchingData()
</script>
<style lang="scss">
.project-note-link-notepage {
  .q-field__control-container {
    padding-top: 18px !important;
  }
  .q-field__native {
    min-height: 100px !important;
    display: block !important;
  }
}
</style>
