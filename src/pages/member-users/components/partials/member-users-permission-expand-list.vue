<template>
  <q-list
    bordered
    class="rounded-borders overflow-hidden"
  >
    <q-expansion-item
      :label="module.title"
      :caption="module.subTitle"
      :icon="module.icon"
      hide-expand-icon
      header-class="q-px-xs border-bottom bg-grey-1"
      v-for="(module, index) in renderConfig"
      :key="index + '__member-users-permission-card-group'"
    >
      <template #header>
        <div class="row justify-start items-center no-wrap full-width">
          <q-avatar
            size="48px"
            color="grey-1"
            class="q-mr-xs"
          >
            <q-avatar
              size="30px"
              color="grey-3"
            >
              <q-icon
                color="primary"
                :name="module.icon"
              />
            </q-avatar>
          </q-avatar>
          <div class="col-grow col-9">
            <q-item-label class="text-weight-bold">
              {{ module.title }}
            </q-item-label>
            <q-item-label
              caption
              class="text-overflow"
              >{{ module.subTitle }}</q-item-label
            >
          </div>
          <div class="col-1 row justify-end items-center align-end">
            <q-btn
              size="sm"
              flat
              round
              rounded
            >
              <q-icon name="unfold_more"></q-icon>
            </q-btn>
          </div>
        </div>
      </template>
      <q-card
        class="column"
        v-for="(section, sectionIndex) in module?.sections"
        :key="sectionIndex + '__member-users-permission-card__section'"
      >
        <q-separator
          inset
          v-if="sectionIndex !== 0"
        ></q-separator>
        <q-card-section
          class="column justify-start items-stretch q-gutter-y-xs"
        >
          <span class="text-disable text-caption q-mb-sm">
            {{ section.title }}
          </span>
          <div
            v-for="(menu, menuIndex) in section?.menus.values()"
            :key="
              sectionIndex + menuIndex + '__member-users-permission-card__menu'
            "
          >
            <q-input
              v-if="menu?.type === PERMISSION_INPUT_TYPE.INPUT"
              :model-value="menu?.value"
              :id="menu?.name"
              :label="menu?.title"
              :disable="
                section?.relation?.get(menu?.code)
                  ? !section?.relation?.get(menu?.code)?.checked
                  : false
              "
              :readonly="disable"
              stack-label
              outlined
              lazy-rules
              dense
              type="number"
              :step="allocationLimits.get(menu.code)?.step"
              :rules="generateRule(menu.code)"
              :hint="allocationLimits.get(menu.code)?.name"
              :max="allocationLimits.get(menu.code)?.value ?? undefined"
              hide-bottom-space
              class="q-ml-sm q-mb-lg"
              @update:model-value="onInputValue(menu, $event)"
            >
              <template v-slot:append>
                <span class="text-caption text-disable">{{ menu?.unit }}</span>
              </template>
            </q-input>
            <q-checkbox
              v-else
              :model-value="menu?.checked"
              :label="menu?.title"
              :disable="disable"
              :hint="menu?.code ? allocationLimits.get(menu.code)?.name : ''"
              @update:model-value="onChangePermission(menu, section?.relation)"
            ></q-checkbox>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { UserMenu } from 'src/core/types/user-menu'
import { PermissionCodeType } from 'src/core/types/permission-code-types'
import { PERMISSION_INPUT_TYPE } from 'src/core/types/permission-types'
import { MENU_ICON } from 'src/core/types/menu-icon-types'
import { AllocationLimits } from 'src/core/types/allocation-limit-types'
import { BitUnit } from 'src/core/types/unit-type'
import useCapacityDrive from 'src/core/composables/use-capacity-drive'

interface Limit {
  name?: string
  value?: number | string | undefined
  unit?: string | undefined
  step?: 'any' | number | string
}

// composable
const { convertCapacity } = useCapacityDrive()

// props & emits
const props = withDefaults(
  defineProps<{
    modelValue?: Map<PermissionCodeType, UserMenu> | null
    limits?: AllocationLimits | null
    disable?: boolean
  }>(),
  {
    disable: true,
  }
)
const emits = defineEmits(['update:modelValue'])

