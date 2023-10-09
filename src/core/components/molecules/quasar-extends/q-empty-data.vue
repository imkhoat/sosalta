<template>
  <q-card
    flat
    full-width
    class="full-width bg-transparent q-mt-none"
  >
    <q-card-section class="text-center">
      <span class="text-disable text-content">{{ content }}</span>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    content: string
  }>(),
  {
    content: 'Data not found.',
  }
)
</script>
