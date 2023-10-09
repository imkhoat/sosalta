<template>
  <q-card
    flat
    class="note-view-txt q-pa-sm bg-grey-1 full-height rounded-borders"
  >
    <q-card-section>
      <p
        class="note-view-txt__content"
        :class="{ 'full-content': expand }"
      >
        {{ noteContent }}
      </p>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
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
  return content[0]?.value
})
</script>
<style lang="scss">
.note-view-txt {
  &__content {
    white-space: pre-line;
    max-height: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-bottom: 0;
  }

  &__content.full-content {
    max-height: unset !important;
  }
}
</style>
