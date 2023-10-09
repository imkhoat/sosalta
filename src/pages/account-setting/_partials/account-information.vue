<template>
  <page-wrapper
    icon="r_account_box"
    :title="$t('pages.account.accountInformation.Account Setting')"
    :sub-title="
      $t('pages.account.accountInformation.Update your account information')
    "
    v-model="isEditing"
  >
    <template
      v-if="hasAllowEditBasicInformation"
      #header-action
    >
      <div
        v-if="!isEditing"
        class="account-information__actions"
      >
        <q-btn
          flat
          type="primary"
          color="primary"
          icon="r_edit"
          class="q-px-sm"
          @click="onToggleEdit(true)"
        ></q-btn>
      </div>
    </template>
    <div class="account-information__form">
      <div class="account-information__block">
        <q-section-header
          :title="$t('pages.account.accountInformation.Personal information')"
          :sub-title="
            $t(
              'pages.account.accountInformation.Use a permanent address where you can receive mail'
            )
          "
        ></q-section-header>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.FirstName') }}
          </div>
          <q-input
            id="first-name"
            stack-label
            :readonly="!isEditing"
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.trueName.firstName"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.LastName') }}
          </div>
          <q-input
            id="last-name"
            stack-label
            :readonly="!isEditing"
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.trueName.lastName"
          ></q-input>
        </div>
      </div>
      <q-separator></q-separator>
      <div class="account-information__block">
        <q-section-header
          :title="$t('pages.account.accountInformation.Personal address')"
          :sub-title="
            $t(
              'pages.account.accountInformation.Use a permanent address where you can receive mail'
            )
          "
        ></q-section-header>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Street Line 1') }}
          </div>
          <q-input
            id="street-line-1"
            stack-label
            :readonly="!isEditing"
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md width-twice col-12 col-md-7"
            v-model="form.address.streetLine1"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Street Line 2') }}
          </div>
          <q-input
            id="street-line-2"
            stack-label
            :readonly="!isEditing"
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md width-twice col-12 col-md-7"
            v-model="form.address.streetLine2"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.CityTown') }}
          </div>
          <q-input
            id="city-tower"
            stack-label
            :readonly="!isEditing"
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.address.cityTown"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.State') }}
          </div>
          <q-input
            id="state"
            :readonly="!isEditing"
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.address.state"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Nation') }}
          </div>
          <q-input
            id="nation"
            :readonly="!isEditing"
            stack-label
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.address.nation"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Zipcode') }}
          </div>
          <q-input
            id="zipcode"
            :readonly="!isEditing"
            stack-label
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.address.zipCode"
          ></q-input>
        </div>
      </div>
      <q-separator></q-separator>
      <div class="account-information__block">
        <q-section-header
          :title="$t('pages.account.accountInformation.Company profile')"
          :sub-title="
            $t(
              'pages.account.accountInformation.Use a permanent address where you can receive mail'
            )
          "
        ></q-section-header>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Company') }}
          </div>
          <q-input
            id="company"
            :readonly="!isEditing"
            stack-label
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md width-twice col-12 col-md-7"
            v-model="form.address.company"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Department') }}
          </div>
          <q-input
            id="department"
            :readonly="!isEditing"
            stack-label
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.address.department"
          ></q-input>
        </div>
        <div class="block-form row">
          <div class="text-subtitle2 col-12 col-md-3">
            {{ $t('pages.account.accountInformation.Office Phone') }}
          </div>
          <q-input
            id="office-phone"
            :readonly="!isEditing"
            stack-label
            outlined
            lazy-rules
            dense
            hide-bottom-space
            class="q-mb-md col-12 col-md-4"
            v-model="form.address.officePhone"
          ></q-input>
        </div>
      </div>
    </div>
    <template #footer-action>
      <div class="row full-width items-center">
        <q-alert
          type="warning"
          class="col-12 col-md-8 q-my-xs"
        >
          {{
            $t(
              'pages.account.accountInformation.Please provide your complete information'
            )
          }}
          <br />
          {{
            $t(
              'pages.account.accountInformation.It will help us to better communicate with you'
            )
          }}
        </q-alert>
        <q-space></q-space>
        <div
          v-if="hasAllowEditBasicInformation"
          class="col-12 col-md-4 row justify-end"
        >
          <q-btn
            flat
            type="primary"
            class="q-mr-sm"
            @click="onToggleEdit(false)"
            >{{ $t('textActions.Close') }}</q-btn
          >
          <q-btn
            unelevated
            color="primary"
            :loading="loading"
            @click="onSave"
            >{{ $t('textActions.Save') }}</q-btn
          >
        </div>
      </div>
    </template>
  </page-wrapper>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { onMounted, reactive, ref } from 'vue'
import PageWrapper from 'src/core/components/molecules/page-wrapper.vue'
import {
  httpsUpdateUserInformation,
  httpsGetUserProfile,
} from 'src/core/services/user-services'
import { RESPONSE_CODE } from 'src/core/services/utils/https-code'
import { useMenusVisible } from 'src/pages/account-setting/hooks/use-menus-visible'

// composables
const $q = useQuasar()
const { t } = useI18n()
const { hasAllowEditBasicInformation } = useMenusVisible()
// data
const isEditing = ref(false)
const loading = ref(false)
const form = reactive({
  trueName: {
    firstName: '',
    lastName: '',
  },
  address: {
    streetLine1: '',
    streetLine2: '',
    cityTown: '',
    state: '',
    nation: '',
    zipCode: '',
    company: '',
    department: '',
    officePhone: '',
  },
})
const previosForm = ref()

// methods
function onToggleEdit(state: boolean) {
  isEditing.value = state
}

async function onSave() {
  await handleUpdateAccountInformation()
}

async function handleUpdateAccountInformation() {
  loading.value = true
  const { trueName, address } = form
  const params = {
    trueName: JSON.stringify(trueName),
    address: JSON.stringify(address),
  }
  const data = await httpsUpdateUserInformation(params)

  if (data?.code === RESPONSE_CODE.SUCCESS) {
    isEditing.value = false
    $q.notify({
      message: t('pages.account.accountInformation.Update account success'),
      type: 'positive',
    })
  }
  loading.value = false
}

async function fetchAccountInformation() {
  const data = await httpsGetUserProfile()
  if (data?.code === RESPONSE_CODE.SUCCESS) {
    if (data?.data?.userInfo?.address) {
      form.address = data?.data?.userInfo?.address
    }
    if (data?.data?.userInfo?.trueName) {
      form.trueName = data?.data?.userInfo?.trueName
    }
    previosForm.value = data?.data?.userInfo
  }
}

onMounted(async () => {
  await fetchAccountInformation()
})
</script>
<style lang="scss">
.account-information {
  gap: 24px;

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 24px;
    margin-top: map-get($map: $space-xl, $key: 'y');
    margin-bottom: (map-get($map: $space-xl, $key: 'y') * 2);
  }

  &__block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  &__block .section-header {
    margin-bottom: 24px;
  }

  &__block .block-form row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
