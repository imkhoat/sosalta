<template>
  <q-card
    flat
    class="note-view-rich-text q-pa-sm bg-grey-1 full-height"
  >
    <q-card-section>
      <div
        class="note-view-rich-text__content"
        :class="{ 'full-content': expand }"
        v-html="noteContent"
      ></div>
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
.note-view-rich-text {
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
.note-view-rich-text {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: auto;
  scroll-behavior: smooth;
  align-items: stretch;
  height: 250px;
  position: relative;

  &:focus,
  &:hover {
    border-color: $primary;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    position: sticky;
    bottom: 0;
    padding: 4px;
  }

  &__content {
    border: none;
    outline: none;
    flex-grow: 1;
  }

  &__content {
    border: none;
    outline: none;
    border-radius: 4px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
      margin: 16px 0;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
      padding: 2px;
      border-radius: 4px;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0d0d0d, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0d0d0d, 0.1);
      margin: 2rem 0;
    }

    p {
      margin-bottom: 8px;
    }
  }
}
</style>
