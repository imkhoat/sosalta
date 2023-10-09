<template>
  <q-btn
    class="file-system-menus-context"
    flat
    round
    size="sm"
    color="primary"
    @click="onClickContextButton"
  >
    <q-icon
      size="xs"
      name="more_vert"
    ></q-icon>
    <file-system-menus
      v-if="!isMobile"
      class="menus-context"
    ></file-system-menus>
  </q-btn>
  <q-dialog
    v-if="isMobile"
    v-model="menusDialog"
    position="bottom"
    class="file-system-menus-context__dialog"
  >
    <q-card class="file-system-menus-context__card">
      <q-linear-progress
        :value="1"
        color="primary"
        size="sm"
      />
      <q-card-section>
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
              :disable="menu.disabled"
              class="row justify-start"
              :key="menuIndex + '_menus-context-menu'"
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
              <q-item-section class="col-grow text-weight-medium q-ml-none">
                {{ menu.name }}
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useMenus, Menu } from 'src/pages/file-system/hooks/use-menus'
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import FileSystemMenus from 'src/pages/file-system/components/menus/file-system-menus.vue'

const $q = useQuasar()
const { menusContextByGroup } = useMenus()

// props & emits
const emits = defineEmits(['select-row'])
// data
const menusDialog = ref(false)

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
function onClickContextButton() {
  emits('select-row')
  if (isMobile.value) {
    menusDialog.value = !menusDialog.value
  }
}

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
