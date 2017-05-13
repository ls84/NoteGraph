function bindCache (ElementClass) {
  let set = (t, p, v) => {
    // TODO: cache relevant waypoints
    // TODO: cache id change
    t[p] = v
    return true
  }

  let construct = (T, a) => {
    // TODO: cache link id
    let instance = new T(a[0])
    return new Proxy(instance, {set})
  }

  return new Proxy(ElementClass, {construct})
}

module.exports = bindCache
