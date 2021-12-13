/**
 * lowdb的简版
 */
import MiniDB from './init'
import LocalStorage from './localstorage'

const adapter = new LocalStorage('uniapp', {
  defaultValue: {
    sys: {
    },
    database: {
    }
  }
})

const db = MiniDB(adapter)

export default db