// computed
const allocationLimits = computed(() => {
  const limits = new Map<PermissionCodeType, Limit>()

  limits.set('FS_STORAGE_LIMIT', {
    name: `Max. Remaining Allocable Storage : ${props.limits?.maxStorageCapacity} ${props.limits?.maxStorageCapacityUnit}`,
    value: props.limits?.maxStorageCapacity,
    unit: props.limits?.maxStorageCapacityUnit,
    step: 'any',
  })

  limits.set('CP_MACHINE_COUNT_LIMIT', {
    name: `Max allowed by subscription level : ${props.limits?.maxCloudpcsNumber}`,
    value: props.limits?.maxCloudpcsNumber,
    step: '1',
  })

  limits.set('CP_HOUR_PRICE_LIMIT', {
    name: `Max allowed by subscription level : ${props.limits?.maxCloudpcHourlyCharge} ${props.limits?.maxCloudpcHourlyChargeUnit}`,
    value: props.limits?.maxCloudpcHourlyCharge,
    unit: props.limits?.maxCloudpcHourlyChargeUnit,
    step: 'any',
  })

  limits.set('CP_EBS_DRIVER_LIMIT', {
    name: `Max allowed by subscription level : ${props.limits?.hardDiskSize} ${props.limits?.hardDiskSizeUnit}`,
    value: convertCapacity(
      Number(props.limits?.hardDiskSize),
      props.limits?.hardDiskSizeUnit as BitUnit,
      'GB'
    ),
    unit: 'GB',
    step: '1',
  })

  limits.set('CP_ROOT_DATA_DRIVE_LIMIT', {
    name: `Max allowed by subscription level : ${props.limits?.hardDiskSize} ${props.limits?.hardDiskSizeUnit}`,
    value: convertCapacity(
      Number(props.limits?.hardDiskSize),
      props.limits?.hardDiskSizeUnit as BitUnit,
      'GB'
    ),
    unit: 'GB',
    step: '1',
  })

  limits.set('CP_ALLOW_MANUAL_SHUTDOWN', {
    name: `Max allowed by subscription level : ${props.limits?.allowManualShutdownOption}`,
    value: props.limits?.allowManualShutdownOption,
    step: 'any',
  })

  limits.set('CA_CONCURRENT_APP_TASKS_LIMIT', {
    name: `Max allowed by subscription level : ${props.limits?.maxAnalysisAppsNumber}`,
    value: props.limits?.maxAnalysisAppsNumber,
    step: '1',
  })

  return limits
})

