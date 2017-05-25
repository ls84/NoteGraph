function bindCache (ElementClass) {
  let set = (t, p, v, r) => {
    let cache = this.state.cache.links[t.id]
    if (p === 'from') cache.from = v
    if (p === 'controlFrom') cache.controlFrom = v
    if (p === 'to') cache.to = v
    if (p === 'controlTo') cache.controlTo = v
    if (p === 'destory') delete this.state.cache.links[t.id]
    if (p === 'fromNode') cache.fromNode = v
    if (p === 'toNode') cache.toNode = v

    return Reflect.set(t, p, v)
  }

  let construct = (T, a) => {
    let id = a[0]
    this.state.cache.links[id] = {predicate: ''}

    return new Proxy(new T(id), {set})
  }

  return new Proxy(ElementClass, {construct})
}

module.exports = bindCache
