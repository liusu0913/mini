import {
  set, get
} from 'lodash'

const init = (adapter) => {
  if (typeof adapter !== 'object') {
    throw new Error(
      'adapter must be object'
    )
  }

  const db = {
  }

  db.get = (key = '') => {
    const data = adapter.get()
    if (key === '') {
      return data
    } else {
      return get(data, key) || ''
    }
  }

  db.set = (key, data) => {
    const orgData = adapter.get()
    const result = set(orgData, key, data)
    adapter.set(result)
  }

  db.remove = (key) => {
    const orgData = adapter.get()
    const result = set(orgData, key, '')
    adapter.set(result)
  }

  db.clear = () => {
    adapter.clear()
  }

  return db
}

export default init
