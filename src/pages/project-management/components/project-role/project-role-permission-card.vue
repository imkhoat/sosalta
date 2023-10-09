<template>
  <q-card
    flat
    class="rounded-borders project-role-permission-card"
  >
    <q-card-section>
      <q-section-header
        :title="`${activeRole?.roleName} role permissions`"
      ></q-section-header>
    </q-card-section>
    <q-skeleton-suspense>
      <q-card-section>
        <project-management-permission-expand-list
          v-if="isMobileScreen"
          :model-value="activeProjectRoleMenus"
        ></project-management-permission-expand-list>
        <project-management-permission-category-list
          v-else
          :model-value="activeProjectRoleMenus"
        ></project-management-permission-category-list>
      </q-card-section>
    </q-skeleton-suspense>
    <q-card-actions class="row justify-end">
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, defineAsyncComponent } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { useProjectRoles } from 'src/pages/project-management/hooks/use-roles'

// lazy loading
const ProjectManagementPermissionExpandList = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/shared/project-management-permission-expand-list.vue'
    )
)
const ProjectManagementPermissionCategoryList = defineAsyncComponent(
  () =>
    import(
      'src/pages/project-management/components/shared/project-management-permission-category-list.vue'
    )
)
// composables
const $q = useQuasar()
const { t } = useI18n()
const { activeRole, activeProjectRoleMenus } = useProjectRoles()

// props & emits
const emits = defineEmits(['close'])

// computed
const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onCloseModal,
    },
  ]
})
const isMobileScreen = computed(() => {
  return $q.screen.lt.md
})

// methods
function onCloseModal() {
  emits('close')
}
</script>
<style lang="scss">
.project-role-permission-card {
  width: 800px;
  max-width: unset !important;
}
</style>
