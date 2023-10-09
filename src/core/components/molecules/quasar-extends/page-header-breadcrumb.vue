<template>
  <div
    v-if="back || breadcrumbs"
    class="page-header-breadcrumb row justify-start items-center full-width"
  >
    <q-btn
      flat
      size="md"
      class="text-capitalize q-px-none text-subtitle2 q-px-xs -q-ml-xs"
      @click="back.to"
    >
      <q-icon :name="back.icon"></q-icon>
      {{ back.name }}
    </q-btn>
  </div>
</template>
<script lang="ts" setup>
import { Breadcrumb } from 'src/core/types/breadcrumb-types'

withDefaults(
  defineProps<{
    breadcrumbs?: Breadcrumb[]
    back?: Breadcrumb
  }>(),
  {
    back: () => ({
      name: 'Back to home page',
      icon: 'r_keyboard_return',
      to: () => history.go(0),
    }),
  }
)
</script>
