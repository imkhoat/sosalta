<template>
  <div class="q-file-upload full-width">
    <q-card
      flat
      bordered
      class="rounded-borders cursor-pointer q-py-md"
    >
      <q-card-section class="column justify-center items-center">
        <q-avatar
          color="grey-1"
          text-color="primary-5"
          size="80px"
        >
          <q-avatar
            color="grey-3"
            text-color="primary-5"
            size="60px"
          >
            <q-icon
              size="lg"
              name="sym_o_cloud_upload"
            ></q-icon>
          </q-avatar>
        </q-avatar>
        <p class="text-center">
          <strong class="text-weight-bold">Click to upload</strong>
          <span class="text-disable">
            or drag and drop
            <br />*.svg, *.png, *.jpg, *.xlsx... (Maximum 5GB)
          </span>
        </p>
      </q-card-section>
      <q-btn
        flat
        round
        size="sm"
        class="q-file-upload__expand-btn"
        color="primary"
        @click="onToogleExpand"
      >
        <q-icon
          size="xs"
          :name="expand ? 'expand_less' : 'expand_more'"
        ></q-icon>
      </q-btn>
    </q-card>
    <div
      v-if="expand"
      class="full-width column justify-start items-stretch"
    >
      <q-item-progress
        class="q-mb-sm"
        track-color="primary-4"
        v-for="(i, index) in 3"
        :key="i + index"
      ></q-item-progress>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import QItemProgress from 'src/core/components/molecules/quasar-extends/q-file-upload/q-item-progress.vue'

// data
const expand = ref(false)

// methods
function onToogleExpand() {
  expand.value = !expand.value
}
</script>
<style lang="scss">
.q-file-upload {
  position: relative;

  &:hover {
    background-color: $primary-05;
  }

  &__expand-btn {
    position: absolute;
    bottom: map-get($map: $space-xs, $key: 'y');
    right: map-get($map: $space-xs, $key: 'y');
  }
}
</style>
