import { Router } from 'vue-router'

export type Void = () => void
export interface Breadcrumb {
  name?: string
  to?: string | Router | void | Void
  icon?: string
}
