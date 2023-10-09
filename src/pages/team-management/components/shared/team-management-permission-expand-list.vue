<template>
  <div
    class="team-management-permission-expand-list rounded-borders overflow-hidden column justify-start items-stretch"
  >
    <q-expansion-item
      :expand-separator="true"
      :label="module.title"
      :caption="module.subTitle"
      :icon="module.icon"
      hide-expand-icon
      :default-opened="true"
      header-class="q-px-xs border-bottom bg-grey-1"
      v-for="(module, index) in renderConfig"
      :key="index + '__member-users-permission-card-group'"
    >
      <template #header>
        <div class="row justify-start items-center no-wrap full-width">
          <q-avatar
            size="48px"
            color="grey-1"
            class="q-mr-xs"
          >
            <q-avatar
              size="30px"
              color="grey-3"
            >
              <q-icon
                color="primary"
                :name="module.icon"
              />
            </q-avatar>
          </q-avatar>
          <div class="col-grow col-9">
            <q-item-label class="text-weight-bold">{{
              module.title
            }}</q-item-label>
            <q-item-label
              caption
              class="text-overflow"
              >{{ module.subTitle }}</q-item-label
            >
          </div>
          <div class="col-1 row justify-end items-center align-end">
            <q-btn
              size="sm"
              flat
              round
              rounded
            >
              <q-icon name="unfold_more"></q-icon>
            </q-btn>
          </div>
        </div>
      </template>
      <q-card class="column">
        <q-card-section
          class="column justify-start items-stretch q-py-none q-pl-lg bg-grey-1"
        >
          <span class="text-disable text-caption q-mt-md q-mb-sm">
            Action permissions
          </span>
          <div
            v-for="(menu, menuIndex) in module?.menus"
            :key="menuIndex + '__team-management-permission-card__menu'"
          >
            <q-checkbox
              :model-value="menu?.checked"
              :label="menu?.title"
              :disable="disable"
              @update:model-value="onChangePermission(menu)"
            ></q-checkbox>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { UserMenu } from 'src/core/types/user-menu'
import { MENU_ICON } from 'src/core/types/menu-icon-types'
import {
  TeamPermissionCodeType,
  TEAM_PERMISSION_CODE,
} from 'src/core/types/team-permission-code-types'

// props & emits
const props = withDefaults(
  defineProps<{
    modelValue?: Map<TeamPermissionCodeType, UserMenu[]> | null
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
      menus: props.modelValue?.get(TEAM_PERMISSION_CODE.F),
    },
    {
      title: 'Team images',
      subTitle: 'Manager team image access',
      icon: MENU_ICON.CLOUD_PC,
      menus: props.modelValue?.get(TEAM_PERMISSION_CODE.VM),
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
