<template>
  <q-expansion-item
    group="permission-setting"
    expand-icon-toggle
    v-model="expanded"
    icon="r_none"
    expand-icon="none"
    expanded-icon="none"
    class="bg-grey-1 rounded-borders service-charge-section"
  >
    <template #header>
      <div class="row items-center justify-between no-wrap full-width">
        <q-section-header
          :title="
            $t(
              'pages.account.serviceCharge.Cloud Computing Infrastructure Cost'
            )
          "
          :sub-title="
            $t(
              'pages.account.serviceCharge.Percentage of Atlas OS Service Charge applied to the Cloud Computing Infrastructure Cost in your month bill'
            )
          "
        ></q-section-header>
      </div>
    </template>
    <q-card class="bg-grey-1 q-pa-md rounded-borders">
      <q-card-section class="q-px-none row">
        <q-card class="bg-grey-2 no-box-shadow rounded-borders full-width">
          <q-card-section class="row">
            <div class="row justify-start items-center full-width">
              <div class="col-grow">
                <q-linear-progress
                  size="10px"
                  rounded
                  :value="cloudServiceChargePercent"
                  color="positive"
                  track-color="grey-4"
                />
              </div>
              <span class="q-pl-xs text-disable text-subtitle1 text-right">{{
                cloudServiceChargeText
              }}</span>
            </div>
            <q-alert
              type="warning"
              class="q-mt-sm full-width"
            >
              <span
                v-html="
                  $t(
                    'pages.account.serviceCharge.This service charge allows us to maintain this Atlas OS system'
                  )
                "
              ></span>
            </q-alert>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'

// data
const expanded = ref(true)
const serviceCharge = ref(0)

// computed
const cloudServiceChargeText = computed(() => {
  return `${serviceCharge.value}%`
})

const cloudServiceChargePercent = computed(() => {
  return serviceCharge.value / 100
})
</script>
<style lang="scss">
.service-charge-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
