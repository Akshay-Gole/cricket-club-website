import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from './storage'

import authReducer from '../features/auth/store/authSlice'
import reduxLogger from './middleware/reduxLogger'

const rootReducer = combineReducers({
  auth: authReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const isDevelopment = import.meta.env.DEV

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
    })
    if (isDevelopment) {
      middleware.push(reduxLogger)
    }
    return middleware
  },
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
