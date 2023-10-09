<template>
  <q-card class="verify-account shadow-0 q-py-xl">
    <q-card-section class="column items-center justify-center">
      <icon-email
        height="80px"
        width="80px"
      ></icon-email>
      <h1 class="text-h5 text-weight-bold q-my-none q-py-0">
        {{ $t('pages.auth.forgotPassword.form.Email sended') }}
      </h1>
      <p class="text-disable">
        {{
          $t(
            'pages.auth.forgotPassword.form.An E-mail has been sent to reset your password'
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
import IconEmail from 'components/atoms/icon/icon-email.vue'

const router = useRouter()

function onBackToLogin() {
  router.push({ name: AUTH_ROUTE_NAMES.LOGIN })
}
</script>
