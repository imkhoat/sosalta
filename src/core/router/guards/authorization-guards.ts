import { Dialog } from 'quasar'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'src/core/stores/auth'
import { RouteLocationNormalized } from 'vue-router'
import {
  ACCOUNT_SETTING_ROUTE_NAMES,
  CLOUD_PC_ROUTE_NAMES,
  FILE_SYSTEM_ROUTE_NAMES,
  PUBLIC_ROUTE_NAMES,
} from 'src/core/router/routes'
import { RouteGuard } from 'src/core/types/route-guard-types'
import { PermissionCodeType } from 'src/core/types/permission-code-types'
import { DASHBOARD_ROUTE_NAMES } from 'src/pages/dashboard/router'

export default function authorizationGuard(
  to: RouteLocationNormalized
): RouteGuard {
  const { getFlatUserMenus, getUserInformation } = storeToRefs(useAuthStore())
  const hasEmailCertificated = getUserInformation.value?.emailCertification

  const isAuthorization = getFlatUserMenus.value.get(
    to?.meta?.authorizationCode as PermissionCodeType
  )?.checked

  if (to?.meta?.authorizationCode && !isAuthorization) {
    Dialog.create({
      title: 'Access denied',
      message:
        'You have no permission to access this page.<br/> You will be redirect to home page.',
      html: true,
      ok: true,
      persistent: true,
    })
    return redirectWhileUnAuthorization()
  } else if (
    !hasEmailCertificated &&
    (CLOUD_PC_ROUTE_NAMES.MACHINE_IMAGE,
    CLOUD_PC_ROUTE_NAMES.DATA_DRIVE,
    CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCES,
    CLOUD_PC_ROUTE_NAMES.MACHINE_INSTANCE_DETAIL).includes(to.name)
  ) {
    Dialog.create({
      title: 'Access denied',
      message: 'You have not verified your email account.',
      html: true,
      ok: true,
      persistent: true,
    })
    return redirectWhileUnVerifyEmail()
  } else {
    return {
      result: true,
    }
  }
}

function redirectWhileUnAuthorization() {
  const { isAuthenticated, getUserAuthorization } = storeToRefs(useAuthStore())

  if (
    isAuthenticated.value &&
    getUserAuthorization.value?.fileSystemPage?.menus?.entries?.visible
  ) {
    return {
      result: false,
      target: { name: FILE_SYSTEM_ROUTE_NAMES.ENTRIES },
    }
  } else if (
    isAuthenticated.value &&
    !getUserAuthorization.value?.fileSystemPage?.menus?.entries?.visible
  ) {
    return {
      result: false,
      target: { name: DASHBOARD_ROUTE_NAMES.ENTRIES },
    }
  }
  return {
    result: false,
    target: { name: PUBLIC_ROUTE_NAMES.HOME },
  }
}

function redirectWhileUnVerifyEmail() {
  const { isAuthenticated, getUserAuthorization } = storeToRefs(useAuthStore())

  if (
    isAuthenticated.value &&
    getUserAuthorization.value?.accountSettingPage?.menus?.entries?.visible
  ) {
    return {
      result: false,
      target: { name: ACCOUNT_SETTING_ROUTE_NAMES.ENTRIES },
    }
  } else {
    return {
      result: false,
      target: { name: DASHBOARD_ROUTE_NAMES.ENTRIES },
    }
  }
}
