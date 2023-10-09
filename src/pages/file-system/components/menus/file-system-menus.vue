<template>
  <q-menu
    auto-close
    v-bind="$attrs"
  >
    <q-list>
      <template
        v-for="(group, index) in menusContextByGroup"
        :key="index + '_menus-context-group'"
      >
        <q-item-label
          header
          class="text-caption"
          >{{ group.group }}</q-item-label
        >
        <q-item
          v-for="(menu, menuIndex) in group.menus"
          clickable
          class="row justify-start"
          :key="menuIndex + '_menus-context-menu'"
          :disable="menu.disabled"
          @click="onClickContextMenu(menu)"
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
                  :name="menu.icon"
                  class="material-icons-round"
                ></q-icon>
              </q-avatar>
            </q-avatar>
          </q-item-section>
          <q-item-section class="col-grow text-weight-medium q-ml-none">{{
            menu.name
          }}</q-item-section>
        </q-item>
        <q-separator></q-separator>
      </template>
    </q-list>
  </q-menu>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useMenus, Menu } from 'src/pages/file-system/hooks/use-menus'

// composables
const $q = useQuasar()
const { menusContextByGroup } = useMenus()

// methods
function onClickContextMenu(payload: Menu) {
  if (!payload?.visible || payload?.disabled) {
    $q.notify({
      message: `You don't have permission on this action`,
      type: 'warning',
    })
    return
  } else {
    payload.action()
  }
}
</script>
<style lang="scss">
.menus-context {
  min-width: 200px;

  .q-item {
    border-radius: 0;
  }
}
</style>
