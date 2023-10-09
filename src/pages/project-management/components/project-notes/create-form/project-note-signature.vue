<template>
  <q-field
    class="project-note-signature"
    id="project-note-signature"
    stack-label
    outlined
    dense
    v-bind="$attrs"
    use-input
    use-chips
    multiple
    hide-dropdown-icon
    hide-bottom-space
    input-debounce="0"
  >
    <div class="project-note-signature__content relative-position">
      <div class="canvas">
        <canvas id="canvas"></canvas>
      </div>
      <q-btn
        size="sm"
        flat
        @click="clearSign"
        class="absolute-bottom-right q-mb-sm"
        >Clear</q-btn
      >
    </div>
  </q-field>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar'
import SignaturePad from 'signature_pad'
import { onMounted, ref } from 'vue'

//composable
const $q = useQuasar()
// props
const props = defineProps<{
  modelValue: { value: string }[]
}>()
const emits = defineEmits(['update:modelValue'])

// data
const signaturePad = ref<SignaturePad>()
const canvas = ref<HTMLCanvasElement>()

//methods
function getSignature() {
  if (signaturePad.value?.isEmpty()) {
    return null
  }
  const dataURL = signaturePad.value?.toDataURL('image/png')
  if (!dataURL) {
    $q.notify({
      message: 'Content not empty',
      type: 'negative',
    })
    return
  }
  return [{ value: dataURL }]
}

function dataURLToBlob(dataURL: string) {
  var parts = dataURL.split(';base64,')
  var raw = window.atob(parts[1])
  var rawLength = raw.length
  var uInt8Array = new Uint8Array(rawLength)
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return uInt8Array
}

function generateSignaturePadBox() {
  canvas.value = document.querySelector('#canvas') as HTMLCanvasElement
  if (canvas.value) {
    signaturePad.value = new SignaturePad(canvas.value, {
      minWidth: 1,
      maxWidth: 1,
      backgroundColor: 'rgb(255, 255, 255)',
    })
    resizeCanvas()
    clearSign()
    signaturePad.value.addEventListener('endStroke', () => {
      emits('update:modelValue', getSignature())
    })
  }
}

function resizeCanvas() {
  let ratio = Math.max(window.devicePixelRatio || 1, 1)
  const wrapper = document.querySelector('.canvas') as HTMLElement
  if (canvas.value && wrapper) {
    canvas.value.width = wrapper?.offsetWidth
    canvas.value.height = wrapper?.offsetHeight
    signaturePad.value?.clear()
  }
}

function clearSign() {
  signaturePad.value?.clear()
  emits('update:modelValue', getSignature())
}

onMounted(() => {
  generateSignaturePadBox()
})
</script>
<style lang="scss">
.project-note-signature {
  &__content {
    width: 100%;
    margin-top: 4px;
    padding: 4px;
  }

  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
