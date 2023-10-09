<template>
  <q-card
    class="subscription-pack-item no-box-shadow"
    :class="{ 'bg-grey-2': itemSelected }"
    @click="onSelectPack"
  >
    <q-card-section
      class="subscription-pack-item__title row no-wrap justify-between items-start q-pb-none"
    >
      <strong>{{ item.name }}</strong>
      <q-radio
        class="subscription-pack-item__title-selector"
        v-model="selected"
        @update:model-value="onSelectPack"
        :val="item.value"
      />
    </q-card-section>
    <q-card-section class="column no-wrap justify-between items-stretch">
      <div class="row justify-between items-baseline">
        <strong class="text-h5 text-weight-bold"
          >${{ item.price }}
          <span
            v-if="item.originPrice > item.price"
            class="text-subtitle2 text-disable text-strike"
          >
            ${{ item.originPrice }}</span
          ></strong
        >
        <q-badge
          color="positive-1"
          text-color="positive"
          >{{ expireDate }}</q-badge
        >
      </div>
      <span class="text-disable text-caption"
        >Current subscription leftover fund: $675*1064/1095=$655.89</span
      >
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { useDateFormat } from '@vueuse/core'
import { SubscriptionPack } from 'src/core/types/subscription'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  itemSelected: boolean
  item: SubscriptionPack
}>()
const emits = defineEmits(['select'])
const selected = ref<string | number>('')

// computed
const expireDate = computed(() => {
  const d = new Date()
  if (props?.item?.day) {
    d.setDate(d.getDate() + parseInt(props.item.day?.toString()))
  }
  return `Expires On ${useDateFormat(d, 'YYYY-MM-DD HH:MM').value}`
})

// methods
function onSelectPack() {
  selected.value = props.item.value
  emits('select', props.item)
}

// watch
watch(
  () => props.itemSelected,
  (newVal) => {
    selected.value = newVal ? props.item.value : ''
  }
)
</script>
<style lang="scss">
.subscription-pack-item {
  &__title {
    border-bottom: 1px solid $grey-1;
  }

  &__title-selector {
    margin-top: -8px;
  }

  &:hover &__title {
    border-bottom: 1px solid $white;
  }
}
</style>
