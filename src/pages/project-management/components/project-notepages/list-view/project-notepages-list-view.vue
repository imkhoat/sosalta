<template>
  <q-card
    flat
    class="project-notepages-list-view full-height full-width"
  >
    <q-card-section class="q-pa-none full-height">
      <q-splitter
        class="full-height"
        v-model="splitterModel"
        style="height: 400px"
      >
        <template v-slot:before>
          <q-card
            flat
            class="project-notepages-list-view__notepages full-height column justify-start items-stretch no-wrap"
          >
            <q-card-section
              class="q-px-sm q-pb-none project-notepages-list-view__notepages-header"
            >
              <q-btn
                v-if="hasCreateProjectNotePageAuthorization"
                flat
                color="indigo-14"
                class="full-width b-grey-1 q-px-sm"
                align="left"
                @click="onCreateNewNotepage"
              >
                <q-icon
                  size="xs"
                  name="sym_o_add_circle"
                  class="q-mr-xs"
                ></q-icon>
                {{ isMobile ? 'New notepage' : 'Create new notepage' }}
              </q-btn>
              <project-notepages-filter
                :full-width="true"
                v-model:model-filter="search.filter"
                v-model="search.keyword"
                v-model:model-search-type="search.searchType"
                @search="emits('search', search)"
                class="full-width q-py-sm q-px-sm"
              ></project-notepages-filter>
              <q-separator></q-separator>
            </q-card-section>
            <q-card-section class="q-px-none col-grow">
              <q-scroll-area
                :thumb-style="{ width: '4px' }"
                style="height: 100%; width: 100%"
                class="project-notepages-list-view__notepages-content"
              >
                <q-card
                  flat
                  v-if="loading"
                >
                  <q-card-section>
                    <q-skeleton
                      type="text"
                      width="30%"
                      class="text-caption"
                    />
                    <q-skeleton
                      type="text"
                      class="text-subtitle1"
                    />
                    <q-skeleton
                      type="text"
                      class="text-subtitle1 q-mb-md"
                    />
                    <q-skeleton
                      type="text"
                      width="30%"
                      class="text-caption"
                    />
                    <q-skeleton
                      type="text"
                      class="text-subtitle1"
                    />
                    <q-skeleton
                      type="text"
                      class="text-subtitle1 q-mb-md"
                    />
                    <q-skeleton
                      type="text"
                      width="30%"
                      class="text-caption"
                    />
                    <q-skeleton
                      type="text"
                      class="text-subtitle1"
                    />
                    <q-skeleton
                      type="text"
                      class="text-subtitle1 q-mb-md"
                    />
                  </q-card-section>
                </q-card>
                <project-notepages-list-section
                  v-else
                  :items="items"
                ></project-notepages-list-section>
              </q-scroll-area>
            </q-card-section>
            <q-card-actions
              class="q-pt-none project-notepages-list-view__notepages-footer"
            >
              <q-separator
                inset
                class="full-width q-mb-md"
              ></q-separator>
              <div class="row justify-center full-width q-mb-sm">
                <q-pagination-box
                  v-model="pagination"
                  @update:model-value="emits('change-page')"
                ></q-pagination-box>
              </div>
              <div class="full-width row justify-between items-center">
                <q-btn
                  v-if="isSelectedUser"
                  flat
                  unelevated
                  color="primary"
                  class="col-grow"
                  @click="onCleanSelectedNotepages"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_restart_alt"
                    class="q-mr-xs"
                  ></q-icon
                  >Reset
                </q-btn>
                <q-btn
                  v-if="isSelectedUser && hasDeleteProjectNotePageAuthorization"
                  flat
                  unelevated
                  color="negative"
                  class="col-grow"
                  @click="onDeleteNotepages"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_delete"
                    class="q-mr-xs"
                  ></q-icon
                  >Delete notepages
                </q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </template>

        <template v-slot:after>
          <div class="project-notepages-list-view__note full-height">
            <q-card
              flat
              v-if="loading"
            >
              <q-card-section
                class="row justify-between items-center q-gutter-x-sm"
              >
                <div class="column justify-start items-start col-grow">
                  <q-skeleton
                    type="rect"
                    width="30%"
                    class="text-caption"
                  />
                  <q-skeleton
                    type="text"
                    width="100%"
                    class="text-subtitle1"
                  />
                </div>
                <div class="row justify-end items-center q-gutter-x-xs">
                  <q-skeleton
                    type="QBtn"
                    class="text-caption"
                    size="sm"
                  />
                  <q-skeleton
                    type="QBtn"
                    class="text-caption"
                    size="sm"
                  />
                  <q-skeleton
                    type="QBtn"
                    class="text-caption"
                    size="sm"
                  />
                </div>
              </q-card-section>
              <q-card-section>
                <q-skeleton
                  type="text"
                  width="30%"
                  class="text-caption"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1 q-mb-md"
                />
                <q-skeleton
                  type="text"
                  width="30%"
                  class="text-caption"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1 q-mb-md"
                />
                <q-skeleton
                  type="text"
                  width="30%"
                  class="text-caption"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1"
                />
                <q-skeleton
                  type="text"
                  class="text-subtitle1 q-mb-md"
                />
              </q-card-section>
            </q-card>
            <project-notes-list-section
              v-else
              :note-pages="items"
            ></project-notes-list-section>
          </div>
        </template>
      </q-splitter>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
import { Notepage } from 'src/core/types/notepage-types'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'
import ProjectNotepagesFilter from 'src/pages/project-management/components/project-notepages/project-notepages-filter.vue'
import ProjectNotesListSection from 'src/pages/project-management/components/project-notepages/list-view/project-notes-list-section.vue'
import ProjectNotepagesListSection from 'src/pages/project-management/components/project-notepages/list-view/project-notepages-list-section.vue'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'

// composables
const $q = useQuasar()
const {
  pagination,
  selectedNotepages,
  onCreateNewNotepage,
  onDeleteNotepages,
  onCleanSelectedNotepages,
} = useProjectNotepages()
const {
  hasCreateProjectNotePageAuthorization,
  hasEditProjectNotePageAuthorization,
  hasDeleteProjectNotePageAuthorization,
  hasListProjectNotePageAuthorization,
  hasCopyProjectNotePageAuthorization,
} = useActiveProjectActionsVisible()
// props & emits
const props = defineProps<{
  items: Notepage[] | undefined
  loading: boolean
}>()
const emits = defineEmits(['search', 'refresh', 'change-page'])

// data
const splitterModel = ref(25)
const search = reactive({
  filter: '',
  keyword: '',
  searchType: { label: 'Notepage name', value: 'pageName' },
})

// computed

const isMobile = computed(() => {
  return $q.screen.lt.sm
})

const isSelectedUser = computed(() => {
  return selectedNotepages?.value?.length > 0
})
</script>
<style lang="scss">
.project-notepages-list-view {
  min-height: 65vh;

  &__item-actions {
    position: relative;
    z-index: 1000;
  }
  &__notepages {
    position: relative;
  }
  &__notepages-header {
    position: sticky;
    top: 0;
  }
  &__notepages-footer {
    position: sticky;
    bottom: 0;
    left: 0;
  }
  &__notepages-content {
    .q-scrollarea__content {
      max-width: 100%;
    }
  }
}
</style>
