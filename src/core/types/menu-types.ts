import { RouteLocation } from 'vue-router'

export type Menu = {
  icon?: string
  label: string
  separator: boolean
  to?: Partial<RouteLocation>
  children?: Menu[]
  visible?: boolean
  disabled?: boolean
  readonly?: boolean
}
