import { boot } from 'quasar/wrappers'
import VueKonva from 'vue-konva'

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(VueKonva)
})
