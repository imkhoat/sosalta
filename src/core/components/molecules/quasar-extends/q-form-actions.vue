<template>
  <div
    v-if="inline"
    class="row form-actions full-width"
    :class="{ inlineClass, 'justify-center': center, 'justify-end': !center }"
  >
    <q-btn
      v-for="(action, index) in props.actions"
      :loading="action.loading"
      :push="action.push"
      :flat="action.flat"
      :type="action.mode"
      :color="action.color"
      :class="action.class"
      :disable="action.disable"
      :unelevated="action.unelevated"
      :target="action.target"
      :href="action.href"
      :key="index + '_form-actions'"
      @click="action.action"
      >{{ action.name }}</q-btn
    >
  </div>
  <q-dialog
    v-if="dialog"
    v-model="formActionsDialog"
    seamless
    position="bottom"
    class="form-actions__dialog"
  >
    <q-card class="window-width">
      <q-linear-progress
        :value="1"
        color="teal"
        size="sm"
      />
      <q-card-section>
        <div
          class="row full-width items-center"
          :class="{ 'justify-center': center, 'justify-end': !center }"
        >
          <div
            class="col-12 col-md-4 row justify-end form-actions__dialog-actions"
          >
            <q-btn
              v-for="(action, index) in props.actions"
              :loading="action.loading"
              :push="action.push"
              :flat="action.flat"
              :type="action.mode"
              :color="action.color"
              :disable="action.disable"
              :unelevated="action.unelevated"
              :target="action.target"
              :key="index + '_form-actions'"
              :class="action.class"
              :href="action.href"
              @click="action.action"
              >{{ action.name }}</q-btn
            >
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { ActionProp } from 'src/core/types/action-prop-types'
import { AlertProp } from 'src/core/types/alert-prop-types'

interface Props {
  modelValue?: boolean
  dialog?: boolean
  inline?: boolean
  alert?: AlertProp
  actions?: ActionProp[]
  inlineClass?: string
  center?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  inline: true,
  dialog: false,
  center: false,
})
const emits = defineEmits(['update:modelValue'])

// computed
const formActionsDialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
</script>
<style lang="scss">
.form-actions {
  gap: map-get($map: $space-xs, $key: y);

  &__dialog-actions {
    gap: map-get($map: $space-xs, $key: y);
  }
}
</style>
