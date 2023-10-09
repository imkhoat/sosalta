import { storeToRefs } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'
import { AUTH_ROUTE_NAMES, PUBLIC_ROUTE_NAMES } from '../routes'
import { useAuthStore } from 'src/core/stores/auth'
import { RouteGuard } from 'src/core/types/route-guard-types'

export default function authenticationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): RouteGuard {
  const { isAuthenticated } = storeToRefs(useAuthStore())
  if (to?.meta?.requiresAuth && !isAuthenticated.value) {
    return {
      result: false,
      target: {
        name: AUTH_ROUTE_NAMES.LOGIN,
        query: { redirect: to.fullPath },
      },
    }
  } else if (to.name === AUTH_ROUTE_NAMES.LOGIN && isAuthenticated.value) {
    const fromRouterName =
      from?.name === AUTH_ROUTE_NAMES.SIGNUP
        ? PUBLIC_ROUTE_NAMES.WELCOME
        : from?.name ?? PUBLIC_ROUTE_NAMES.WELCOME

    return {
      result: false,
      target: { name: fromRouterName },
    }
  } else {
    return {
      result: true,
    }
  }
}
