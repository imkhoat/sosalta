<template>
  <div class="row justify-center">
    <q-avatar
      v-if="mini"
      size="34px"
      color="blue-grey-1"
      text-color="accent"
      icon="r_directions"
    />
    <q-card
      v-else
      flat
      class="full-width"
    >
      <q-card-section class="row q-px-none q-pt-none justify-start no-wrap">
        <q-avatar
          size="40px"
          color="blue-grey-1"
          text-color="accent"
          icon="r_directions"
        />
        <div class="q-ml-sm row justify-between col-grow">
          <div>
            <div class="text-subtitle2 text-weight-bold">{{ getUserName }}</div>
            <div class="text-caption">{{ userEmail }}</div>
          </div>
          <q-btn
            v-if="!actionHidden"
            size="md"
            round
            color="accent"
            flat
            @click="onLogout"
          >
            <q-icon
              name="logout"
              size="xs"
            />
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/core/stores/auth'
import { AUTH_ROUTE_NAMES } from 'src/core/router/routes'
import { useRouter } from 'vue-router'

interface Props {
  mini?: boolean
  actionHidden?: boolean
}
const { logout, getUserInformation, getUserName } = useAuthStore()
const router = useRouter()

defineProps<Props>()

// computed
const userEmail = computed(() => {
  return getUserInformation.email
})

function onLogout() {
  logout()
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}
</script>