const renderConfig = computed(() => {
  return [
    {
      title: 'File system',
      subTitle: 'Manager and config file system',
      icon: MENU_ICON.FILE_SYSTEM,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['FS']),
        },
        {
          title: 'Action permissions',
          menus: _generateSection([
            'FS_IMPORT',
            'FS_NEW_FILE',
            'FS_NEW_FOLDER',
            'FS_UPLOAD',
            'FS_DOWNLOAD',
            'FS_SHARE',
            'FS_MOVE',
            'FS_COPY',
            'FS_DELETE',
            'FS_DELETE',
            'FS_ONLINE_ENCRYPT',
            'FS_ONLINE_DECOMPRESS',
          ]),
        },
        {
          title: 'Limit permissions',
          menus: _generateSection([
            'FS_MEMBER_STORAGE_LIMIT_SWITCH',
            'FS_STORAGE_LIMIT',
          ]),
          relation: _generateRelationship([
            {
              key: 'FS_STORAGE_LIMIT',
              value: 'FS_MEMBER_STORAGE_LIMIT_SWITCH',
            },
          ]),
        },
      ],
    },
    {
      title: 'Key manager',
      subTitle: 'Manager and config master password and encrypted key',
      icon: MENU_ICON.KEY_MANAGER,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['KM']),
        },
      ],
    },
    {
      title: 'Cloud PC',
      subTitle: 'Manager clould PC access and setup limit resource',
      icon: MENU_ICON.CLOUD_PC,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['CP']),
        },
        {
          title: 'Image access',
          menus: _generateSection([
            'CP_PUBLIC_IMAGE_ACCESS',
            'CP_PRIVATE_IMAGE_ACCESS',
          ]),
        },
        {
          title: 'Data drive access',
          menus: _generateSection(['CP_DATA_DRIVE_ACCESS']),
        },
        {
          title: 'Data drive action',
          menus: _generateSection([
            'CP_CREATE_A_NEW_DATA_DRIVE',
            'CP_DELETE_EXISTING_DATA_DRIVE',
            'CP_RENAME_DATA_DRIVE',
          ]),
        },
        {
          title: 'Data drive file action',
          menus: _generateSection([
            'CP_UPLOAD',
            'CP_NEW_FOLDER',
            'CP_NEW_FILE',
            'CP_COPY',
            'CP_DELETE',
            'CP_MOVE',
            'CP_RENAME',
            'CP_SHARE',
            'CP_DOWNLOAD',
            'CP_UNZIP_FILE',
          ]),
        },
        {
          title: 'Limit permission',
          menus: _generateSection([
            'CP_MACHINE_COUNT_LIMIT_SWITCH',
            'CP_MACHINE_COUNT_LIMIT',
            'CP_CPU_CORE_LIMIT_SWITCH',
            'CP_CPU_CORE_LIMIT',
            'CP_MEMORY_LIMIT_SWITCH',
            'CP_MEMORY_LIMIT',
            'CP_EBS_DRIVER_LIMIT_SWITCH',
            'CP_EBS_DRIVER_LIMIT',
            'CP_ROOT_DATA_DRIVE_LIMIT_SWITCH',
            'CP_ROOT_DATA_DRIVE_LIMIT',
            'CP_HOUR_PRICE_LIMIT_SWITCH',
            'CP_HOUR_PRICE_LIMIT',
          ]),
          relation: _generateRelationship([
            { key: 'CP_CPU_CORE_LIMIT', value: 'CP_CPU_CORE_LIMIT_SWITCH' },
            { key: 'CP_HOUR_PRICE_LIMIT', value: 'CP_HOUR_PRICE_LIMIT_SWITCH' },
            { key: 'CP_EBS_DRIVER_LIMIT', value: 'CP_EBS_DRIVER_LIMIT_SWITCH' },
            {
              key: 'CP_MACHINE_COUNT_LIMIT',
              value: 'CP_MACHINE_COUNT_LIMIT_SWITCH',
            },
            { key: 'CP_MEMORY_LIMIT', value: 'CP_MEMORY_LIMIT_SWITCH' },
            {
              key: 'CP_ROOT_DATA_DRIVE_LIMIT',
              value: 'CP_ROOT_DATA_DRIVE_LIMIT_SWITCH',
            },
          ]),
        },
        {
          title: 'Allow manual shutdown permission',
          menus: _generateSection(['CP_ALLOW_MANUAL_SHUTDOWN']),
        },
      ],
    },
    {
      title: 'Member Setting',
      subTitle: 'Manager member permission',
      icon: MENU_ICON.MEMBER_USER,
      all: {
        key: 'MU',
      },
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['MU']),
        },
        {
          title: 'Sub page access',
          menus: _generateSection(['MU_MEMBER_SETTINGS', 'MU_MEMBER_FILES']),
        },
      ],
    },
    {
      title: 'Project',
      subTitle: 'Manager project permission',
      icon: MENU_ICON.PROJECT,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['PJ']),
        },
      ],
    },
    {
      title: 'Team',
      subTitle: 'Manager team permission',
      icon: MENU_ICON.TEAM,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['TM']),
        },
        {
          title: 'Sub pages access',
          menus: _generateSection(['TM_TEAM_SETTINGS', 'TM_TEAM_FILES']),
        },
      ],
    },
    {
      title: 'Cloud App',
      subTitle: 'Config permission to access cloud app module',
      icon: MENU_ICON.CLOUD_APP,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['CA']),
        },
        {
          title: 'Action permission',
          menus: _generateSection([
            'CA_RUN_APPS',
            'CA_GET_RESULTS',
            'CA_RUN_A_CLOUD_APP_TASK',
          ]),
        },
        {
          title: 'Limit permission',
          menus: _generateSection([
            'CA_CONCURRENT_APP_TASKS_LIMIT_SWITCH',
            'CA_CONCURRENT_APP_TASKS_LIMIT',
          ]),
          relation: _generateRelationship([
            {
              key: 'CA_CONCURRENT_APP_TASKS_LIMIT',
              value: 'CA_CONCURRENT_APP_TASKS_LIMIT_SWITCH',
            },
          ]),
        },
      ],
    },
    {
      title: 'Account Setting',
      subTitle: 'Config permission to access account setting module',
      icon: MENU_ICON.ACCOUNT_SETTING,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['AT']),
        },
        {
          title: 'Action permission',
          menus: _generateSection([
            'AT_ACCOUNT_SETTINGS',
            'AC_SAVE_BASIC_INFORMATION',
          ]),
        },
      ],
    },
    {
      title: 'Recycle Bin',
      subTitle: 'Config permission to access trash page',
      icon: MENU_ICON.RECYCLE_BIN,
      sections: [
        {
          title: 'Page access',
          menus: _generateSection(['RB']),
        },
      ],
    },
  ]
})

// methods
function generateRule(code: PermissionCodeType) {
  const maximum = allocationLimits.value.get(code)?.value
  if (!maximum) {
    return []
  }
  return [
    (val: number | string) =>
      (val && maximum && parseInt(val.toString()) <= (maximum ?? 0)) ||
      'Out of limit',
  ]
}
function _generateSection(items: PermissionCodeType[]) {
  const result = new Map<PermissionCodeType, UserMenu | undefined>()

  items.forEach((item) => {
    result.set(item, props.modelValue?.get(item))
  })

  return result
}

function _generateRelationship(
  items: { key: PermissionCodeType; value: PermissionCodeType }[]
) {
  const result = new Map<PermissionCodeType, UserMenu | undefined>()

  items.forEach((item) => {
    result.set(item.key, props.modelValue?.get(item.value))
    result.set(item.value, props.modelValue?.get(item.key))
  })

  return result
}

function onChangePermission(
  menu: UserMenu | undefined,
  relation: Map<PermissionCodeType, UserMenu | undefined> | undefined
) {
  if (menu) {
    menu.checked = !menu?.checked
    const relationMenu = relation?.get(menu.code)

    if (relationMenu) {
      relationMenu.checked = menu.checked
    }
    emits('update:modelValue', props.modelValue)
  }
}

function onInputValue(
  menu: UserMenu | undefined,
  value: string | number | null
) {
  if (menu && value !== null) {
    menu.value = value
    emits('update:modelValue', props.modelValue)
  }
}
</script>
