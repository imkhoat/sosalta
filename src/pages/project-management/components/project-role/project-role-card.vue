<template>
  <q-card
    flat
    class="project-role-card"
  >
    <q-card-section
      class="row justify-between items-center full-width q-pb-none"
    >
      <div class="row justify-start items-center">
        <strong class="text-captions">Roles</strong>
      </div>
    </q-card-section>
    <q-card-section class="row no-wrap q-mt-sm">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <q-skeleton-suspense>
          <project-management-role-list
            :roles="roleTemplates"
            :disable="!editMode"
            @create-role="onCreateNewRole"
          ></project-management-role-list>
        </q-skeleton-suspense>
      </div>
    </q-card-section>
    <q-card-actions
      v-if="editMode"
      class="row justify-end"
    >
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, defineAsyncComponent } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'

// lazy loading
const ProjectManagementRoleList = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/shared/project-management-role-list.vue'
    )
)

// composable
const { t } = useI18n()
const { roleTemplates, loading, onCreateNewRole } = useProjectRoles()

// props & emits
const emits = defineEmits(['close', 'refresh'])

// data
const editMode = ref(false)

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Cancel'),
      action: onToggleEditBox,
    },
    {
      color: 'primary',
      unelevated: true,
      name: t('textActions.Update'),
      loading: loading.value,
    },
  ]
})

// methods
function onToggleEditBox() {
  editMode.value = !editMode.value
}
</script>
