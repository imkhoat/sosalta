<template>
  <div class="chat-room">
    <q-chat-message
      v-for="i in 100"
      :key="i"
      :name="i % 2 === 0 ? 'Me' : 'Alex'"
      :text="['hey, how are you?']"
      stamp="7 minutes ago"
      :sent="i % 2 === 0"
      :bg-color="i % 2 !== 0 ? 'grey-3' : 'blue-14'"
      :text-color="i % 2 !== 0 ? 'primary' : 'white'"
    />
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  items?: any[]
}>()
</script>
