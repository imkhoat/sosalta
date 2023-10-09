<template>
  <div
    class="page-header-title row justify-between justify-start items-start full-width q-gutter-x-sm q-gutter-y-sm"
  >
    <div
      class="page-header-title__title column justify-center items-start q-mb-md q-mb-md-none"
    >
      <strong class="title text-h5 text-weight-bold">{{ title }}</strong>
      <span class="subtitle text-disable">{{ subtitle }}</span>
    </div>
    <div class="page-header-title__action">
      <div
        class="row justify-start justify-md-end items-center full-width q-gutter-sm"
      >
        <slot name="action" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
//props
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>
<style lang="scss">
.page-header-title {
  &__action {
    height: fit-content;
  }
}
</style>
