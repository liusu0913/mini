const stringify = (obj) => {
  return JSON.stringify(obj, null, 2)
}

class MiniDB {
  constructor(source, {
    defaultValue = {
    }, serialize = stringify, deserialize = JSON.parse
  } = {
  }) {
    this.source = source
    this.defaultValue = defaultValue
    this.serialize = serialize
    this.deserialize = deserialize
  }
}

export default MiniDB
