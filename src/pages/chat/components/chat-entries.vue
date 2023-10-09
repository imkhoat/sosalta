<template>
  <q-card
    flat
    class="chat-entries full-height column justify-between items-stretch"
  >
    <q-card-actions
      class="chat-entries__input column justify-start items-stretch q-gutter-y-sm border-bottom q-pb-none"
    >
      <div class="row justify-between items-center full-width">
        <q-btn
          rounded
          size="md"
          round
          flat
          color="primary"
          unelevated
          icon="sym_o_arrow_back"
        ></q-btn>
        <q-space></q-space>
        <q-btn
          rounded
          size="md"
          round
          flat
          color="primary"
          unelevated
          icon="sym_o_person_add"
        ></q-btn>
        <q-btn
          rounded
          size="md"
          round
          flat
          color="primary"
          unelevated
          icon="sym_o_more_vert"
        ></q-btn>
      </div>
      <q-tabs
        inline-label
        v-model="tab"
        no-caps
      >
        <q-tab
          name="private"
          label="Private"
        />
        <q-tab
          name="team"
          label="Team"
        />
        <q-tab
          name="conference"
          label="Conference"
        />
        <q-tab
          name="project"
          label="Project"
        />
      </q-tabs>
    </q-card-actions>
    <q-card-section class="chat-entries__messages col-grow q-pa-none">
      <chat-room-list v-if="currentStep === 'CHAT_ROOM_LIST'"></chat-room-list>
      <chat-room v-else></chat-room>
    </q-card-section>
    <q-card-actions class="chat-entries__input full-width">
      <chat-input />
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import 'vue3-emoji-picker/css'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import ChatInput from 'src/pages/chat/components/chat-input.vue'
import ChatRoom from 'src/pages/chat/components/chat-room.vue'
import ChatRoomList from 'src/pages/chat/components/chat-room-list.vue'
import { useChats } from '../hooks/use-chats'
import { useAuthStore } from 'src/core/stores/auth'

//composable
const { queryEntry, initConnection } = useChats()
const { getUserName } = storeToRefs(useAuthStore())
const { setAuthenticationToken, getAuthenticationToken } = useAuthStore()

const tab = ref('private')
const currentStep = ref<'CHAT_ROOM_LIST' | 'CHAT_ROOM'>('CHAT_ROOM_LIST')

// method
function onInitConnection() {
  queryEntry(getUserName.value, getAuthenticationToken(), initConnection)
}
</script>
<style lang="scss">
.chat-entries {
  &__emoji .v3-emoji-picker {
    box-shadow: none;
  }
}
</style>
