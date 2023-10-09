<template>
  <q-card
    flat
    class="note-view-date q-pa-sm bg-grey-1 full-height rounded-borders"
  >
    <q-card-section>
      <q-chip
        readonly
        disable
        v-for="(item, index) in noteContent"
        :key="index + '__note-view-date'"
        dense
        square
        class="text-caption q-ma-none q-mr-xs q-mt-xs"
        >{{ item.value }}</q-chip
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
    value: string
  }[]
  return content
})
</script>
