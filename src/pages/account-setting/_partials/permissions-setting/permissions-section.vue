<template>
  <q-expansion-item
    group="permission-setting"
    expand-icon-toggle
    v-model="expanded"
    icon="r_none"
    expand-icon="none"
    expanded-icon="none"
    class="bg-grey-1 rounded-borders password-section"
  >
    <template #header>
      <div class="row items-center justify-between no-wrap full-width">
        <q-section-header
          :title="$t('pages.account.permissionSetting.Permissions')"
          :sub-title="
            $t(
              'pages.account.permissionSetting.Permissions are set in Member settings or contact Admin if you are a member'
            )
          "
        ></q-section-header>
      </div>
    </template>
    <q-card class="bg-grey-1 q-pa-md rounded-borders">
      <q-card-section class="q-px-none">
        <q-card class="bg-grey-2 no-box-shadow rounded-borders">
          <q-card-section class="row">
            <q-avatar
              color="green-1"
              text-color="positive"
              icon="r_verified"
            ></q-avatar>
            <div class="col q-pl-sm">
              <div class="text-weight-bolder">{{ userLevel }}</div>
              <div class="text-disable">
                {{ $t('pages.account.permissionSetting.Owner by') }}
                {{ ownerBy }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="q-px-none">
        <div class="block-form row">
          <q-checkbox
            color="primary"
            v-for="(permission, index) in menuList"
            :key="index + '_permission-section'"
            readonly
            v-model="permission.checked"
            :label="permission.label"
            class="col-12 col-sm-6 col-md-4"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/core/stores/auth'
import { USER_ROLE } from 'src/core/services/utils/user-role'

// composables
const { t } = useI18n()
const { getUserMenusArr, getUserInformation } = useAuthStore()

const expanded = ref(true)

// computed
const menuList = computed(() => {
  return getUserMenusArr.map((item) => {
    return {
      label: item?.name,
      checked: item?.checked,
    }
  })
})

const userLevel = computed(() => {
  const roleName = getUserInformation?.roleName
  switch (roleName) {
    case USER_ROLE.ADMINISTRATOR:
      return t('general.Administrator')
    case USER_ROLE.MEMBER_MANAGER:
      return t('general.Manager')
    default:
      return t('general.Member user')
  }
})

const ownerBy = computed(() => {
  return getUserInformation?.manager
})
</script>
<style lang="scss">
.password-section {
  .q-expansion-item__container .q-item__section {
    display: none;
  }
}
</style>
