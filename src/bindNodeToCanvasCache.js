function bindNodeToCanvasCache (canvas) {
  let set = (t, p, v, r) => {
    if (p === 'id') console.log(p, v)
    if (p === 'position') console.log(p, v)
    return Reflect.set(t, p, v, r)
  }


  return { set }
}

module.exports = bindNodeToCanvasCache
