<template>
  <q-card
    flat
    class="notification-list full-height column justify-between items-stretch"
  >
    <q-card-actions
      class="notification-list__input row justify-between items-center q-gutter-y-sm border-bottom q-pb-none"
    >
      <q-tabs
        v-model="tab"
        no-caps
        @update:model-value="emits('change', tab)"
      >
        <q-tab
          name="all"
          label="All"
        />
        <q-tab
          name="read"
          label="Read"
        />
        <q-tab
          name="unRead"
          label="Unread"
        />
      </q-tabs>
      <q-btn-dropdown
        flat
        split
        color="brand"
        label="Close"
        class="text-normal bg-grey-1"
        @click="emits('close')"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
          >
            <q-item-section
              class="col-grow text-weight-medium q-ml-none"
              @click="emits('mark-all')"
              >Mark all as read</q-item-section
            >
          </q-item>
          <q-item
            clickable
            v-close-popup
          >
            <q-item-section
              class="col-grow text-weight-medium q-ml-none"
              @click="emits('delete-all')"
              >Delete all</q-item-section
            >
          </q-item>
          <q-item
            clickable
            :disable="!isSelectedNoti"
            v-close-popup
          >
            <q-item-section
              class="col-grow text-weight-medium q-ml-none"
              @click="emits('delete-selected', selectedNoties)"
              >Delete selected</q-item-section
            >
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-card-actions>
    <q-card-section class="col-grow q-pa-none bg-grey-1">
      <q-scroll-area class="full-height q-pa-md">
        <q-card
          flat
          v-if="loading"
          class="bg-grey-1"
        >
          <q-card-section>
            <template
              v-for="i in 20"
              :key="i + '__notification-list-skeleton'"
            >
              <q-skeleton
                type="text"
                width="30%"
                class="text-caption"
              />
              <q-skeleton
                type="text"
                class="text-subtitle1"
              />
              <q-skeleton
                type="text"
                class="text-subtitle1 q-mb-md"
              />
            </template>
          </q-card-section>
        </q-card>
        <q-list v-else>
          <template
            v-for="(noti, index) in items"
            :key="index + '__notification-list'"
          >
            <q-item
              clickable
              class="rounded-borders"
              @click="onSelectNotification(noti)"
            >
              <q-item-section avatar>
                <q-avatar
                  color="grey-1"
                  text-color="primary-5"
                  size="44px"
                  class="q-mr-sm"
                >
                  <q-avatar
                    color="grey-3"
                    text-color="primary-5"
                    size="34px"
                  >
                    <q-icon
                      size="18px"
                      :name="
                        noti?.type === 'register'
                          ? 'sym_o_app_registration'
                          : 'sym_o_folder_shared'
                      "
                    ></q-icon>
                  </q-avatar>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  class="notification-list__title"
                  :class="{ 'text-brand text-weight-bold': !noti?.flag }"
                  >{{ noti?.title }}</q-item-label
                >
                <q-item-label
                  caption
                  class="notification-list__subtitle"
                  >{{
                    noti?.contentFormated?.fileName ??
                    noti?.contentFormated?.registerContent
                  }}</q-item-label
                >
              </q-item-section>
              <q-item-section
                side
                top
              >
                <q-item-label caption>{{
                  noti?.createdTimeString
                }}</q-item-label>
                <q-checkbox
                  dense
                  v-model="selectedNoties"
                  :val="noti"
                ></q-checkbox>
              </q-item-section>
            </q-item>
            <q-separator
              spaced
              inset
            />
          </template>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { UserNotification } from 'src/core/types/use-notification-types'
import { computed, ref } from 'vue'

// propsß
defineProps<{
  items: UserNotification[]
  loading: boolean
}>()
const emits = defineEmits([
  'change',
  'mark-all',
  'update-flag',
  'close',
  'delete-all',
  'delete-selected',
  'show-detail',
])

//data
const tab = ref('all')
const selectedNoties = ref<UserNotification[]>([])

//computed
const isSelectedNoti = computed(() => {
  return selectedNoties.value?.length > 0
})
// methods
function onSelectNotification(item: UserNotification) {
  if (!item?.flag) {
    emits('update-flag', item)
  }
  emits('show-detail', item)
}
</script>
<style lang="scss">
.notification-list {
  &__title {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtitle {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
