<template>
  <q-field
    ref="phoneInputRef"
    stack-label
    v-bind="$attrs"
    outlined
    class="q-phone-input"
    :rules="rules"
    lazy-rules
    hide-bottom-space
  >
    <template v-slot:control>
      <div
        class="q-phone-input__box fit row no-wrap justify-start items-stretch content-end"
      >
        <q-select
          borderless
          v-model="codeValue"
          :options="codeOptions"
          option-label="country"
          option-value="region"
          class="q-phone-input__code"
          :display-value="`${codeValue?.showName}`"
        />
        <q-separator
          vertical
          inset
        />
        <input
          v-model="phoneValue"
          type="tel"
          @keyup.enter="$emit('submit')"
          class="q-phone-input__phone"
          @blur="onValidate"
          @keyup="onValidate"
        />
      </div>
    </template>
  </q-field>
</template>
<script lang="ts" setup>
import { reactive, computed, ref } from 'vue'
import { countryCodes, CountryCode } from 'src/core/utils/country-codes'

// data
const codeOptions = reactive(countryCodes)
const phoneInputRef = ref<(HTMLElement & { validate: () => boolean }) | null>(
  null
)

// props
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

// computed
const phoneValue = computed({
  get() {
    return props.modelValue.phone
  },
  set(value) {
    emit('update:modelValue', {
      code: codeValue.value,
      phone: value,
    })
  },
})
const codeValue = computed({
  get() {
    return props.modelValue.code as CountryCode
  },
  set(value) {
    emit('update:modelValue', {
      code: value,
      phone: phoneValue.value,
    })
  },
})
const rules = computed(() => {
  return [() => phoneValue.value?.length > 0 || 'Phone required']
})

// methods
function onValidate() {
  phoneInputRef?.value?.validate()
}
</script>
<style lang="scss">
.q-phone-input {
  width: 100%;

  & > .q-field__inner > .q-field__control {
    align-items: center;
    height: 56px;
  }

  .q-phone-input__code {
    min-width: 100px;
    max-width: 150px;
    width: fit-content;

    & > .q-field__inner {
      height: 36px;
      min-height: 36px;
    }

    & > .q-field__inner > .q-field__control {
      height: 36px;
      min-height: 36px;
      padding: 0;
    }

    & > .q-field__inner > .q-field__control > .q-field__append {
      margin-top: -4px;
      height: 36px;
      min-height: 36px;
    }

    .q-field__control::before,
    .q-field__control::after {
      border: none;
    }

    .q-field__control-container {
      padding-top: 0 !important;
    }

    .q-field__native {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .q-phone-input__phone {
    border: none;
    outline: none;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 0 12px;
    background-color: transparent;
  }

  .q-phone-input__box {
    height: 30px;
    min-height: 30px;
  }
}
.q-phone-input.q-field--dense {
  width: 100%;

  & > .q-field__inner > .q-field__control {
    align-items: center;
    height: 40px;
  }

  .q-phone-input__code {
    min-width: 100px;
    max-width: 150px;
    width: fit-content;

    & > .q-field__inner {
      height: 30px;
      min-height: 30px;
    }

    & > .q-field__inner > .q-field__control {
      height: 30px;
      min-height: 30px;
      padding: 0;
    }

    & > .q-field__inner > .q-field__control > .q-field__append {
      margin-top: 0;
      height: 30px;
      min-height: 30px;
    }
    & > .q-field__inner > .q-field__control .q-field__native {
      padding: 0;
      min-height: 30px;
    }

    .q-field__control::before,
    .q-field__control::after {
      border: none;
    }

    .q-field__control-container {
      padding-top: 0 !important;
    }

    .q-field__native {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .q-phone-input__phone {
    border: none;
    outline: none;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 0 12px;
    background-color: transparent;
  }

  .q-phone-input__box {
    height: 30px;
    min-height: 30px;
  }
}
</style>
