<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm no-wrap">
    <q-btn
      v-if="isSelectedUser && hasProjectDeleteActionVisible"
      outline
      unelevated
      color="primary"
      @click="onDeleteProjects"
    >
      <q-icon
        size="xs"
        name="sym_o_delete"
        class="q-mr-xs"
      ></q-icon
      >Delete project
    </q-btn>
    <q-btn
      v-if="hasProjectCreateActionVisible"
      push
      color="primary"
      @click="onCreateNewProject"
    >
      <q-icon
        size="xs"
        name="sym_o_add"
        class="q-mr-xs"
      ></q-icon>
      {{ isMobile ? 'New project' : 'Create new project' }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useProjects } from 'src/pages/project-management/hooks/use-projects'
import { useMenusVisible } from 'src/pages/project-management/hooks/authorization/use-menus-visible'

// composables
const $q = useQuasar()
const { onCreateNewProject, onDeleteProjects, selectProjects } = useProjects()
const { hasProjectCreateActionVisible, hasProjectDeleteActionVisible } =
  useMenusVisible()
// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})
const isSelectedUser = computed(() => {
  return selectProjects.value?.length > 0
})
</script>
