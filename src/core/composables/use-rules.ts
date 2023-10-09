import { computed, ComputedRef, Ref } from 'vue'
import { REGEX_PATTERN } from '../utils/regex-string'
import { useI18n } from 'vue-i18n'

interface UsableRules {
  fieldRequiredRules: ComputedRef<((val: string) => true | string)[]>
  fileRequiredRules: ComputedRef<((val: File) => File | string)[]>
  smsRules: ComputedRef<((val: string) => true | string)[]>
  requiredRules: ComputedRef<((val: string) => true | string)[]>
  emailRules: ComputedRef<((val: string) => true | string)[]>
  captchaRules: ComputedRef<((val: string) => true | string)[]>
  userNameRules: ComputedRef<((val: string) => true | string)[]>
  passwordRules: ComputedRef<((val: string) => true | string)[]>
  confirmPasswordRules: (
    password: Ref<string>
  ) => ComputedRef<((val: string) => true | string)[]>
  requiredRulesWithMessage: (
    fieldName: string
  ) => ((val: string) => true | string)[]
  integerRulesWithMessage: (
    fieldName: string
  ) => ((val: string) => true | string)[]
}
export default function useRules(): UsableRules {
  const { t } = useI18n()

  const fieldRequiredRules = computed(() => {
    return [
      (val: string) =>
        (val && val.trim().length > 0) || t('rules.Field required'),
    ]
  })

  const fileRequiredRules = computed(() => {
    return [(val: File) => val || t('rules.File required')]
  })

  const userNameRules = computed(() => {
    return [
      (val: string) =>
        (val && val.trim().length > 0) || t('rules.Username required'),
      (val: string) =>
        (val && val.trim().length >= 6 && val.trim().length <= 18) ||
        t('rules.Username must be 6 to 18 characters long'),
      (val: string) =>
        (val && REGEX_PATTERN.USERNAME.test(val)) ||
        t('rules.Only alphanumeric', { key: `'.', '@', '-' '_'` }),
    ]
  })

  const passwordRules = computed(() => {
    return [
      (val: string) => val?.trim()?.length > 0 || t('rules.Password required'),
      (val: string) =>
        val?.trim()?.length >= 8 || t('rules.At least 8 characters long'),
      (val: string) =>
        (val && REGEX_PATTERN.PASSWORD_CONTAIN_NON_ALPHA_CHARACTER.test(val)) ||
        t('rules.Must contain at least one non-alphanumeric character'),
      (val: string) =>
        (val &&
          REGEX_PATTERN.PASSWORD_CONTAIN_BOTH_NUMBER_AND_TEXT.test(val)) ||
        t('rules.Must contain both numbers and letters'),
    ]
  })

  const emailRules = computed(() => {
    return [
      (val: string) =>
        (val && REGEX_PATTERN.EMAIL.test(val)) ||
        t('rules.Invalid email format'),
    ]
  })

  const smsRules = computed(() => {
    return [
      (val: string) =>
        (val && val.trim().length > 0) || t('rules.SMS required'),
    ]
  })

  const captchaRules = computed(() => {
    return [
      (val: string) =>
        (val && val.trim().length > 0) || t('rules.Captcha required'),
    ]
  })

  const requiredRules = computed(() => {
    return [
      (val: string | number) =>
        val?.toString()?.trim()?.length > 0 || t('rules.Field required'),
    ]
  })

  function requiredRulesWithMessage(message: string) {
    return [(val: string) => val?.trim()?.length > 0 || `${message}`]
  }

  function integerRulesWithMessage(message: string) {
    return [(val: string) => Number.isInteger(Number(val)) || `${message}`]
  }

  function confirmPasswordRules(password: Ref<string>) {
    return computed(() => [
      (val: string) =>
        val?.trim()?.length > 0 || t('rules.Confirm password required'),
      (val: string) =>
        (val && val === password.value) ||
        t('rules.Confirm password dont match'),
    ])
  }

  return {
    smsRules,
    emailRules,
    captchaRules,
    userNameRules,
    passwordRules,
    requiredRules,
    fileRequiredRules,
    fieldRequiredRules,
    confirmPasswordRules,
    integerRulesWithMessage,
    requiredRulesWithMessage,
  }
}
