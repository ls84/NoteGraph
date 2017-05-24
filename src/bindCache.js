function bindCache (ElementClass) {
  let set = (t, p, v, r) => {
    if (p === 'position') this.state.cache.nodes[t.id].position = v
    t[p] = v
    return true
  }

  let construct = (T, a) => {
    let id = a[0]
    this.state.cache.nodes[id] = {}

    return new Proxy(new T(id), {set})
  }

  return new Proxy(ElementClass, {construct})
}

module.exports = bindCache
