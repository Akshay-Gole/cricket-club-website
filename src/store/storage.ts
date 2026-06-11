import createWebStorageModule from 'redux-persist/lib/storage/createWebStorage'

const createWebStorage =
  (
    createWebStorageModule as unknown as {
      default?: typeof createWebStorageModule
    }
  ).default ?? createWebStorageModule

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null)
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value)
  },
  removeItem() {
    return Promise.resolve()
  },
})

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

export default storage
