import { Notify } from 'quasar'

export const errorHandler = {
  log: function (message: string | unknown) {
    console.log(message)
  },
  notify: function (message: string | unknown) {
    let e = ''

    if (typeof message === 'string') {
      e = message
    } else if (message instanceof Error) {
      e = message.message
    } else {
      e = (message as Error).message
    }

    Notify.create({
      message: e,
      type: 'negative',
    })
  },
}
