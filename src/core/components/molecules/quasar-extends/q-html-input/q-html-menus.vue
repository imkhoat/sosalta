<template>
  <div class="q-html-menus">
    <div
      v-if="editor"
      class="row wrap justify-start items-center q-gutter-xs"
    >
      <template
        v-for="(menuGroup, indexGroup) in menus"
        :key="indexGroup + '_q-html-menu-group'"
      >
        <q-btn
          flat
          size="sm"
          :color="menu.isActive ? 'primary' : 'disable'"
          v-for="(menu, index) in menuGroup"
          :key="index + '_q-html-menu'"
          class="q-html-menus__menu"
          @click.stop="onCallAction(menu.action)"
        >
          <q-icon
            v-if="menu?.icon"
            :name="menu?.icon"
          ></q-icon>
          <strong
            v-else
            class="q-html-menus__menu__text text-weight-bold"
            >{{ menu.name }}</strong
          >
        </q-btn>
        <q-separator
          vertical
          v-if="indexGroup < menus.length - 1"
        ></q-separator>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ChainedCommands, Editor } from '@tiptap/vue-3'

export type Menu = {
  icon?: string
  name?: string
  isActive?: boolean
  action?: () => ChainedCommands | undefined
}
export type Menus = Menu[]

// props
defineProps<{
  editor: Editor | undefined
  menus: Menus[]
}>()

// methods
function onCallAction(action: (() => ChainedCommands | undefined) | undefined) {
  if (action) {
    const result = action()
    console.log(action)
    if (result) {
      result.run()
    }
  }
}
</script>
<style lang="scss">
.q-html-menus {
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid $grey-5;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  position: sticky;
  top: 0;
  z-index: 2;

  &__menu {
    padding: 4px 8px;
    border-radius: 6px;
  }

  &__menu__text {
    font-size: 14px;
  }
}
</style>
