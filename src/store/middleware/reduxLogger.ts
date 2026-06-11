import type { Middleware } from '@reduxjs/toolkit'
import logger from '../../services/logger'

const reduxLogger: Middleware = store => next => action => {
  logger.debug(`[REDUX] ${(action as { type: string }).type}`, {
    state: store.getState(),
  })

  return next(action)
}

export default reduxLogger
