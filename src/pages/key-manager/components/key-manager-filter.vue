<template>
  <div class="row justify-end items-center key-manager-filter">
    <q-input
      dense
      filled
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-grey-1 col-12 col-md-6"
      :class="{ 'col-md-6': !fullWidth, 'col-md-12': fullWidth }"
      @keypress.enter="onStartSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

// props & emits
const emits = defineEmits(['update:modelValue', 'close', 'search', 'select'])
const props = defineProps<{ modelValue?: string; fullWidth?: boolean }>()

// computed

const search = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

function onStartSearch() {
  emits('search', search.value)
}
</script>

<style lang="scss">
.key-manager-filter {
  .q-btn--outline:before {
    border: 1px solid $grey-5;
  }

  &__filter {
    border: 1px solid $grey-5;
  }

  &__filter .q-btn {
    flex-grow: 1;
  }
}
</style>
