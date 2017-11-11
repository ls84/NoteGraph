let root = Gun()
let data = root.get('data')
console.log('should always be called once')

class GunCache {
  constructor (path) {
    this.path = path
    this.data = data.path(path)
    this.data.on((d, k) => {
      console.log('change on node:', k, d)
      this.cache = d
    }, true)
    this.data.not((k) => {
      console.log('node do not exists:', k, 'putting an empty object')
      this.data.put({name: path})
    })
  }
}

module.exports = GunCache
