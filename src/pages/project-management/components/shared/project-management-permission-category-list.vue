<template>
  <div
    class="project-management-permission-category-list rounded-borders overflow-hidden column justify-start items-stretch"
  >
    <div
      v-for="(module, index) in renderConfig"
      :key="index + '__project-management-permission-card-group'"
      class="row justify-start items-start q-py-lg border-bottom border-2"
    >
      <div class="col-12 col-md-5 col-lg-4">
        <div class="row justify-start items-center no-wrap full-width">
          <q-avatar
            size="56px"
            color="grey-1"
            class="q-mr-xs"
          >
            <q-avatar
              size="40px"
              color="grey-3"
            >
              <q-icon
                color="primary"
                :name="module.icon"
              />
            </q-avatar>
          </q-avatar>
          <div class="col-grow col-shrink col-9">
            <q-item-label class="text-weight-bold text-body1">{{
              module.title
            }}</q-item-label>
            <q-item-label
              caption
              class="text-overflow"
              >{{ module.subTitle }}</q-item-label
            >
          </div>
        </div>
      </div>
      <div class="col-12 col-md-7 col-lg-8">
        <q-card-section class="column justify-start items-stretch q-py-none">
          <span class="text-disable text-caption">Action permissions</span>
          <div
            v-for="(menu, menuIndex) in module?.menus"
            :key="menuIndex + '__project-management-permission-card__menu'"
          >
            <q-checkbox
              :model-value="menu?.checked"
              :label="menu?.title"
              :disable="disable"
              @update:model-value="onChangePermission(menu)"
            ></q-checkbox>
          </div>
        </q-card-section>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { UserMenu } from 'src/core/types/user-menu'
import { MENU_ICON } from 'src/core/types/menu-icon-types'
import {
  ProjectPermissionCodeType,
  PROJECT_PERMISSION_CODE,
} from 'src/core/types/project-permission-code-types'

// props & emits
const props = withDefaults(
  defineProps<{
    modelValue?: Map<ProjectPermissionCodeType, UserMenu[]> | null
    disable?: boolean
  }>(),
  {
    disable: true,
  }
)
const emits = defineEmits(['update:modelValue'])

// computed
const renderConfig = computed(() => {
  return [
    {
      title: 'File system',
      subTitle: 'Manager and config file system',
      icon: MENU_ICON.FILE_SYSTEM,
      menus: props.modelValue?.get(PROJECT_PERMISSION_CODE.F),
    },
    {
      title: 'Project Notepage Permissions',
      subTitle: 'Manager project notepage access',
      icon: MENU_ICON.NOTEPAGE,
      menus: props.modelValue?.get(PROJECT_PERMISSION_CODE.PF),
    },
  ]
})

// methods
function onChangePermission(menu: UserMenu | undefined) {
  if (menu) {
    menu.checked = !menu?.checked
    emits('update:modelValue', props.modelValue)
  }
}
</script>
<style lang="scss">
.project-management-permission-category-list {
  min-width: 450px;
}
</style>
