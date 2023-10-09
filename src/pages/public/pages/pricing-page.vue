<template>
  <div
    class="entries-page bg-grey-1 full-width column q-pt-xl"
    :class="{ 'q-px-md': isMobile, 'q-px-xl': !isMobile }"
  >
    <div class="col-12 q-mb-xl">
      <h2 class="text-positive text-weight-bold text-h4 q-my-none q-pb-md">
        {{ title }}
      </h2>
      <div
        class="column justify-start items-start text-caption text-disable q-pl-sm"
      >
        <template v-if="subTitles">
          <span
            v-for="(sub, subIndex) in subTitles"
            :key="subIndex + '__content-box-sub-title'"
            >{{ sub }}</span
          >
        </template>
      </div>
    </div>
    <div class="col-12 full-width">
      <div
        class="row justify-between items-stretch"
        :class="{ 'column reverse': isMobile }"
      >
        <div class="left-side col-12 col-md-8 q-px-xs row">
          <div class="col-12 row justify-between items-center">
            <h3
              id="current-atlas-os-cloud-computing-fee"
              class="text-primary text-weight-bold text-h6 q-my-none"
            >
              Current Atlas OS Cloud Computing Fee (CCF) schedule
            </h3>
            <q-btn-toggle
              v-model="isLinuxView"
              rounded
              size="md"
              toggle-color="positive"
              toggle-text-color="white"
              :options="filterOptions"
              class="text-normal shadow-1 col-md-auto"
            />
          </div>
          <div
            id="data-storage-cost"
            class="col-12 q-my-md"
          >
            <pricing-data-card
              title="Data Storage Cost"
              :rows="dataStorageCostRows"
              :columns="dataStorageCostColumns"
            ></pricing-data-card>
          </div>
          <div
            id="outbound-data-transmission-cost"
            class="col-12 col-md-7 q-my-md"
          >
            <pricing-data-card
              title="Outbound Data Transmission Cost (inbound data transmission is free)"
              :rows="outboundDataCostRows"
              :columns="outboundDataColumns"
            ></pricing-data-card>
          </div>
          <div
            id="ebs-volume-cost"
            class="col-12 col-md-5 q-my-md"
          >
            <pricing-data-card
              title="EBS Volume Cost"
              :rows="ebsVolumeCostRows"
              :columns="ebsVolumeCostColumns"
            ></pricing-data-card>
          </div>
          <div class="col-12 q-mt-xl">
            <h3
              id="ec2-instance-cost"
              class="text-primary text-weight-bold text-h6 q-my-none"
            >
              EC2 Instance Cost
            </h3>
          </div>
          <div
            id="general-purpose"
            class="col-12 q-my-md"
          >
            <pricing-data-card
              title="General Purpose"
              :rows="ec2GeneralPurposeCostRows"
              :columns="ec2InstanceCostColumns"
            ></pricing-data-card>
          </div>
          <div
            id="compute-optimized"
            class="col-12 q-my-md"
          >
            <pricing-data-card
              title="Compute Optimized"
              :rows="ec2ComputeOptimizedCostRows"
              :columns="ec2InstanceCostColumns"
            ></pricing-data-card>
          </div>
          <div
            id="memory-optimized"
            class="col-12 q-my-md"
          >
            <pricing-data-card
              title="Memory Optimized"
              :rows="ec2MemoryOptimizedCostRows"
              :columns="ec2InstanceCostColumns"
            ></pricing-data-card>
          </div>
          <div
            id="gpu-instances"
            class="col-12 q-my-md"
          >
            <pricing-data-card
              title="GPU Instances"
              :rows="ec2GPUInstancesCostRows"
              :columns="ec2InstanceCostColumns"
            ></pricing-data-card>
          </div>
        </div>
        <div
          class="right-side col-12 col-md-4 q-mb-xl"
          :class="{ 'q-pl-md': !isMobile }"
        >
          <table-of-content
            :items="teamContents"
            class="q-mb-md"
          ></table-of-content>
          <pricing-note-card></pricing-note-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import PricingNoteCard from 'src/pages/public/components/pricing/pricing-note-card.vue'
import PricingDataCard from 'src/pages/public/components/pricing/pricing-data-card.vue'
import { httpsGetUserPricing } from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { UserPricing } from 'src/core/types/user-pricing-types'
import TableOfContent from 'src/pages/public/components/table-of-content.vue'
import { PublicItem } from 'src/core/types/public-item-types'

const $q = useQuasar()

// data
const title = 'Atlas OS Pricing'
const subTitles = [
  'Effective Date: January 8th, 2019',
  'Applicable To The Following Website:atlas-os.org',
]
const isLinuxView = ref(true)
const filterOptions = [
  { label: 'Linux', value: true },
  { label: 'Window', value: false },
]

