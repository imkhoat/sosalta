<template>
  <q-card
    flat
    class="note-view-link-file q-pa-sm bg-grey-1 full-height rounded-borders"
  >
    <q-card-section>
      <q-chip
        readonly
        disable
        v-for="(item, index) in noteContent"
        :key="index + '__note-view-link-file'"
        dense
        square
        class="text-caption q-ma-none q-mr-xs q-mt-xs"
        >{{ item.value?.name }}</q-chip
      >
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { Note } from 'src/core/types/note-types'

//props
const props = defineProps<{
  item: Note
  expand: boolean
}>()

// computed
const noteContent = computed(() => {
  const content = JSON.parse(props?.item?.noteValue.toString()) as {
    value: {
      name: string
      id: string
    }
  }[]
  return content
})
</script>
