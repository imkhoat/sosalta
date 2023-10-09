<template>
  <router-link :to="{ name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES }">
    <q-img
      :width="width"
      fit="contain"
      src="~/assets/common/shannon-genomics.png"
    ></q-img>
  </router-link>
</template>
<script lang="ts" setup>
import { FILE_SYSTEM_ROUTE_NAMES } from 'src/pages/file-system/router'

withDefaults(
  defineProps<{
    width?: string
  }>(),
  {
    width: '86px',
  }
)
</script>
