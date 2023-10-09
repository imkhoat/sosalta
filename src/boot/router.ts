import { boot } from 'quasar/wrappers'
import { Router } from 'vue-router'

let quasarRouter: Router

export default boot(({ router }) => {
  quasarRouter = router
})

export { quasarRouter as router }
