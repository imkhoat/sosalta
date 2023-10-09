<template>
  <div class="key-manager-list full-width">
    <q-card
      flat
      class="full-height"
    >
      <q-card-section class="row justify-between">
        <div
          class="key-manager-list__title column justify-center items-start q-mb-md col-12 col-md-6"
        >
          <strong class="title text-subtitle1 text-weight-bold">{{
            $t(`pages.keyManager.table.Key lists`)
          }}</strong>
          <span class="subtitle text-caption text-disable">{{
            $t(`pages.keyManager.table.Click download to save keys`)
          }}</span>
        </div>
        <key-manager-filter
          :full-width="true"
          class="col-12 col-md-4"
          v-model="searchKeyword"
          @search="onSearching"
        ></key-manager-filter>
      </q-card-section>
      <q-card-section class="column q-col-gutter-md">
        <div class="row q-col-gutter-md">
          <div
            v-for="(key, index) in paginationItems"
            :key="index + '__key-manager-list'"
            class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
          >
            <q-card
              flat
              class="bg-grey-1 q-pa-xs"
            >
              <q-card-section
                class="row justify-start items-start q-gutter-x-sm q-pa-sm no-wrap bg-grey-2"
              >
                <q-avatar
                  color="grey-1"
                  text-color="primary-5"
                  size="40px"
                  class="cursor-pointer"
                  @click="onDownloadKey(key)"
                >
                  <q-avatar
                    color="grey-3"
                    text-color="primary-5"
                    size="25px"
                  >
                    <q-icon
                      size="sm"
                      name="sym_o_download"
                    ></q-icon>
                  </q-avatar>
                </q-avatar>
                <div class="column justify-start items-stretch col-grow">
                  <strong
                    class="key-manager-list__item-title ellipsis text-body2 text-weight-bold text-no-wrap"
                  >
                    {{ key.name }}
                  </strong>
                  <span class="text-caption text-disable">{{
                    $t(`pages.keyManager.table.Create at`, {
                      time: key.gmtCreateString,
                    })
                  }}</span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row justify-end q-col-gutter-md">
          <q-pagination-box v-model="pagination"></q-pagination-box>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { SymmetricKey } from 'src/core/types/symmetric-key'
import KeyManagerFilter from 'src/pages/key-manager/components/key-manager-filter.vue'

// props
const props = defineProps<{
  items: SymmetricKey[]
}>()

// data
const searchKeyword = ref('')
const clientSearchItems = ref(props.items)
const pagination = reactive<{
  sortBy: 'desc' | 'asc'
  descending: boolean
  page: number
  rowsPerPage: number | 'ALL'
  rowsNumber: number
  totalPages: number
}>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 10,
  totalPages: 0,
})
//computed
const paginationItems = computed(() => {
  const from =
    pagination.rowsPerPage === 'ALL'
      ? 0
      : (pagination.page - 1) * pagination.rowsPerPage
  const to =
    pagination.rowsPerPage === 'ALL'
      ? pagination.rowsNumber
      : pagination.page * pagination.rowsPerPage

  return clientSearchItems.value?.slice(from, to)
})
// methods
function onDownloadKey(key: SymmetricKey) {
  const link = document.createElement('a')
  const file = new Blob([key.symmetricKey], { type: 'text/plain' })
  link.href = URL.createObjectURL(file)
  link.download = `${key.name}.txt`
  link.click()
  link.remove()
  console.log(key)
}

function onSearching(keyword: string) {
  if (!keyword) {
    clientSearchItems.value = props.items
  }
  clientSearchItems.value = props.items?.filter((item) => {
    return `${item.userName}-${item.symmetricKey}-${item.name}`.includes(
      keyword
    )
  })
}

watch(
  () => props.items,
  (newVal) => {
    pagination.rowsNumber = newVal.length
    pagination.totalPages = newVal.length / pagination.rowsPerPage

    if (pagination.totalPages * pagination.rowsPerPage < newVal.length) {
      pagination.totalPages = pagination.totalPages + 1
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => props.items,
  (newVal: SymmetricKey[]) => {
    clientSearchItems.value = newVal
  }
)
</script>
<style lang="scss">
.key-manager-list {
  &__item-title {
    width: 80%;
  }
}
</style>
