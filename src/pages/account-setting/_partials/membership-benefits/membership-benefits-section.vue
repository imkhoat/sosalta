<template>
  <q-expansion-item
    group="permission-setting"
    expand-icon-toggle
    v-model="expanded"
    icon="r_none"
    expand-icon="none"
    expanded-icon="none"
    class="bg-grey-1 rounded-borders membership-benefits-section"
  >
    <template #header>
      <div class="row items-center justify-between no-wrap full-width">
        <q-section-header
          :title="$t('pages.account.membershipBenefits.Benefits')"
          :sub-title="
            $t(
              'pages.account.membershipBenefits.You can upgrade the benefits of your account by upgrading your subscription'
            )
          "
        ></q-section-header>
      </div>
    </template>
    <q-card class="bg-grey-1 q-pa-md rounded-borders">
      <q-card-section class="q-px-none row">
        <q-list
          bordered
          class="rounded-borders col-12 col-md-9 col-lg-6"
        >
          <q-item-label
            header
            class="text-uppercase"
            >{{
              $t(
                'pages.account.membershipBenefits.Total File System Storage Limit'
              )
            }}</q-item-label
          >
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t('pages.account.membershipBenefits.Max total stored file')
              }}</q-item-label>
              <q-item-label caption>
                {{
                  $t(
                    'pages.account.membershipBenefits.You can store up to this data'
                  )
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="maxStorageCapacity"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset
          />
          <q-item-label
            header
            class="text-uppercase"
            >{{
              $t('pages.account.membershipBenefits.Member User Limit')
            }}</q-item-label
          >
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t(
                  'pages.account.membershipBenefits.Max number of member users allowed'
                )
              }}</q-item-label>
              <q-item-label caption>
                {{
                  $t(
                    'pages.account.membershipBenefits.With your main account, you are allowed to create the maximum number of members below'
                  )
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="maxMemberAccountNumber"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset="item"
          />
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t(
                  'pages.account.membershipBenefits.Existing number of member users'
                )
              }}</q-item-label>
              <q-item-label caption>{{
                $t(
                  'pages.account.membershipBenefits.To allocate new members remove inactive members'
                )
              }}</q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="existingMemberUsers"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset
          />
          <q-item-label
            header
            class="text-uppercase"
            >{{
              $t('pages.account.membershipBenefits.Concurrent Service Limit')
            }}</q-item-label
          >
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t('pages.account.membershipBenefits.Concurrent Cloud PC Limit')
              }}</q-item-label>
              <q-item-label caption>
                {{
                  $t(
                    'pages.account.membershipBenefits.Running machine will consume a lot of resources Limit will help you avoid waste'
                  )
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="maxCloudpcsNumber"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset="item"
          />
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t(
                  'pages.account.membershipBenefits.Concurrent Analysis Task Limit'
                )
              }}</q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="maxAnalysisAppsNumber"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset
          />
          <q-item-label
            header
            class="text-uppercase"
            >{{
              $t('pages.account.membershipBenefits.Cloud PC Instance Limit')
            }}</q-item-label
          >
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t('pages.account.membershipBenefits.Max hourly charge')
              }}</q-item-label>
              <q-item-label caption>
                {{
                  $t(
                    'pages.account.membershipBenefits.You can only select instance types with an hour charge lower than the following'
                  )
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="maxCloudpcHourlyCharge"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset="item"
          />
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t(
                  'pages.account.membershipBenefits.Max Cloud PC Hard Drive Size'
                )
              }}</q-item-label>
              <q-item-label caption>
                {{
                  $t(
                    'pages.account.membershipBenefits.You can only select instance types with a drive size lower than the following value'
                  )
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="hardDiskSize"
              />
            </q-item-section>
          </q-item>
          <q-separator
            spaced
            inset
          />
          <q-item-label
            header
            class="text-uppercase"
            >{{
              $t('pages.account.membershipBenefits.Unpaid Fee Limit')
            }}</q-item-label
          >
          <q-item>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{
                $t('pages.account.membershipBenefits.Max allowed unpaid fee')
              }}</q-item-label>
              <q-item-label caption>
                {{
                  $t(
                    'pages.account.membershipBenefits.You are allowed to use the resources without prepayment as follows'
                  )
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              side
              top
            >
              <q-badge
                color="primary"
                class="no-border-radius"
                :label="maxAllowedUnpaidFee"
              />
            </q-item-section>
          </q-item>
          <div class="full-width q-pa-md">
            <q-alert type="warning">
              <span
                v-html="
                  $t('pages.account.membershipBenefits.Previously Unpaid Bills')
                "
              ></span>
            </q-alert>
          </div>
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useMemberCenterStore } from 'src/core/stores/member-center'

// composables
const { getAuthLimit, getUserDataVo } = useMemberCenterStore()

// computed
const maxStorageCapacity = computed(() => {
  return `${getAuthLimit.maxStorageCapacity} ${getAuthLimit.maxStorageCapacityUnit}`
})

const maxMemberAccountNumber = computed(() => {
  return getAuthLimit.maxMemberAccountNumber
})

const existingMemberUsers = computed(() => {
  return getUserDataVo.subUsers
})

const maxCloudpcsNumber = computed(() => {
  return getAuthLimit.maxCloudpcsNumber
})

const maxCloudpcHourlyCharge = computed(() => {
  return `${getAuthLimit.maxCloudpcHourlyCharge} ${getAuthLimit.maxCloudpcHourlyChargeUnit}`
})

const hardDiskSize = computed(() => {
  return `${getAuthLimit.hardDiskSize} ${getAuthLimit.hardDiskSizeUnit}`
})

const maxAllowedUnpaidFee = computed(() => {
  return `${getAuthLimit.maxAllowedUnpaidFee} ${getAuthLimit.maxCloudpcHourlyChargeUnit}`
})

const maxAnalysisAppsNumber = computed(() => {
  return getAuthLimit.maxAnalysisAppsNumber
})

const expanded = ref(true)
</script>
