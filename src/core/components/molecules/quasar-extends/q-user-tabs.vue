<template>
  <div class="q-user-tabs">
    <q-tabs
      v-model="activeTab"
      :vertical="!isMobile"
      :mobile-arrows="false"
      active-bg-color="grey-4"
      class="q-pa-md bg-white rounded-borders"
      content-class="bg-grey-1 no-border-radius"
    >
      <q-tab
        v-for="(tab, tabIndex) in items"
        :key="tabIndex + '_account-setting-tab'"
        :name="tab.userName"
        :label="tab.userName"
        class="account-setting-page__tab overflow-hidden"
        :active-class="'bg-grey-4 text-weight-bold'"
        content-class="account-setting-page__tab-content text-capitalize"
        @click="onSelectUser(tab)"
      >
      </q-tab>
    </q-tabs>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { UserInfo } from 'src/core/types/user-info'

// composables
const $q = useQuasar()

// props & emits
const props = defineProps<{
  selectedItem?: string
  items: UserInfo[]
}>()
const emits = defineEmits(['select'])
// data
const activeTab = ref<string | undefined>(props?.selectedItem)

//computed
const isMobile = computed(() => {
  return $q.screen.lt.md
})

// methods
function onSelectUser(user: UserInfo) {
  emits('select', user)
}
</script>
<style lang="scss">
.q-user-tabs {
  height: 100%;
  width: 100%;
  &__tab-content {
    width: 100%;
    text-align: left;
  }
}
</style>
