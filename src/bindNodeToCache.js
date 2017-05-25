function bindCache (ElementClass) {
  let get = (t, p, r) => {
    return Reflect.get(t, p)
  }

  let set = (t, p, v, r) => {
    if (p === 'position') this.state.cache.nodes[t.id].position = v

    return Reflect.set(t, p, v)
  }

  let construct = (T, a) => {
    let id = a[0]
    this.state.cache.nodes[id] = {}

    return new Proxy(new T(id), {set, get})
  }

  return new Proxy(ElementClass, {construct})
}

module.exports = bindCache
