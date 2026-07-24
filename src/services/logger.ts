import log from 'loglevel'

const isDevelopment = import.meta.env.DEV
const hasSentry =
  import.meta.env.PROD && Boolean(import.meta.env.VITE_SENTRY_DSN)

function reportError(message: string, error?: unknown, data?: unknown) {
  if (hasSentry) {
    void import('@sentry/react').then(Sentry => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.MODE,
        tracesSampleRate: 0,
      })
      Sentry.captureException(error ?? new Error(message), {
        extra: {
          message,
          ...(data ? { data } : {}),
        },
      })
    })
  }
}

log.setLevel(isDevelopment ? 'debug' : 'warn')

const logger = {
  debug(message: string, data?: unknown) {
    log.debug(message, data ?? '')
  },
  info(message: string, data?: unknown) {
    log.info(message, data ?? '')
  },
  warn(message: string, data?: unknown) {
    log.warn(message, data ?? '')
  },
  error(message: string, error?: unknown, data?: unknown) {
    log.error(message, error ?? '', data ?? '')
    reportError(message, error, data)
  },
  action(name: string, data?: unknown) {
    log.debug(`[ACTION] ${name}`, data ?? '')
  },
  api(method: string, url: string, status: number, ms: number) {
    log.debug(`[API] ${method} ${url} ${status} (${ms}ms)`)
  },
}

export default logger
