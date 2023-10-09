export interface ActionProp {
  type?: 'primary' | 'secondary'
  color?:
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'info'
    | 'success'
    | 'positive'
    | 'negative'
    | 'error'
    | 'disable'
  flat?: boolean
  push?: boolean
  name?: string
  loading?: boolean
  class?: string | string[]
  disable?: boolean
  outline?: boolean
  unelevated?: boolean
  mode?: 'button' | 'submit' | 'reset'
  target?: string
  href?: string
  action?: () => void | undefined | any
}
