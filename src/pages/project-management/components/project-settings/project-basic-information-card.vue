<template>
  <q-card
    flat
    class="project-basic-information-card"
  >
    <q-card-section class="row justify-start items-start q-gutter-x-md">
      <div class="project-basic-information-card__avatar-wrapper">
        <q-avatar
          size="120px"
          color="grey-1"
          text-color="grey-3"
          class="project-basic-information-card__avatar"
        >
          <q-avatar
            size="100px"
            color="grey-3"
            text-color="grey-4"
          >
            <q-avatar
              size="60px"
              color="grey-4"
              text-color="primary"
            >
              <q-icon :name="MENU_ICON.PROJECT"></q-icon>
            </q-avatar>
          </q-avatar>
        </q-avatar>
      </div>
      <q-section-header
        :title="project?.projectName"
        :sub-title="`Create by: ${project?.owner}`"
        class="col-grow"
      ></q-section-header>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="hasEditProjectNameAuthorization"
          size="sm"
          outline
          unelevated
          round
          color="primary"
          @click="onRenameProject(project)"
        >
          <q-icon
            size="xs"
            name="sym_o_edit"
          ></q-icon>
        </q-btn>
        <q-btn
          v-if="hasDeleteProjectAuthorization"
          size="sm"
          outline
          unelevated
          round
          color="negative"
          @click="onDeleteProject(project)"
        >
          <q-icon
            size="xs"
            name="sym_o_delete"
          ></q-icon>
        </q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <strong>Project history</strong>
      <div class="row no-wrap q-mt-sm">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <q-list
            bordered
            separator
            class="rounded-borders"
          >
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Create date</q-item-label>
                <q-item-label caption>{{
                  project?.gmtCreateAtString
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_calendar_month"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Last update date</q-item-label>
                <q-item-label caption>{{
                  project?.gmtUpdateAtString
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_attribution"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Create by</q-item-label>
                <q-item-label caption>{{ project?.owner }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_copyright"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Owner by</q-item-label>
                <q-item-label caption>{{ project?.owner }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_wb_iridescent"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Description</q-item-label>
                <q-item-label caption>{{
                  project?.projectDescription
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_library_books"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Notepages</q-item-label>
                <q-item-label caption>{{
                  project?.notePageCount
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_style"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Keywords</q-item-label>
                <q-item-label caption>
                  <q-chip
                    size="sm"
                    outline
                    v-for="item in project?.keyWords"
                    :key="item"
                    >{{ item }}</q-chip
                  >
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="sym_o_tag"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>Tags</q-item-label>
                <q-item-label caption>
                  <q-chip
                    size="sm"
                    outline
                    v-for="item in project?.projectProperties"
                    :key="item?.id + '__project-properties'"
                    >{{ `${item?.ppKey} <> ${item?.ppValue}` }}</q-chip
                  >
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { MENU_ICON } from 'src/core/types/menu-icon-types'
import { Project } from 'src/core/types/project-types'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useActiveProjectActionsVisible } from '../../hooks/authorization/use-project-actions-visible'

// composables
const { onDeleteProject, onRenameProject } = useProjects()
const { hasDeleteProjectAuthorization, hasEditProjectNameAuthorization } =
  useActiveProjectActionsVisible()

// props & emits
const props = defineProps<{
  project: Project | null
}>()
</script>
<style lang="scss">
.project-basic-information-card {
  margin-top: 60px;
  position: relative;

  &__avatar-wrapper {
    width: 120px;
    height: 80px;
  }

  &__avatar {
    top: -40px;
    position: absolute;
    border: 3px solid $white;
    box-sizing: content-box;
  }
}
</style>
