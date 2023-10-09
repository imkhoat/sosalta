<template>
  <div class="row no-wrap items-stretch">
    <q-input
      ref="captchaInput"
      id="captcha"
      :label="$t('components.Captcha')"
      stack-label
      outlined
      v-bind="$attrs"
      v-model="captcha"
      class="col-6 col-sm-7"
      @keyup.enter="onSubmit"
    ></q-input>
    <q-captcha
      class="captcha-img col-6 col-sm-5 q-ml-xs"
      :class="$attrs?.dense || $attrs?.dense === '' ? 'dense' : ''"
      ref="captchaImage"
      v-bind="$attrs"
      v-model="captchaUuidValue"
    ></q-captcha>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { QCaptchaElement } from 'src/core/types/q-captcha-element-types'

// props
const props = defineProps(['modelValue', 'captchaUuid'])
const emits = defineEmits(['update:modelValue', 'update:captchaUuid', 'submit'])

// data
const captchaImage = ref<InstanceType<QCaptchaElement> | null>(null)
const captchaInput = ref<
  (HTMLElement & { resetValidation: () => void }) | null
>(null)

// computed
const captcha = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const captchaUuidValue = computed({
  get() {
    return props.captchaUuid
  },
  set(value) {
    emits('update:captchaUuid', value)
  },
})

// methods
function refresh() {
  captcha.value = ''
  captchaInput?.value?.resetValidation()
  captchaImage?.value?.getCaptchaCode()
}

function onSubmit() {
  emits('submit')
}
// expose
defineExpose({
  refresh,
})
</script>
<style lang="scss">
.captcha-img {
  .q-img__image {
    height: 56px;
  }
}
.captcha-img.dense {
  .q-img__image {
    height: 40px;
  }
}
</style>
