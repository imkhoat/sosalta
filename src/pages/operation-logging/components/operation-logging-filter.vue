<template>
  <div
    class="row justify-end items-center operation-logging-filter q-gutter-y-md q-gutter-sm-x-md"
  >
    <q-input
      dense
      filled
      v-model="search"
      placeholder="Search..."
      class="rounded-borders bg-grey-1 col-grow col-md-6"
      @keypress.enter="onSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-filter>
      <q-card class="operation-logging-filter__content">
        <q-card-section>
          <q-select
            label="Username"
            stack-label
            outlined
            dense
            hide-bottom-space
            v-model="userName"
            emit-value
            map-options
            :options="userNames"
            option-label="userName"
            option-value="userName"
            class="operation-logging-filter__username q-mb-md"
          />
          <q-input
            label="Time range"
            stack-label
            outlined
            dense
            hide-bottom-space
            :model-value="`${filterDate?.from} ~ ${filterDate?.to}`"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filterDate"
                    dense
                    range
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        @click="onSetDateRange"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions>
          <q-form-actions :actions="formActions"></q-form-actions>
        </q-card-actions>
      </q-card>
    </q-filter>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { MemberUser } from 'src/core/types/services/user-types'
import { useOperationLogging } from 'src/pages/operation-logging/hooks/use-operation-logging'
import { filter } from 'lodash'

// composables
const { handleGetManagingUsersWithMe } = useOperationLogging()
// props & emits
const emits = defineEmits(['update:modelValue', 'close', 'search', 'select'])
const props = withDefaults(
  defineProps<{
    modelValue: {
      fromDate?: string
      toDate?: string
      userName?: string
      keyword?: string
    }
  }>(),
  {}
)

// data
const userNames = ref<Partial<MemberUser>[]>([])
const filterUser = ref()
const filterDate = ref({ from: '2023/06/27', to: '2023/06/30' })
// computed

const formActions = computed((): ActionProp[] => {
  return [
    {
      type: 'primary',
      color: 'primary',
      flat: true,
      name: 'Cancel',
      action: onCancel,
    },
    {
      color: 'primary',
      flat: true,
      class: 'bg-grey-1',
      name: 'Search',
      action: onSearch,
    },
  ]
})
const search = computed({
  get() {
    return props.modelValue?.keyword
  },
  set(value) {
    console.log({ userName: userName.value, keyword: value })
    emits('update:modelValue', { userName: userName.value, keyword: value })
  },
})

const userName = computed({
  get() {
    return props.modelValue?.userName
  },
  set(value) {
    console.log({ keyword: search.value, userName: value })
    emits('update:modelValue', { keyword: search.value, userName: value })
  },
})

// methods
function onCancel() {
  console.log('Cancel')
}
function onSearch() {
  emits('search')
}

function onSetDateRange() {
  emits('update:modelValue', {
    ...props.modelValue,
    fromDate: filterDate?.value?.from,
    toDate: filterDate?.value?.to,
  })
}

async function onFetchingData() {
  userNames.value = await handleGetManagingUsersWithMe()
}

onFetchingData()
</script>

<style lang="scss">
.operation-logging-filter {
  .q-btn--outline:before {
    border: 1px solid $grey-5;
  }

  &__filter {
    border: 1px solid $grey-5;
  }

  &__filter .q-btn {
    flex-grow: 1;
  }

  &__content {
    min-width: 300px;
  }
}
</style>
