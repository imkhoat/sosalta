<template>
  <q-scroll-area
    :class="{ 'q-scrollarea__full': fullScreen }"
    :thumb-style="{ width: '4px' }"
  >
    <div
      class="file-system-md-viewer q-border-bold q-pa-sm rounded-borders"
      v-html="mdData"
    ></div>
  </q-scroll-area>
</template>
<script lang="ts" setup>
import { StorageFile } from 'src/core/types/file-types'
import { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import { computedAsync } from '@vueuse/core'
import { ref } from 'vue'
import showdown from 'showdown'

const props = defineProps<{
  data: GetObjectCommandOutput | null | undefined
  item?: StorageFile
  fullScreen?: boolean
}>()

const loading = ref(false)

const mdData = computedAsync(async () => {
  return await renderToMd()
})

async function renderToMd() {
  try {
    loading.value = true
    const data = await props.data?.Body?.transformToString()
    const converter = new showdown.Converter()

    return converter.makeHtml(data)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>
<style lang="scss">
.file-system-md-viewer {
  min-height: 300px;
  line-height: 14px;

  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }
  h1 {
    font-size: 2rem;
  }
  h2 {
    font-size: 1.8rem;
  }
  h3 {
    font-size: 1.6rem;
  }
  h4 {
    font-size: 1.4rem;
  }
  h5 {
    font-size: 1.2rem;
  }
  h6 {
    font-size: 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin: 16px 0;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
    padding: 2px;
    border-radius: 4px;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  p {
    margin-bottom: 8px;
  }
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
