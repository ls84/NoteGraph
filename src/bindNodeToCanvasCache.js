function bindNodeToCanvasCache (canvas, thisNode) {
  let set = (t, p, v, r) => {
    // TODO: use canvas.setState() ?
    let cache = canvas.state.cache.nodes
    if (p === 'id') cache[v] = {}
    if (p === 'normalizedKey') cache[t.id].normalizedKey = v
    if (p === 'position') {
      cache[t.id].position = v
      d3.select(thisNode.DOM).attr('transform', `translate(${v[0]}, ${v[1]})`)
    }
    if (p === 'path') cache[t.id].path = v
    if (p === 'fromLink') cache[t.id].fromLink = v
    if (p === 'toLink') cache[t.id].toLink = v
    if (p === 'detachedValue') cache[t.id].detachedValue = v

    return Reflect.set(t, p, v, r)
  }

  return { set }
}

module.exports = bindNodeToCanvasCache
