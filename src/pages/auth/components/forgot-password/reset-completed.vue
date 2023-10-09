<template>
  <q-card class="verify-account shadow-0 q-py-xl">
    <q-card-section class="column items-center justify-center">
      <icon-success
        height="80px"
        width="80px"
      ></icon-success>
      <h1 class="text-h5 text-weight-bold q-my-none q-py-0">
        {{ $t('pages.auth.forgotPassword.form.Change password success') }}
      </h1>
      <p>
        {{
          $t(
            'pages.auth.forgotPassword.form.You can now go back to login page and try to login'
          )
        }}
      </p>
      <q-btn
        color="primary"
        size="large"
        no-caps
        outline
        unelevated
        @click="onBackToLogin"
      >
        {{ $t('pages.auth.forgotPassword.form.Back to login') }}
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AUTH_ROUTE_NAMES } from 'src/core/router/routes'
import IconSuccess from 'components/atoms/icon/icon-success.vue'

const router = useRouter()

function onBackToLogin() {
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}
</script>
