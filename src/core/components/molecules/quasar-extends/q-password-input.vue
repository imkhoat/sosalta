<template>
  <q-input
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
    v-model="password"
  >
    <template v-slot:append>
      <q-icon
        :name="showPassword ? 'sym_o_key' : 'sym_o_key_off'"
        class="cursor-pointer"
        @click="toggleShowPassword"
      />
    </template>
  </q-input>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'

// props & emits
const props = defineProps<{
  modelValue: string
}>()
const emits = defineEmits(['update:modelValue'])

// data
const showPassword = ref(false)

// computed
const password = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

//methods
function toggleShowPassword() {
  showPassword.value = !showPassword.value
}
</script>
