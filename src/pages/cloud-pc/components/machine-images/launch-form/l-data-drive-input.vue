<template>
  <q-skeleton
    v-show="loading"
    type="QInput"
    height="40px"
    width="100%"
    class="text-caption"
  />
  <q-select
    v-show="!loading"
    id="l-data-drive-input"
    label="Data drive"
    stack-label
    outlined
    dense
    lazy-rules
    hide-bottom-space
    v-bind="$attrs"
    v-model="selectedType"
    :options="instanceOptions"
    option-disable="inactive"
  >
    <template v-slot:selected>
      <q-item
        v-if="selectedType"
        v-bind="selectedType"
        class="q-px-none"
      >
        <q-item-section>
          <q-item-label>{{ selectedType.label }}</q-item-label>
          <q-item-label caption>{{ selectedType.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <div class="row no-wrap justify-start items-center">
            <q-avatar
              size="36px"
              color="grey-1"
            >
              <q-avatar
                size="24px"
                color="grey-3"
              >
                <q-icon
                  size="16px"
                  v-if="scope.opt.inactive"
                  name="sym_o_lock"
                />
                <q-icon
                  size="16px"
                  v-else
                  name="sym_o_folder"
                />
              </q-avatar>
            </q-avatar>
            <div class="q-ml-xs">
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script lang="ts" setup>
import { DataDrive } from 'src/core/types/data-drive-types'
import { computed } from 'vue'

// props
const props = defineProps<{
  options: DataDrive[] | undefined
  loading?: boolean
  modelValue: {
    label: string
    value: string
    description: string
    inactive: boolean
  } | null
}>()
const emits = defineEmits(['update:modelValue', 'update:captchaUuid', 'submit'])

//
const selectedType = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const instanceOptions = computed(() => {
  if (!props.options) {
    return []
  }
  return props.options.map((item) => {
    return {
      label: `${item.driveName}`,
      value: item.dataDriveId,
      description: `Create by ${item.userName}`,
      inactive: item.locked,
    }
  })
})
</script>
