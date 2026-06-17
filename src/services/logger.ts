import log from 'loglevel'
import * as Sentry from '@sentry/react'

const isDevelopment = import.meta.env.DEV

log.setLevel(isDevelopment ? 'debug' : 'warn')

const logger = {
  debug(message: string, data?: unknown) {
    log.debug(message, data ?? '')
  },
  info(message: string, data?: unknown) {
    log.info(message, data ?? '')
    Sentry.addBreadcrumb({
      category: 'info',
      message,
      level: 'info',
      data: data as Record<string, unknown>,
    })
  },
  warn(message: string, data?: unknown) {
    log.warn(message, data ?? '')
    Sentry.addBreadcrumb({
      category: 'warning',
      message,
      level: 'warning',
      data: data as Record<string, unknown>,
    })
  },
  error(message: string, error?: unknown, data?: unknown) {
    log.error(message, error ?? '', data ?? '')
    Sentry.captureException(error ?? new Error(message), {
      extra: {
        message,
        ...(data ? { data } : {}),
      },
    })
  },
  action(name: string, data?: unknown) {
    log.debug(`[ACTION] ${name}`, data ?? '')
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: name,
      level: 'info',
      data: data as Record<string, unknown>,
    })
  },
  api(method: string, url: string, status: number, ms: number) {
    log.debug(`[API] ${method} ${url} ${status} (${ms}ms)`)
  },
}

export default logger
