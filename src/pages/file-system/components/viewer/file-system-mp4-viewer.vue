<template>
  <div class="file-system-mp4-viewer q-border q-pa-sm rounded-borders">
    <video controls>
      <source
        :src="url"
        type="video/mp4"
      />
      <source
        :src="url"
        type="video/ogg"
      />
      Your browser does not support the audio element.
    </video>
  </div>
</template>
<script lang="ts" setup>
import { StorageFile } from 'src/core/types/file-types'

const props = defineProps<{
  url: string
  item?: StorageFile
}>()
</script>
<style lang="scss">
.file-system-mp4-viewer {
  line-height: 14px;
}
</style>
