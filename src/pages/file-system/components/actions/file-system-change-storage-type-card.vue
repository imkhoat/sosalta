<template>
  <q-card class="file-system-change-storage-type-card">
    <q-card-section>
      <q-section-header title="Change status"></q-section-header>
    </q-card-section>
    <q-card-section>
      <div
        class="file-system-change-storage-type-card__content row justify-start items-center q-gutter-x-sm"
      >
        <label
          v-for="(item, index) in types"
          :key="index + '__file-system-change-storage-type-card'"
          class="column justify-center items-center q-gutte-y-xs"
          :class="{
            'text-disable': item.code === previewSelectedType,
            'cursor-pointer': item.code !== previewSelectedType,
            'cursor-not-allowed': item.code === previewSelectedType,
          }"
          @click="onSelectType(item)"
        >
          <q-avatar
            size="60px"
            color="grey-1"
            text-color="grey-3"
            class="file-system-change-storage-type-card__item"
            :class="{
              'file-system-change-storage-type-card__selected':
                selectedType === item.code,
            }"
          >
            <q-avatar
              size="40px"
              color="grey-3"
              text-color="accent"
            >
              <q-icon
                size="sm"
                :name="item.icon"
                :color="item.color"
              ></q-icon>
            </q-avatar>
          </q-avatar>
          <span class="text-caption">{{ item.name }}</span>
        </label>
      </div>
    </q-card-section>
    <q-card-actions>
      <q-form-actions :actions="formActions"></q-form-actions>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useFileSystemStore } from 'src/core/stores/file-system'
import { ActionProp } from 'src/core/types/action-prop-types'
import { STORAGE_CLASS, StorageClass } from 'src/core/types/file-types'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFiles } from 'src/pages/file-system/hooks/use-files'
import { errorHandler } from 'src/core/utils/error-handler'
interface StorageClassType {
  name: string
  icon: string
  code: StorageClass
  color: string
}

const types: StorageClassType[] = [
  {
    name: 'Frequent',
    icon: 'sym_o_mode_heat',
    code: STORAGE_CLASS.STANDARD,
    color: 'warning',
  },
  {
    name: 'Infrequent',
    icon: 'sym_o_cloudy_snowing',
    code: STORAGE_CLASS.STANDARD_IA,
    color: 'green',
  },
  {
    name: 'Archive',
    icon: 'sym_o_ac_unit',
    code: STORAGE_CLASS.GLACIER,
    color: 'blue',
  },
]

const { t } = useI18n()
const { handleChangeStorageType, loading } = useFiles()

// props
const { getActiveObject } = storeToRefs(useFileSystemStore())
const emits = defineEmits(['close', 'rename', 'refresh'])

// data
const selectedType = ref(getActiveObject.value?.storageClass)
const previewSelectedType = ref(getActiveObject.value?.storageClass)
// computed
const isEditing = computed(() => {
  return selectedType.value !== previewSelectedType.value
})
const formActions = computed((): ActionProp[] => {
  return [
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Close'),
      action: onClose,
    },
    {
      color: 'primary',
      flat: true,
      name: t('textActions.Change'),
      disable: !isEditing.value,
      action: onChangeStorageClass,
      loading: loading.value,
    },
  ]
})

// method
function onClose() {
  emits('close')
}
function onSelectType(type: StorageClassType) {
  selectedType.value = type.code
}
async function onChangeStorageClass() {
  try {
    if (!selectedType.value) {
      errorHandler.notify('Please select target folder')
      return
    }
    await handleChangeStorageType(selectedType.value as StorageClass)

    emits('refresh')
    emits('close')
  } catch (error) {
    errorHandler.log(error)
    errorHandler.notify(error)
  }
}
</script>
<style lang="scss">
.file-system-change-storage-type-card {
  &__item {
    border: 2px solid transparent;
    box-sizing: content-box;
  }

  &__selected {
    border-color: $primary;
  }
}
</style>
