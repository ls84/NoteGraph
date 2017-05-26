function bindNodeToCanvasCache (canvas) {
  let set = (t, p, v, r) => {
    // TODO: use canvas.setState() ?
    let cache = canvas.state.cache.nodes
    if (p === 'id') cache[v] = {}
    if (p === 'position') cache[t.id].position = v
    if (p === 'path') cache[t.id].path = v
    return Reflect.set(t, p, v, r)
  }

  return { set }
}

module.exports = bindNodeToCanvasCache
