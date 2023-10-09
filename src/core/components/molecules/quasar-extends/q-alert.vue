<template>
  <div
    class="q-alert text-caption"
    :class="[alertColorClass, alertBackgroundColorClass]"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  type:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'default'
    | 'positive'
    | 'negative'
}>()

const alertColorClass = computed(() => {
  return `text-${props.type}`
})
const alertBackgroundColorClass = computed(() => {
  switch (props.type) {
    case 'primary':
      return 'bg-grey-2'
    case 'info':
      return 'bg-indigo-1'
    case 'secondary':
      return 'bg-grey-2'
    case 'error':
      return 'bg-red-1'
    case 'warning':
      return 'bg-yellow-1'
    case 'success':
      return 'bg-green-1'
    case 'positive':
      return 'bg-green-1'
    default:
      return 'bg-grey-1'
  }
})
</script>
<style lang="scss" scoped>
$border-color: (
  'primary': $primary,
  'warning': $warning,
  'error': $negative,
  'info': $info,
  'success': $positive,
  'default': $dark,
) !default;
.q-alert {
  border-radius: 3px $generic-border-radius $generic-border-radius 3px;
  padding: map-get($map: $space-xs, $key: 'y')
    map-get($map: $space-sm, $key: 'x');
  border-left: 4px solid map-get($map: $border-color, $key: v-bind(type));
}
</style>
