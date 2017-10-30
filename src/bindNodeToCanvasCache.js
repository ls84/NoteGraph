function bindNodeToCanvasCache (canvas, thisNode) {
  let set = (t, p, v, r) => {
    let cache = canvas.state.cache.nodes
    if (p === 'id') cache[v] = {}
    // Notes: node.normalizedPath is not a property of data, should it be cached ?
    // if (p === 'normalizedPath') cache[t.id].normalizedPath = v
    if (p === 'position') {
      cache[t.id].position = v
      d3.select(thisNode.DOM).attr('transform', `translate(${v[0]}, ${v[1]})`)
    }
    if (p === 'displayLevel') {
      cache[t.id].displayLevel = v
    }
    if (p === 'path') cache[t.id].path = v
    if (p === 'detachedValue') cache[t.id].detachedValue = v
    return Reflect.set(t, p, v, r)
  }

  return { set }
}

module.exports = bindNodeToCanvasCache
