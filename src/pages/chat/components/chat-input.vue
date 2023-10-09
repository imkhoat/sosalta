<template>
  <div
    class="chat-entries__input column justify-start items-start q-gutter-y-sm border-top full-width"
  >
    <q-input
      outlined
      v-model="form.message"
      autogrow
      placeholder="Enter your message..."
      type="textarea"
      class="full-width"
    >
    </q-input>
    <div class="row justify-end items-center q-gutter-sm full-width">
      <q-btn
        rounded
        flat
        size="md"
        unelevated
        icon="sym_o_add_reaction"
      >
        <q-menu>
          <q-card
            class="chat-entries__emoji"
            flat
          >
            <q-card-section class="q-pa-xs">
              <EmojiPicker
                :native="true"
                @select="onSelectEmoji"
              />
            </q-card-section>
          </q-card>
        </q-menu>
      </q-btn>
      <q-btn
        rounded
        flat
        size="md"
        unelevated
        icon="sym_o_attach_file"
      >
      </q-btn>
      <q-btn
        color="primary"
        unelevated
        icon="sym_o_send"
        class="self-end"
        >Send</q-btn
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import 'vue3-emoji-picker/css'
import { reactive, ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'

const form = reactive({
  message: '',
})
const tab = ref('private')

function onSelectEmoji(emoji: EmojiPicker) {
  form.message += emoji.i
}
</script>
<style lang="scss">
.chat-entries {
  &__emoji .v3-emoji-picker {
    box-shadow: none;
  }
}
</style>
