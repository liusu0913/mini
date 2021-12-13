import MiniDB from './base'

class LocalStorage extends MiniDB {
  set(data) {
    uni.setStorageSync(this.source, this.serialize(data))
  }

  get() {
    const data = uni.getStorageSync(this.source)
    if (data) {
      return this.deserialize(data)
    } else {
      uni.setStorageSync(this.source, this.serialize(this.defaultValue))
      return this.defaultValue
    }
  }

  clear() {
    uni.clearStorage()
  }
}

export default LocalStorage
