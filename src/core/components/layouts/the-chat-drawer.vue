<template>
  <q-btn
    size="sm"
    rounded
    round
    flat
    @click="toggleDrawer()"
  >
    <q-icon
      size="22px"
      name="sym_o_chat_bubble"
    ></q-icon>
  </q-btn>
  <q-drawer
    v-model="drawer"
    :width="400"
    :breakpoint="500"
    overlay
    bordered
    side="right"
  >
    <chat-entries></chat-entries>
  </q-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ChatEntries from 'src/pages/chat/components/chat-entries.vue'

const drawer = ref(false)

function toggleDrawer() {
  drawer.value = !drawer.value
}
</script>
