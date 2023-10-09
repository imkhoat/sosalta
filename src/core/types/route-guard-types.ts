import { RouteLocationRaw } from 'vue-router'

export interface RouteGuard {
  result: boolean
  target?: Partial<RouteLocationRaw | null>
}
