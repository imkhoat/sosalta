import { reactive } from 'vue'

const drawer = reactive<{
  open: boolean
}>({
  open: false,
})

export function useDrawer() {
  function onToggleDraw() {
    drawer.open = !drawer.open
  }

  function onCloseDrawer() {
    drawer.open = false
  }

  function onShowDrawer() {
    drawer.open = true
  }

  return { drawer, onToggleDraw, onCloseDrawer, onShowDrawer }
}
