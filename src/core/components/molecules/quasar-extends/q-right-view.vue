<template>
  <div class="q-right-view">
    <q-dialog
      position="bottom"
      v-if="isMobile"
      v-model="drawer.open"
      class="q-right-view__dialog"
    >
      <q-card class="q-right-view__card">
        <q-card-section class="q-px-none">
          <slot />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-drawer
      v-else
      side="right"
      v-model="drawer.open"
      bordered
      overlay
      :width="480"
    >
      <q-scroll-area class="fit q-pb-xl">
        <slot />
      </q-scroll-area>
      <q-card-actions
        class="absolute-bottom bg-white full-width row justify-end items-center border-top"
      >
        <q-btn
          color="primary"
          unelevated
          flat
          @click="onClickClose"
          >Close</q-btn
        >
      </q-card-actions>
    </q-drawer>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useDrawer } from 'src/core/composables/use-drawer'

// composable
const $q = useQuasar()
const { drawer, onCloseDrawer } = useDrawer()

//props & emits
const emits = defineEmits(['close'])

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

function onClickClose() {
  emits('close')
  onCloseDrawer()
}
</script>
<style lang="scss">
.q-right-view {
  &__card {
    height: 80vh;
    border-top: 4px solid $primary;
  }
}
</style>
