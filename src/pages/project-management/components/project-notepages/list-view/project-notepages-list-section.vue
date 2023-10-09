<template>
  <q-list
    v-model="activeNotepage"
    class="project-notepages-list-section"
  >
    <q-item
      clickable
      v-ripple
      :active="item.notePageId === activeNotepage.notePageId"
      v-for="(item, index) in items"
      :key="index + '__project-notepages-list-section__notepages'"
      active-class="bg-grey-3"
      class="project-notepages-list-section__item relative"
      @click="onSetActiveNotepage(item)"
    >
      <div class="row justify-start items-center no-wrap q-py-sm full-width">
        <q-avatar
          size="lg"
          color="grey-1"
        >
          <q-avatar
            size="md"
            color="grey-3"
          >
            <span
              class="text-caption text-primary"
              :class="{
                'text-primary': item.notePageId === activeNotepage.notePageId,
              }"
              >{{ item.notePageId }}</span
            >
          </q-avatar>
        </q-avatar>
        <div
          class="column justify-start items-start q-ml-xs col-grow project-notepages-list-section__note-item"
        >
          <strong>{{ item.pageName }}</strong>
          <span class="text-caption text-disable"
            >Create by {{ item.createdBy }}</span
          >
        </div>
        <div
          class="project-notepages-list-section__item-actions no-wrap row justify-end items-center absolute-right"
        >
          <div
            v-if="activeNotepage?.notePageId === item.notePageId"
            class="row justify-end items-center no-wrap"
          >
            <q-btn
              flat
              round
              size="sm"
              class="text-normal text-primary"
              @click="onShowContextMenu(item)"
            >
              <q-icon
                size="xs"
                name="more_vert"
              ></q-icon>
              <q-menu
                v-if="!isMobile"
                class="menus-context"
              >
                <q-list>
                  <q-item
                    v-if="hasDeleteProjectNotePageAuthorization"
                    clickable
                    class="row justify-start"
                    @click="onDeleteNotepage(item)"
                  >
                    <q-item-section class="col-shrink">
                      <q-avatar
                        size="md"
                        color="grey-1"
                        text-color="primary"
                      >
                        <q-avatar
                          size="xs"
                          color="grey-3"
                          text-color="primary-4"
                          class="q-pa-xs q-box-content"
                        >
                          <q-icon
                            size="xs"
                            name="sym_o_delete"
                            class="material-icons-round"
                          ></q-icon>
                        </q-avatar>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      class="col-grow text-weight-medium q-ml-none"
                      >Delete</q-item-section
                    >
                  </q-item>
                  <q-item
                    v-if="hasEditProjectNotePageAuthorization"
                    clickable
                    class="row justify-start"
                    @click="onRenameNotepage(item)"
                  >
                    <q-item-section class="col-shrink">
                      <q-avatar
                        size="md"
                        color="grey-1"
                        text-color="primary"
                      >
                        <q-avatar
                          size="xs"
                          color="grey-3"
                          text-color="primary-4"
                          class="q-pa-xs q-box-content"
                        >
                          <q-icon
                            size="xs"
                            name="sym_o_edit"
                            class="material-icons-round"
                          ></q-icon>
                        </q-avatar>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      class="col-grow text-weight-medium q-ml-none"
                      >Rename</q-item-section
                    >
                  </q-item>
                  <q-item
                    v-if="hasCopyProjectNotePageAuthorization"
                    clickable
                    class="row justify-start"
                    @click="onCopyNotepage(item)"
                  >
                    <q-item-section class="col-shrink">
                      <q-avatar
                        size="md"
                        color="grey-1"
                        text-color="primary"
                      >
                        <q-avatar
                          size="xs"
                          color="grey-3"
                          text-color="primary-4"
                          class="q-pa-xs q-box-content"
                        >
                          <q-icon
                            size="xs"
                            name="sym_o_content_copy"
                            class="material-icons-round"
                          ></q-icon>
                        </q-avatar>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      class="col-grow text-weight-medium q-ml-none"
                      >Copy</q-item-section
                    >
                  </q-item>
                  <q-separator></q-separator>
                  <q-item
                    v-if="hasExportProjectNotePageAuthorization"
                    clickable
                    class="row justify-start"
                    @click="onCopyNotepage(item)"
                  >
                    <q-item-section class="col-shrink">
                      <q-avatar
                        size="md"
                        color="grey-1"
                        text-color="primary"
                      >
                        <q-avatar
                          size="xs"
                          color="grey-3"
                          text-color="primary-4"
                          class="q-pa-xs q-box-content"
                        >
                          <q-icon
                            size="xs"
                            name="sym_o_export_notes"
                            class="material-icons-round"
                          ></q-icon>
                        </q-avatar>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      class="col-grow text-weight-medium q-ml-none"
                      >Export</q-item-section
                    >
                  </q-item>
                  <q-separator></q-separator>
                  <q-item
                    clickable
                    class="row justify-start"
                    @click="onViewInfoNotepage(item)"
                  >
                    <q-item-section class="col-shrink">
                      <q-avatar
                        size="md"
                        color="grey-1"
                        text-color="primary"
                      >
                        <q-avatar
                          size="xs"
                          color="grey-3"
                          text-color="primary-4"
                          class="q-pa-xs q-box-content"
                        >
                          <q-icon
                            size="xs"
                            name="sym_o_info"
                            class="material-icons-round"
                          ></q-icon>
                        </q-avatar>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section
                      class="col-grow text-weight-medium q-ml-none"
                      >View detail</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <q-checkbox
            v-model="selectedNotepages"
            :val="item"
          ></q-checkbox>
        </div>
      </div>
    </q-item>
  </q-list>
  <q-dialog
    v-if="isMobile"
    v-model="menusDialog"
    position="bottom"
    class="project-notepages-table__dialog"
  >
    <q-card class="project-notepages-table__card">
      <q-linear-progress
        :value="1"
        color="primary"
        size="sm"
      />
      <q-card-section>
        <q-list>
          <q-item
            clickable
            class="row justify-start"
            @click="onDeleteNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_delete"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Delete</q-item-section
            >
          </q-item>
          <q-item
            clickable
            class="row justify-start"
            @click="onRenameNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_edit"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Rename</q-item-section
            >
          </q-item>
          <q-item
            clickable
            class="row justify-start"
            @click="onCopyNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_content_copy"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Copy</q-item-section
            >
          </q-item>
          <q-separator></q-separator>
          <q-item
            clickable
            class="row justify-start"
            @click="onCopyNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_export_notes"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >Export</q-item-section
            >
          </q-item>
          <q-separator></q-separator>
          <q-item
            clickable
            class="row justify-start"
            @click="onViewInfoNotepage(contextActiveRow)"
          >
            <q-item-section class="col-shrink">
              <q-avatar
                size="md"
                color="grey-1"
                text-color="primary"
              >
                <q-avatar
                  size="xs"
                  color="grey-3"
                  text-color="primary-4"
                  class="q-pa-xs q-box-content"
                >
                  <q-icon
                    size="xs"
                    name="sym_o_info"
                    class="material-icons-round"
                  ></q-icon>
                </q-avatar>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-grow text-weight-medium q-ml-none"
              >View detail</q-item-section
            >
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { Notepage } from 'src/core/types/notepage-types'
import { useActiveProjectActionsVisible } from 'src/pages/project-management/hooks/authorization/use-project-actions-visible'
import { useProjectNotepages } from 'src/pages/project-management/hooks/use-notepages'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//props
const props = defineProps<{
  items: Notepage[] | undefined
}>()
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const {
  pagination,
  activeNotepage,
  selectedNotepages,
  onDeleteNotepage,
  onRenameNotepage,
  onCopyNotepage,
  onViewInfoNotepage,
  handleSetActiveNotepage,
} = useProjectNotepages()

const {
  hasEditProjectNotePageAuthorization,
  hasDeleteProjectNotePageAuthorization,
  hasListProjectNotePageAuthorization,
  hasCopyProjectNotePageAuthorization,
  hasExportProjectNotePageAuthorization,
} = useActiveProjectActionsVisible()
//data
const menusDialog = ref(false)
const contextActiveRow = ref()

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
function onSetActiveNotepage(notepage: Notepage) {
  handleSetActiveNotepage(notepage)
  if (route.name) {
    router.push({
      name: route.name,
      params: { ...route.params },
      query: { ...route.query, notepageId: notepage.notePageId },
    })
  }
}
function onShowContextMenu(notepage: Notepage) {
  menusDialog.value = !menusDialog.value
  contextActiveRow.value = notepage
}
</script>
<style lang="scss">
.project-notepages-list-section {
  &__note-item {
    max-width: 70% !important;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__note-item strong {
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
