import { boot } from 'quasar/wrappers'
import QAlert from 'src/core/components/molecules/quasar-extends/q-alert.vue'
import QFormActions from 'src/core/components/molecules/quasar-extends/q-form-actions.vue'
import QPasswordInput from 'src/core/components/molecules/quasar-extends/q-password-input.vue'
import QPhoneInput from 'src/core/components/molecules/quasar-extends/q-phone-input.vue'
import QCaptchaInput from 'src/core/components/molecules/quasar-extends/q-captcha-input.vue'
import QCaptcha from 'src/core/components/molecules/quasar-extends/q-captcha.vue'
import QTxtInput from 'src/core/components/molecules/quasar-extends/q-txt-input.vue'
import QSmsInput from 'src/core/components/molecules/quasar-extends/q-sms-input.vue'
import QFolderTree from 'src/core/components/molecules/quasar-extends/q-folder-tree.vue'
import QEmailCodeInput from 'src/core/components/molecules/quasar-extends/q-email-code-input.vue'
import QCode from 'src/core/components/molecules/quasar-extends/q-code.vue'
import QHtmlInput from 'src/core/components/molecules/quasar-extends/q-html-input/q-html-input.vue'
import QSectionHeader from 'src/core/components/molecules/quasar-extends/q-section-header.vue'
import QSkeletonSuspense from 'src/core/components/molecules/quasar-extends/q-skeleton-suspense.vue'
import QUserTabs from 'src/core/components/molecules/quasar-extends/q-user-tabs.vue'
import QPageHeader from 'src/core/components/molecules/quasar-extends/q-page-header.vue'
import QRightView from 'src/core/components/molecules/quasar-extends/q-right-view.vue'
import QPaginationBox from 'src/core/components/molecules/quasar-extends/q-pagination-box.vue'
import QTagInput from 'src/core/components/molecules/quasar-extends/q-tag-input.vue'
import QEmptyData from 'src/core/components/molecules/quasar-extends/q-empty-data.vue'
import QFilter from 'src/core/components/molecules/quasar-extends/q-filter.vue'

export default boot(async ({ app }) => {
  // something to do
  app.component('q-alert', QAlert)
  app.component('q-captcha', QCaptcha)
  app.component('q-phone-input', QPhoneInput)
  app.component('q-form-actions', QFormActions)
  app.component('q-captcha-input', QCaptchaInput)
  app.component('q-password-input', QPasswordInput)
  app.component('q-txt-input', QTxtInput)
  app.component('q-sms-input', QSmsInput)
  app.component('q-folder-tree', QFolderTree)
  app.component('q-email-code-input', QEmailCodeInput)
  app.component('q-code', QCode)
  app.component('q-html-input', QHtmlInput)
  app.component('q-section-header', QSectionHeader)
  app.component('q-skeleton-suspense', QSkeletonSuspense)
  app.component('q-user-tabs', QUserTabs)
  app.component('q-page-header', QPageHeader)
  app.component('q-right-view', QRightView)
  app.component('q-pagination-box', QPaginationBox)
  app.component('q-tag-input', QTagInput)
  app.component('q-empty-data', QEmptyData)
  app.component('q-filter', QFilter)
})
