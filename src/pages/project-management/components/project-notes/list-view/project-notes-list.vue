<template>
  <q-card
    flat
    class="project-notes-list full-width"
  >
    <q-card-section v-if="sortedNotes.length > 0">
      <q-list
        bordered
        separator
        class="rounded-borders full-width"
      >
        <q-item
          v-for="(note, index) in sortedNotes"
          :key="index + '__project-notes-list-item'"
          class="full-width"
        >
          <project-notes-item
            :item="note"
            class="q-my-sm"
            @refresh="emits('refresh')"
          >
            <q-checkbox
              v-model="selectedNotes"
              :val="note"
            ></q-checkbox>
          </project-notes-item>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import {
  SORT_TYPE,
  SORT_DIRECTION,
  useProjectNotes,
} from 'src/pages/project-management/hooks/use-notes'
import ProjectNotesItem from 'src/pages/project-management/components/project-notes/list-view/project-notes-item.vue'
import { Note } from 'src/core/types/note-types'

// composables
const { activeSortDirection, activeSortType, selectedNotes } = useProjectNotes()

// props & emits
const props = defineProps<{
  items: Note[] | undefined
  loading: boolean
}>()
const emits = defineEmits(['refresh'])

// data
const search = reactive({
  filter: '',
  keyword: '',
})

// computed

const filtedNotes = computed(() => {
  return (
    props.items?.filter((note) => {
      return `${note.noteKey}-${note.notePageId}-${note.noteValue}-${note.reason}-${note.beyond}-${note.createdBy}-${note.modifiedBy}`
        .toLowerCase()
        .includes(search.keyword.toLowerCase())
    }) ?? []
  )
})

const sortedNotes = computed(() => {
  const newArr = [...filtedNotes.value]
  return newArr?.sort((a, b) => {
    switch (activeSortType.value) {
      case SORT_TYPE.CREATE_TIME:
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? new Date(a.gmtCreate || '').getTime() -
              new Date(b.gmtCreate).getTime()
          : new Date(b.gmtCreate || '').getTime() -
              new Date(a.gmtCreate).getTime()

      case SORT_TYPE.LAST_MODIFIED_TIME:
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? new Date(a.gmtUpdate || '').getTime() -
              new Date(b.gmtUpdate).getTime()
          : new Date(b.gmtUpdate || '').getTime() -
              new Date(a.gmtUpdate).getTime()

      case SORT_TYPE.BOOKMARKED_FIRST:
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? Number(a.star) - Number(b.star)
          : Number(b.star) - Number(a.star)

      case SORT_TYPE.USER_ARRANGED:
        return activeSortDirection.value === SORT_DIRECTION.ASC
          ? a.sortNo - b.sortNo
          : b.sortNo - a.sortNo
      default:
        return 0
    }
  })
})
</script>
<style lang="scss">
.project-notes-list {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
