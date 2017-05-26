function bindLinkToCanvasCache (canvas) {
  let set = (t, p, v, r) => {
    // TODO: use canvas.setState() ?
    let cache = canvas.state.cache.links
    if (p === 'id') cache[v] = {}
    if (p === 'predicate') cache[t.id][p] = v
    if (p === 'from') cache[t.id][p] = v
    if (p === 'controlFrom') cache[t.id][p] = v
    if (p === 'to') cache[t.id][p] = v
    if (p === 'controlTo') cache[t.id][p] = v
    if (p === 'destory') delete cache[v]
    if (p === 'fromNode') cache[t.id][p] = v
    if (p === 'toNode') cache[t.id][p] = v
    return Reflect.set(t, p, v, r)
  }

  return { set }
}

module.exports = bindLinkToCanvasCache
