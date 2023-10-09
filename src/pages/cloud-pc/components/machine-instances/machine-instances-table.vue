<template>
  <q-card
    flat
    class="cloudpc-machine-instances-table full-width"
  >
    <q-card-section class="q-pt-xl">
      <machine-instances-filter
        :items="users ?? []"
        :model-filter="activeUser"
        v-model="searchKeyword"
        @search="onSearching"
        @select="emits('select', $event)"
      ></machine-instances-filter>
      <q-alert
        type="warning"
        class="q-my-md"
      >
        <q-chip
          size="sm"
          square
          class="no-border-radius"
          >Warning:</q-chip
        >
        All Cloud PC instances (Machine Instances) are metered in real-time. All
        non-shutdown (e.g., running or paused) Cloud PC instances will incurr
        cost (paused intances will incurr significantly less, but non-zero, cost
        than running instances). To avoid incurring unnecessary cost, please
        shutdown your Cloud PC instances promptly after use, using controls at
        the bottom of detail instance modal.
      </q-alert>
    </q-card-section>
    <q-card-section>
      <q-table
        ref="machineInstanceTableRef"
        selection="multiple"
        flat
        bordered
        muti
        class="full-width"
        :columns="columns"
        :rows="items"
        :loading="loading"
        v-model:pagination="pagination"
        v-model:selected="selectedMachineInstances"
        @request="onPaginationRequest"
      >
        <template v-slot:body-cell-machine_instance_name="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <div class="row justify-start items-center no-wrap">
              <machine-instances-status-icon
                :item="props.row"
              ></machine-instances-status-icon>
              <div class="column justify-start items-start q-ml-xs">
                <strong
                  >{{ props.row.instanceName }}
                  <q-btn
                    flat
                    round
                    size="sm"
                    class="text-normal text-primary"
                    @click="onViewDetail(props.row)"
                  >
                    <q-icon name="sym_o_info"></q-icon>
                    <q-tooltip max-width="480px">
                      Click to view detail machine instance
                    </q-tooltip>
                  </q-btn>
                </strong>
                <span class="text-caption text-disable"
                  >Launch by {{ props.row.createdBy }}</span
                >
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-machine_instance_status="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <q-chip
              dense
              flat
              :color="props.row.statusDetail.bgColor"
              :text-color="props.row.statusDetail.textColor"
              class="text-caption q-px-sm"
              >{{ props.row.statusDetail.name }}</q-chip
            >
          </q-td>
        </template>
        <template v-slot:body-cell-machine_instance_cost="props">
          <q-td
            :props="props"
            class="cursor-pointer"
          >
            <span class="text-right block">${{ props.row.totalCost }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-machine_instance_action="props">
          <q-td :props="props">
            <div>
              <q-btn
                unelevated
                size="sm"
                color="positive"
                class="text-normal text-primary q-px-sm"
                @click="onViewDetailMachine(props.row)"
              >
                <q-icon name="sym_o_info"></q-icon>
                VIEW DETAIL
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
import { MachineInstance } from 'src/core/types/machine-instance-types'
import { useCloudPCMachineInstances } from 'src/pages/cloud-pc/hooks/use-machine-instances'
import MachineInstancesFilter from 'src/pages/cloud-pc/components/machine-instances/machine-instances-filter.vue'
import MachineInstancesStatusIcon from 'src/pages/cloud-pc/components/machine-instances/machine-instances-status-icon.vue'

// composables
const $q = useQuasar()
const { pagination, searchKeyword, selectedMachineInstances, onViewDetail } =
  useCloudPCMachineInstances()

// props & emits
const props = defineProps<{
  items: MachineInstance[] | undefined
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
const machineInstanceTableRef = ref()

const columns: QTableColumn[] = [
  {
    name: 'machine_instance_name',
    field: 'instanceName',
    label: 'Instance ID | Name',
    classes: 'instance-column instance-column__name',
    headerClasses: 'user-column-header user-column-header__name',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_instance_submit-time',
    field: 'gmtStartByString',
    label: 'Submit time',
    classes: 'instance-column instance-column__submit-time',
    headerClasses: 'user-column-header user-column-header__submit-time',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_instance_end-time',
    field: 'gmtEndByString',
    label: 'End time',
    classes: 'instance-column instance-column__end-time',
    headerClasses: 'user-column-header user-column-header__end-time',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_instance_duration',
    field: 'duration',
    label: 'Durantion',
    classes: 'instance-column instance-column__duration',
    headerClasses: 'user-column-header user-column-header__duration',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_instance_status',
    field: 'statusString',
    label: 'Status',
    classes: 'instance-column instance-column__status',
    headerClasses: 'user-column-header user-column-header__status',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_instance_cost',
    field: 'totalCost',
    label: 'Cost',
    classes: 'instance-column instance-column__cost',
    headerClasses: 'user-column-header user-column-header__cost',
    required: true,
    align: 'left',
  },
  {
    name: 'machine_instance_action',
    field: 'machine_instance_action',
    label: 'Action',
    classes: 'instance-column instance-column__action',
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

function onViewDetailMachine(instance: MachineInstance) {
  onViewDetail(instance)
  emits('view-detail')
}
// hooks
onMounted(() => {
  machineInstanceTableRef.value?.requestServerInteraction()
})
</script>
<style lang="scss">
.cloudpc-machine-instances-table {
  thead tr:first-child th {
    background-color: $primary-05;
    font-weight: bold;
    color: $primary-4;
    opacity: 0.5;
  }
}
</style>
