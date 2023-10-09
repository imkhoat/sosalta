<template>
  <div class="page-header q-mb-xl">
    <q-page-header-breadcrumb
      :breadcrumbs="breadcrumbs"
      :back="back"
      class="q-mb-md"
    ></q-page-header-breadcrumb>
    <q-page-header-title
      v-if="title"
      :title="title"
      :subtitle="subtitle"
    >
      <template v-slot:action>
        <slot name="action" />
      </template>
    </q-page-header-title>
  </div>
</template>
<script lang="ts" setup>
import QPageHeaderTitle from './page-header-title.vue'
import QPageHeaderBreadcrumb, { Breadcrumb } from './page-header-breadcrumb.vue'

//props
defineProps<{
  title?: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  back?: Breadcrumb
}>()
</script>