const teamContents: PublicItem[] = [
  {
    label: 'Current Atlas OS Cloud Computing Fee (CCF) schedule',
    to: 'current-atlas-os-cloud-computing-fee',
    childrens: [
      {
        label: 'Data Storage Cost',
        to: 'data-storage-cost',
      },
      {
        label: 'Outbound Data Transmission Cost',
        to: 'outbound-data-transmission-cost',
      },
      {
        label: 'EBS Volume Cost',
        to: 'ebs-volume-cost',
      },
    ],
  },
  {
    label: 'EC2 Instance Cost',
    to: 'ec2-instance-cost',
    childrens: [
      {
        label: 'General Purpose',
        to: 'general-purpose',
      },
      {
        label: 'Compute Optimized',
        to: 'compute-optimized',
      },
      {
        label: 'Memory Optimized',
        to: 'memory-optimized',
      },
      {
        label: 'GPU Instances',
        to: 'gpu-instances',
      },
    ],
  },
]
const pricingData = ref<{
  C: UserPricing[]
  D: UserPricing[]
  E: UserPricing[]
  G: UserPricing[]
  M: UserPricing[]
  O: UserPricing[]
  P: UserPricing[]
}>()
const dataStorageCostColumns = [
  {
    name: 'col1',
    label: 'Type',
    field: 'col1',
    align: 'left',
  },
  {
    name: 'col2',
    label: 'Frequent Access',
    field: 'col2',
    align: 'left',
  },
  {
    name: 'col3',
    label: 'Infrequent Access',
    field: 'col3',
    align: 'left',
  },
  {
    name: 'col4',
    label: 'Archive (Glacier)',
    field: 'col4',
    align: 'left',
  },
]
const outboundDataColumns = [
  {
    name: 'col1',
    label: 'Type',
    field: 'col1',
    align: 'left',
  },
  {
    name: 'col2',
    label: 'Outbound Data Transmission',
    field: 'col2',
    align: 'left',
  },
]
const ebsVolumeCostColumns = [
  {
    name: 'col1',
    label: 'Type',
    field: 'col1',
    align: 'left',
  },
  {
    name: 'col2',
    label: 'EBS Volume',
    field: 'col2',
    align: 'left',
  },
]
const ec2InstanceCostColumns = [
  {
    name: 'col1',
    label: 'Instance Type',
    field: 'col1',
    align: 'left',
  },
  {
    name: 'col2',
    label: 'vCPU',
    field: 'col2',
    align: 'left',
  },
  {
    name: 'col3',
    label: 'ECU',
    field: 'col3',
    align: 'left',
  },
  {
    name: 'col4',
    label: 'RAM (GB)',
    field: 'col4',
    align: 'left',
  },
  {
    name: 'col5',
    label: 'Price',
    field: 'col5',
    align: 'left',
  },
]
//computed
const dataStorageCostRows = computed(() => {
  if (!pricingData?.value?.D[0]?.price) {
    return []
  }
  const price = JSON.parse(pricingData?.value?.D[0]?.price) as {
    S: string
    I: string
    G: string
  }
  return [
    {
      col1: 'Pricing (GB/Month)',
      col2: formatPrice(price.S),
      col3: formatPrice(price.I),
      col4: formatPrice(price.G),
    },
  ]
})
const outboundDataCostRows = computed(() => {
  if (!pricingData?.value?.O[0]?.price) {
    return []
  }
  const price = pricingData?.value?.O[0]?.price
  return [
    {
      col1: 'Price (GB)',
      col2: formatPrice(price),
    },
  ]
})
const ebsVolumeCostRows = computed(() => {
  if (!pricingData?.value?.E[0]?.price) {
    return []
  }
  const price = JSON.parse(pricingData?.value?.E[0]?.price) as {
    SSD: string
  }
  return [
    {
      col1: 'Pricing (GB/Month)',
      col2: formatPrice(price.SSD),
    },
  ]
})

const ec2GeneralPurposeCostRows = computed(() => {
  return (
    pricingData?.value?.G?.filter((item) => {
      return isLinuxView.value ? !item?.windowsPrice : item?.windowsPrice
    }).map((item) => {
      return {
        col1: item?.instanceType,
        col2: item?.vcpu,
        col3: item?.ecu,
        col4: item?.memory,
        col5: formatPrice(item?.price ?? '0'),
      }
    }) ?? []
  )
})

const ec2ComputeOptimizedCostRows = computed(() => {
  return (
    pricingData?.value?.C.filter((item) => {
      return isLinuxView.value ? !item?.windowsPrice : item?.windowsPrice
    }).map((item) => {
      return {
        col1: item?.instanceType,
        col2: item?.vcpu,
        col3: item?.ecu,
        col4: item?.memory,
        col5: formatPrice(item?.price ?? '0'),
      }
    }) ?? []
  )
})

const ec2MemoryOptimizedCostRows = computed(() => {
  return (
    pricingData?.value?.M.filter((item) => {
      return isLinuxView.value ? !item?.windowsPrice : item?.windowsPrice
    }).map((item) => {
      return {
        col1: item?.instanceType,
        col2: item?.vcpu,
        col3: item?.ecu,
        col4: item?.memory,
        col5: formatPrice(item?.price ?? '0'),
      }
    }) ?? []
  )
})

const ec2GPUInstancesCostRows = computed(() => {
  return (
    pricingData?.value?.P.filter((item) => {
      return isLinuxView.value ? !item?.windowsPrice : item?.windowsPrice
    }).map((item) => {
      return {
        col1: item?.instanceType,
        col2: item?.vcpu,
        col3: item?.ecu,
        col4: item?.memory,
        col5: formatPrice(item?.price ?? '0'),
      }
    }) ?? []
  )
})
const isMobile = computed(() => {
  return $q.screen.lt.sm
})

// methods
async function onFetchingPricingData() {
  const result = await httpsGetUserPricing()
  if (result?.code === RESPONSE_CODE.SUCCESS) {
    pricingData.value = result?.data
  }
}

function formatPrice(price: string) {
  const curenccy = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return curenccy.format(Number(price))
}
onMounted(() => {
  onFetchingPricingData()
})
</script>
