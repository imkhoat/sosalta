<template>
  <q-card
    flat
    class="cloudpc-machine-image-table full-width"
  >
    <q-card-section class="q-pt-xl">
      <machine-images-filter
        :items="users"
        :model-filter="activeUser"
        v-model="searchKeyword"
        @search="onSearching"
        @select="emits('select', $event)"
      ></machine-images-filter>
      <q-alert
        type="warning"
        class="q-my-md"
      >
        <q-chip
          size="sm"
          square
          class="no-border-radius"
          >Attention:</q-chip
        >
        All Cloud PC usages are metered in real-time. To minimize cost, please
        shut down your Cloud PCs promptly after use.
      </q-alert>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="machineImageTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="items"
        :loading="loading"
        v-model:pagination="pagination"
        v-model:selected="selectedMachineImages"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-machine_image_name="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <div class="row justify-start items-center no-wrap">
              <q-avatar
                size="lg"
                color="grey-1"
              >
                <q-avatar
                  size="24px"
                  color="grey-3"
                >
                  <span class="text-caption text-disable">{{
                    props.row.id
                  }}</span>
                </q-avatar>
              </q-avatar>
              <div class="column justify-start items-start q-ml-xs">
                <strong
                  >{{ props.row.imageName }}
                  <q-btn
                    flat
                    round
                    size="sm"
                    class="text-normal text-primary"
                    @click="onViewDetailMachine(props.row)"
                  >
                    <q-icon name="sym_o_info"></q-icon>
                    <q-tooltip max-width="480px">
                      {{ props.row.imageInformation }}
                    </q-tooltip>
                  </q-btn>
                </strong>
                <span class="text-caption text-disable"
                  >Type {{ props.row.type }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-machine_image_type="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <q-chip
              dense
              flat
              class="bg-grey-1 text-primary text-caption q-px-sm"
              >{{ props.row.type }}</q-chip
            >
          </q-td>
        </template>
        <template v-slot:body-cell-machine_image_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                unelevated
                size="sm"
                color="positive"
                class="text-normal text-primary q-px-sm"
                @click="onRunMachineInstance(props.row)"
              >
                <q-icon name="sym_o_launch"></q-icon>
                LAUNCH A CLOUD PC
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { QTableColumn, useQuasar } from 'quasar'
import { computed, onMounted, reactive, ref } from 'vue'
import { useCloudPCMachineImages } from 'src/pages/cloud-pc/hooks/use-machine-images'
import MachineImagesFilter from 'src/pages/cloud-pc/components/machine-images/machine-images-filter.vue'
import { MachineImage } from 'src/core/types/machine-image-types'
import { UserInfo } from 'src/core/types/user-info'

// composables
const $q = useQuasar()
const {
  pagination,
  searchKeyword,
  selectedMachineImages,
  onRunMachineInstance,
  onViewDetail,
} = useCloudPCMachineImages()

// props & emits
const props = defineProps<{
  items: MachineImage[] | undefined
  users?: { label: string | undefined; value: string | undefined }[]
  loading: boolean
  activeUser: string
}>()
const emits = defineEmits(['request', 'search', 'select', 'view-detail'])
// data
const search = reactive({
  filter: '',
  keyword: '',
})
const machineImageTableRef = ref()

const columns: QTableColumn[] = [
  {
    name: 'machine_image_name',
    field: 'imageName',
    label: 'Image ID | Name',
    classes: 'user-column user-column__name',
    headerClasses: 'user-column-header user-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_image_type',
    field: 'type',
    label: 'Image Type',
    classes: 'user-column user-column__user-type',
    headerClasses: 'user-column-header user-column-header__user-type',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_image_action',
    field: 'machine_image_action',
    label: 'Action',
    classes: 'user-column user-column__action',
    headerClasses: 'user-column-header user-column-header__action',
    required: true,
    align: 'right',
  },
]

// computed
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
function onPaginationRequest(props: {
  filter?: any
  pagination: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
  }
  getCellValue: (col: any, row: any) => any
}) {
  emits('request', props)
}

function onSearching(props: string) {
  emits('search', props)
}

function onViewDetailMachine(image: MachineImage) {
  onViewDetail(image)
  emits('view-detail')
}

// hooks
onMounted(() => {
  machineImageTableRef.value?.requestServerInteraction()
})
</script>
<style lang="scss">
.cloudpc-machine-image-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
