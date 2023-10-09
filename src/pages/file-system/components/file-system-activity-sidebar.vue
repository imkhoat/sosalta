<template>
  <q-drawer
    side="right"
    v-model="activitySidebar"
    show-if-above
    bordered
    :width="200"
    :breakpoint="500"
    class="bg-white"
  >
    <q-scroll-area class="fit">
      <div class="q-pa-sm">
        <activity-item
          v-for="(item, index) in 5"
          :key="index + '__file-system-activity-sidebar'"
          class="q-mb-sm"
          >{{ item }}</activity-item
        >
      </div>
    </q-scroll-area>
  </q-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ActivityItem from 'src/pages/file-system/components/activity-item.vue'
// data
const activitySidebar = ref(false)
</script>
