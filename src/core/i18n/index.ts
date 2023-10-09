import { createI18n } from 'vue-i18n'
import enUS from './en-US/index.json'
import zhCN from './zh-CN/index.json'

export const messages = {
  'en-US': enUS,
  'zh-CN': zhCN,
}

export const i18n = createI18n({
  locale: 'en-US',
  legacy: false,
  messages,
})
