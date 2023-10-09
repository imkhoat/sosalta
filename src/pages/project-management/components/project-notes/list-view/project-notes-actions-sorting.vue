<template>
  <q-btn
    :disabled="totalNotes === 0"
    outline
    round
    rounded
    size="sm"
    no-wrap
    unelevated
    color="primary"
    @click="onShowContextMenu"
  >
    <q-icon
      size="xs"
      name="sym_o_sort"
    ></q-icon
    ><q-tooltip>Sort</q-tooltip>
    <q-menu
      v-if="!isMobile"
      class="menus-context"
    >
      <q-list class="project-notes-actions-sorting__menu-list">
        <q-item
          v-for="(item, index) in sortOptions"
          :key="index"
          clickable
          class="row justify-start"
          @click="onSorting(item.sortType)"
        >
          <q-item-section class="col-shrink">
            <q-avatar
              size="md"
              color="grey-1"
              text-color="primary"
            >
              <q-avatar
                size="md"
                color="grey-2"
                text-color="primary-4"
                class="q-box-content"
              >
                <div class="row justify-center items-center no-wrap">
                  <q-icon
                    size="xs"
                    name="sym_o_straight"
                    class="material-icons-round"
                    :class="{
                      'text-primary': checkingActiveSort(item.sortType, 1),
                      'text-grey-4': !checkingActiveSort(item.sortType, 1),
                    }"
                  ></q-icon>
                  <q-icon
                    size="xs"
                    name="sym_o_straight"
                    class="material-icons-round rotate-180"
                    :class="{
                      'text-primary': checkingActiveSort(item.sortType, 2),
                      'text-grey-4': !checkingActiveSort(item.sortType, 2),
                    }"
                  ></q-icon>
                </div>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none">
            {{ item?.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>

  <q-dialog
    v-if="isMobile"
    v-model="menusDialog"
    position="bottom"
    class="project-notes-actions-sorting__dialog"
  >
    <q-card class="project-notes-actions-sorting__card">
      <q-linear-progress
        :value="1"
        color="primary"
        size="sm"
      />
      <q-card-section>
        <q-list class="project-notes-actions-sorting__menu-list">
          <q-item
            v-for="(item, index) in sortOptions"
            :key="index"
            clickable
            class="row justify-start"
            @click="onSorting(item.sortType)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="md"
                  color="grey-2"
                  text-color="primary-4"
                  class="q-box-content"
                >
                  <div class="row justify-center items-center no-wrap">
                    <q-icon
                      size="xs"
                      name="sym_o_straight"
                      class="material-icons-round"
                      :class="{
                        'text-primary': checkingActiveSort(item.sortType, 1),
                        'text-grey-4': !checkingActiveSort(item.sortType, 1),
                      }"
                    ></q-icon>
                    <q-icon
                      size="xs"
                      name="sym_o_straight"
                      class="material-icons-round rotate-180"
                      :class="{
                        'text-primary': checkingActiveSort(item.sortType, 2),
                        'text-grey-4': !checkingActiveSort(item.sortType, 2),
                      }"
                    ></q-icon>
                  </div>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none">
              {{ item?.name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import { Note } from 'src/core/types/note-types'
import { useProjectNotes } from 'src/pages/project-management/hooks/use-notes'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'

interface SortOption {
  name: string
  sortType: number
  sortDirection: number
  active: boolean
}

// composable
const $q = useQuasar()
const { activeNotepage } = useProjectNotepages()
const { handleSortNotes, activeSortType, activeSortDirection } =
  useProjectNotes()

// props & emits
const props = defineProps<{
  notepageId: number | string
  notes: Note[]
}>()
const emits = defineEmits(['close', 'refresh'])

// data
const menusDialog = ref(false)
const sortOptions = ref<SortOption[]>([
  { name: 'Created time', sortType: 1, sortDirection: 1, active: false },
  { name: 'Last modified time', sortType: 2, sortDirection: 1, active: false },
  { name: 'Bookmarked first', sortType: 3, sortDirection: 1, active: true },
  { name: 'User arranged', sortType: 4, sortDirection: 1, active: false },
])

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const totalNotes = computed(() => {
  return props.notes?.length
})

// methods

function onShowContextMenu() {
  menusDialog.value = !menusDialog.value
}

function checkingActiveSort(sortType: number, direction: number) {
  return (
    direction === activeSortDirection.value && sortType === activeSortType.value
  )
}
async function onSorting(sortType: number) {
  if (activeSortType.value === sortType) {
    activeSortDirection.value = activeSortDirection.value === 1 ? 2 : 1
  }
  activeSortType.value = sortType
  const result = await handleSortNotes(
    parseInt(props.notepageId?.toString()),
    sortType,
    activeSortDirection.value,
    totalNotes.value
  )

  if (result) {
    emits('close')
    emits('refresh')
  }
}

watch(
  () => activeNotepage.value,
  () => {
    activeSortType.value = activeNotepage.value?.currentSortType
    activeSortDirection.value = activeNotepage.value?.sortDirection
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss">
.project-notes-actions-sorting {
  &__menu-list {
    .material-icons-round.q-icon {
      width: 4px !important;
    }
  }
}
</style>
