export interface AlertProp {
  type:
    | 'primary'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'default'
  text?: string
}
