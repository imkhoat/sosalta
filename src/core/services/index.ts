import axios from 'axios'
import { Notify } from 'quasar'
import { useAuthStore } from 'src/core/stores/auth'
import { RESPONSE_CODE } from './utils/https-code'

const baseURL = JSON.parse(
  localStorage.getItem('application-configuration') ?? '{}'
)?.baseURL
const https = axios.create({ baseURL: baseURL ?? process.env.BASE_API_URL })

https.interceptors.response.use(
  function (response) {
    const { setAuthenticationToken, logout } = useAuthStore()

    if (response?.headers?.token) {
      setAuthenticationToken(response?.headers?.token)
    }

    if (
      response?.data?.code === RESPONSE_CODE.TOKEN_EXPIRED ||
      !response?.data?.code
    ) {
      logout()
    } else if (response?.data?.code !== RESPONSE_CODE.SUCCESS) {
      const message =
        response.data?.message ??
        response.data?.data?.errorMsg ??
        'Server error!'
      Notify.create({
        message: message,
        type: 'negative',
        html: true,
      })
    }

    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

https.interceptors.request.use(
  function (config) {
    const { getAuthenticationToken, logout } = useAuthStore()
    const authenticationToken = getAuthenticationToken()
    if (!authenticationToken) {
      logout()
    }
    config.headers.token = JSON.stringify(authenticationToken)

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default https
