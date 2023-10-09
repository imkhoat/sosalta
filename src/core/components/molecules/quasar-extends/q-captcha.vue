<template>
  <q-img
    :src="captchaImage"
    :fit="'fill'"
    spinner-color="white"
    class="rounded-borders q-captcha"
    @click="onChangeCaptcha"
  ></q-img>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useUUID } from 'src/core/composables'
import { API } from 'src/core/services/utils/apis'
import { useApplicationStore } from 'src/core/stores/application'
import { storeToRefs } from 'pinia'

// composable
const { getBaseURL } = storeToRefs(useApplicationStore())

// props|emits
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

// data
const captchaImage = ref('')

// methods
function onChangeCaptcha() {
  getCaptchaCode()
}

async function getCaptchaCode() {
  const uuid = useUUID()
  captchaImage.value = `${getBaseURL.value ?? process.env.BASE_API_URL}${
    API.AUTH.CAPTCHA
  }${uuid}`
  emit('update:modelValue', uuid)
}

// hooks
onMounted(() => {
  getCaptchaCode()
})

defineExpose({
  getCaptchaCode,
})
</script>
<style lang="scss">
.q-captcha {
  cursor: pointer;
  max-height: 56px;
  height: 36px;
}
</style>
