<template>
  <div class="row justify-end items-center full-width q-gutter-x-sm">
    <q-btn
      :outline="menu.button?.outline"
      :push="menu.button?.push"
      :color="menu.button?.color"
      :unelevated="menu.button?.unelevated"
      :disable="menu.disabled"
      v-for="(menu, index) in visibleMenusBarDirectAccessArray"
      :key="index + '__direct-menu-button'"
      @click="menu.action"
    >
      <q-icon
        size="xs"
        :name="menu.icon"
        class="q-mr-xs"
      ></q-icon
      >{{ menu.name }}
    </q-btn>
    <q-btn
      outline
      color="primary"
      class="q-px-sm"
      @click="onToggleDialog"
    >
      <q-icon
        size="xs"
        name="more_vert"
      ></q-icon>
      <q-menu
        v-if="!isMobile"
        auto-close
        class="menus-context"
      >
        <q-list>
          <template
            v-for="(group, index) in menusBarByGroup"
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
              :disable="menu?.disabled"
              class="row justify-start"
              :key="menuIndex + '_menus-context-menu'"
              @click="onClickActionMenu(menu)"
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
      </q-menu>
    </q-btn>
    <q-dialog
      v-if="isMobile"
      v-model="menusDialog"
      position="bottom"
      class="file-system-menus-bar__dialog"
    >
      <q-card class="file-system-menus-bar__card">
        <q-linear-progress
          :value="1"
          color="primary"
          size="sm"
        />
        <q-card-section>
          <q-list>
            <template
              v-for="(group, index) in menusBarByGroup"
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
                @click="onClickActionMenu(menu)"
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useMenus, Menu } from 'src/pages/file-system/hooks/use-menus'

const $q = useQuasar()
const { menusBarByGroup, visibleMenusBarDirectAccessArray } = useMenus()

// data
const menusDialog = ref(false)

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
function onToggleDialog() {
  if (isMobile.value) {
    menusDialog.value = !menusDialog.value
  }
}

function onClickActionMenu(payload: Menu) {
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
.file-system-menus-bar {
  &__card {
    max-height: 300px !important;
  }
}
</style>
