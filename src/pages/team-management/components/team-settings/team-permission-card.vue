<template>
  <q-card
    flat
    class="rounded-borders team-permission-card"
  >
    <q-card-section>
      <q-section-header :title="`${activeRole?.roleName}`"></q-section-header>
    </q-card-section>
    <q-skeleton-suspense>
      <q-card-section>
        <team-management-permission-expand-list
          v-if="isMobileScreen"
          :model-value="activeTeamRoleMenus"
        ></team-management-permission-expand-list>
        <team-management-permission-category-list
          v-else
          :model-value="activeTeamRoleMenus"
        ></team-management-permission-category-list>
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
import { useTeamRoles } from 'src/pages/team-management/hooks/use-roles'

// lazy loading
const TeamManagementPermissionExpandList = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/shared/team-management-permission-expand-list.vue'
    )
)
const TeamManagementPermissionCategoryList = defineAsyncComponent(
  () =>
    import(
      'src/pages/team-management/components/shared/team-management-permission-category-list.vue'
    )
)
// composables
const $q = useQuasar()
const { t } = useI18n()
const { activeRole, activeTeamRoleMenus } = useTeamRoles()

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
.team-permission-card {
  width: 800px;
  max-width: unset !important;
}
</style>
