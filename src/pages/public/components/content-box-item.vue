<template>
  <div class="content-box-item q-py-md">
    <h6
      :id="item?.to"
      class="text-h6 text-weight-bold q-my-none q-pb-md"
    >
      {{ item.label }}
    </h6>
    <div
      v-if="item?.content"
      v-html="item.content"
    ></div>
    <div v-if="item?.childrens">
      <content-box-item
        v-for="(sub, index) in item?.childrens"
        :key="index + '__content-box-item'"
        :item="sub"
      ></content-box-item>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PublicItem } from 'src/core/types/public-item-types'
import ContentBoxItem from 'src/pages/public/components/content-box-item.vue'
const props = defineProps<{ item: PublicItem }>()
</script>
<style lang="scss">
br {
  height: 12px;
  content: '';
  display: block;
}
</style>
