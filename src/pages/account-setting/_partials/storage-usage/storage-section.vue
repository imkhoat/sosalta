<template>
  <q-expansion-item
    group="permission-setting"
    expand-icon-toggle
    v-model="expanded"
    icon="r_none"
    expand-icon="none"
    expanded-icon="none"
    class="bg-grey-1 rounded-borders storage-section"
  >
    <template #header>
      <div class="row items-center justify-between no-wrap full-width">
        <q-section-header
          title="Current storage usage"
          :sub-title="subTitleText"
        ></q-section-header>
      </div>
    </template>
    <q-card class="bg-grey-1 q-pa-md rounded-borders">
      <q-card-section class="q-px-none row">
        <q-circular-progress
          show-value
          :value="remaingStoragePercent"
          size="150px"
          :thickness="0.1"
          rounded
          color="primary"
          track-color="grey-3"
          class="col-12 col-sm-6 col-md-4 col-lg-2"
        >
          <div class="column justify-center items-center">
            <p class="text-subtitle2 text-disable q-mb-none">
              Remaining storage
            </p>
            <strong>{{ remaingStoragePercent }}%</strong>
          </div>
        </q-circular-progress>
        <div class="col-12 col-md-8 col-lg-10 q-mt-md q-mt-md-none">
          <q-list>
            <q-item
              dense
              v-for="(item, index) in storages"
              :key="index"
            >
              <div class="full-width">
                <div class="row justify-start items-start">
                  <q-icon
                    class="col-1"
                    :color="item.color"
                    name="fiber_manual_record"
                  />
                  <div class="col-10">
                    <q-item-label>{{ item.name }}</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      >{{ `${item.value} ${item.unit}` }}</q-item-label
                    >
                  </div>
                </div>
              </div>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMemberCenterStore } from 'src/core/stores/member-center'
import useCapacityDrive from 'src/core/composables/use-capacity-drive'

// composables
const {
  getUserDataVo,
  remaingStorageCapacity,
  totalUsageStorage,
  totalStorage,
} = useMemberCenterStore()
const { convertCapacity } = useCapacityDrive()

// data
const expanded = ref(true)

// computed
const storages = computed(() => {
  return [
    {
      name: 'Used by individual users',
      value: convertCapacity(getUserDataVo.userStorageCapacity, 'BYTE', 'GB'),
      unit: 'GB',
      color: 'pink-7',
    },
    {
      name: 'Used by Teams',
      value: convertCapacity(getUserDataVo.userGroupCapacity, 'BYTE', 'GB'),
      unit: 'GB',
      color: 'blue-6',
    },
    {
      name: 'Used by Projects:',
      value: convertCapacity(getUserDataVo.userProjectCapacity, 'BYTE', 'GB'),
      unit: 'GB',
      color: 'info',
    },
    {
      name: 'Used by DataDrive',
      value: convertCapacity(
        getUserDataVo.userDataDriverCapacity,
        'BYTE',
        'GB'
      ),
      unit: 'GB',
      color: 'warning',
    },
    {
      name: 'Used by DeveloperCenter',
      value: convertCapacity(
        getUserDataVo.userDeveloperCenterCapacity,
        'BYTE',
        'GB'
      ),
      unit: 'GB',
      color: 'green-6',
    },
  ]
})

const usageStorage = computed(() => {
  return convertCapacity(totalUsageStorage, 'BYTE', 'GB')
})

const remainingStorage = computed(() => {
  return convertCapacity(remaingStorageCapacity, 'BYTE', 'GB')
})

const totalStorageCapacity = computed(() => {
  return convertCapacity(totalStorage, 'BYTE', 'GB')
})

const subTitleText = computed(() => {
  return `${usageStorage.value} / ${totalStorageCapacity.value} GB used`
})

const remaingStoragePercent = computed(() => {
  return Math.trunc((remainingStorage.value / totalStorageCapacity.value) * 100)
})
</script>
<style lang="scss">
.storage-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
