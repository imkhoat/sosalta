<template>
  <q-scroll-area
    :class="{ 'q-scrollarea__full': fullScreen }"
    :thumb-style="{ width: '4px' }"
  >
    <div
      class="file-system-html-viewer q-border-bold q-pa-sm rounded-borders"
      v-html="htmlData"
    ></div>
  </q-scroll-area>
</template>
<script lang="ts" setup>
import { StorageFile } from 'src/core/types/file-types'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { computedAsync } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  data: GetObjectCommandOutput | null | undefined
  item?: StorageFile
  fullScreen?: boolean
}>()

const loading = ref(false)

const htmlData = computedAsync(async () => {
  return await renderToHtml()
})

async function renderToHtml() {
  try {
    loading.value = true
    return await props.data?.Body?.transformToString()
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
.file-system-html-viewer {
  min-height: 300px;
  line-height: 14px;
}
.q-scrollarea {
  height: 360px;
  width: 360px;
}
.q-scrollarea__full {
  height: calc(100vh - 96px) !important;
  width: calc(100vw - 96px) !important;
}
</style>
