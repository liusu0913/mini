import db from '@/libs/mini-db'

const dbInit = ({
  dbName = 'database',
  path = '',
  user = true,
  validator = () => true,
  defaultValue = ''
}) => {
  const uuid = 'visitor-uuid'
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
  const value = db.get(currentPath)

  if (!(value !== undefined && validator(value))) {
    db.set(currentPath, defaultValue)
  }
  return currentPath
}

export default {
  namespaced: true,
  actions: {
    set(context, {
      dbName = 'database',
      path = '',
      user = false,
      value = ''
    }) {
      const key = dbInit({
        dbName,
        path,
        user
      })
      db.set(key, value)
    },
    get(context, {
      dbName = 'database',
      path = '',
      user = false,
      defaultValue = ''
    }) {
      return new Promise((resolve) => {
        const key = dbInit({
          dbName,
          path,
          user,
          defaultValue
        })
        resolve(db.get(key))
      })
    }
  }
}
