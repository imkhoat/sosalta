<template>
  <q-card
    flat
    class="bg-white content-box"
  >
    <q-card-section
      v-if="title || subTitle || subTitles"
      class="q-pb-xl"
    >
      <h2 class="text-positive text-weight-bold text-h4 q-my-none q-pb-md">
        {{ title }}
      </h2>
      <div
        class="column justify-start items-start text-caption text-disable q-pl-sm"
      >
        <span v-if="subTitle">{{ subTitle }}</span>
        <template v-if="subTitles">
          <span
            v-for="(sub, subIndex) in subTitles"
            :key="subIndex + '__content-box-sub-title'"
            >{{ sub }}</span
          >
        </template>
      </div>
    </q-card-section>
    <q-card-section>
      <content-box-item
        v-for="(item, index) in items"
        :key="index + '__content-box'"
        :item="item"
      ></content-box-item>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { PublicItem } from 'src/core/types/public-item-types'
import ContentBoxItem from 'src/pages/public/components/content-box-item.vue'

const props = defineProps<{
  title?: string
  subTitle?: string
  subTitles?: string[]
  items?: PublicItem[]
}>()
</script>
