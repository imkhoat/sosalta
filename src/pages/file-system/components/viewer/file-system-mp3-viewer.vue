<template>
  <div class="file-system-mp3-viewer q-border q-pa-sm rounded-borders">
    <audio controls>
      <source
        :src="url"
        type="audio/ogg"
      />
      <source
        :src="url"
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
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
.file-system-mp3-viewer {
  line-height: 14px;
}
</style>
