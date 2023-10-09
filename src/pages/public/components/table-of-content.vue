<template>
  <q-card
    bordered
    flat
    class="table-of-content"
  >
    <q-card-section>
      <span class="text-caption text-disable">On this page</span>
      <q-scroll-area
        style="height: 400px; max-height: 400px; min-height: 200px"
        :thumb-style="{ width: '4px' }"
      >
        <q-list dense>
          <template
            v-for="(item, index) in items"
            :key="index + '__table-of-content'"
          >
            <q-item
              :href="`#${item?.to}`"
              :active="!!(item?.to && anchor.includes(item?.to))"
              clickable
              v-ripple
              active-class="text-positive text-weight-bold bg-grey-1"
              class="rounded-borders"
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
            <template v-if="item.childrens">
              <q-list
                dense
                class="q-pl-md"
              >
                <q-item
                  v-for="(subItem, subIndex) in item.childrens"
                  :key="index + subIndex + '__table-of-content'"
                  :href="`#${subItem?.to}`"
                  :active="!!(subItem?.to && anchor.includes(subItem?.to))"
                  clickable
                  v-ripple
                  active-class="text-positive text-weight-bold bg-grey-1"
                  class="rounded-borders"
                >
                  <q-item-section>
                    <q-item-label>{{ subItem.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </template>
        </q-list>
      </q-scroll-area>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-actions class="row justify-between items-end no-wrap q-px-md">
      <div class="column justify-start items-start q-px-md">
        <span class="text-caption text-disable">Is this page helpful</span>
        <div class="row justify-start items-center full-width text-normal">
          <q-btn
            size="md"
            :color="isHelpful === 'YES' ? 'positive' : 'accent'"
            icon="sym_o_thumb_up"
            class="q-px-sm"
            rounded
            flat
            @click="feedback('YES')"
            >Yes</q-btn
          >
          <q-btn
            size="md"
            :color="isHelpful === 'NO' ? 'positive' : 'accent'"
            icon="sym_o_thumb_down"
            class="q-px-sm"
            rounded
            flat
            @click="feedback('NO')"
            >No</q-btn
          >
        </div>
      </div>
      <q-img
        class="q-my-sm"
        width="86px"
        fit="contain"
        src="~/assets/common/shannon-genomics.png"
      ></q-img>
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar'
import { PublicItem } from 'src/core/types/public-item-types'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const props = defineProps<{
  items: PublicItem[]
}>()

const route = useRoute()
const $q = useQuasar()
const isHelpful = ref<'YES' | 'NO' | 'UNSET'>('UNSET')

const anchor = computed(() => {
  return route.hash
})

// methods
function feedback(payload: 'YES' | 'NO' | 'UNSET') {
  isHelpful.value = payload
  $q.notify({
    message: 'Thank you for feedback!',
    type: 'positive',
  })
}
</script>
