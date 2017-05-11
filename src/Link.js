function edit (d, i, g) {
  console.log('edit', g[i].parentNode)
  let handle = d3.select(g[i].parentNode).select('g.bezierHandle')
  let display = handle.attr('display')
  if (display === 'none') handle.attr('display', 'block')
  if (display === 'block') handle.attr('display', 'none')
}

function circle (className, position) {
  let circle = document.createElementNS(d3.namespaces.svg, 'circle')
  d3.select(circle).attr('r', 5).attr('class', className)
  .attr('cx', position[0])
  .attr('cy', position[1])

  return circle
}

function bezierHandle (from, to) {
  function moveHandle (selection) {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('drag', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))
      console.log('drag handle', cursor)
      d3.select(g[i]).attr('cx', cursor[0]).attr('cy', cursor[1])
      // TODO: updates pathDescription
    })

    selection.call(dragBehaviour)
  }

  let group = document.createElementNS(d3.namespaces.svg, 'g')
  d3.select(group).attr('class', 'bezierHandle').attr('display', 'none')

  let tick = [(to[0] - from[0]) / 6, (to[1] - from[1]) / 6]
  let controlFrom = [from[0] + tick[0], from[1] + tick[1]]
  d3.select(group).append(() => circle('controlFrom', controlFrom)).call(moveHandle)
  let controlTo = [to[0] - tick[0], to[1] - tick[1]]
  d3.select(group).append(() => circle('controlTo', controlTo)).call(moveHandle)

  return group
}

function path (from, to) {
  let pathDescription = d3.path()

  let tick = [(to[0] - from[0]) / 6, (to[1] - from[1]) / 6]
  let controlFrom = [from[0] + tick[0], from[1] + tick[1]]
  let controlTo = [to[0] - tick[0], to[1] - tick[1]]

  pathDescription.moveTo(from[0], from[1])
  pathDescription.bezierCurveTo(controlFrom[0], controlFrom[1], controlTo[0], controlTo[1], to[0], to[1])

  let path = document.createElementNS(d3.namespaces.svg, 'path')
  d3.select(path)
  .attr('class', 'path')
  .attr('d', pathDescription.toString())
  .on('dblclick', edit)

  return path
}

function Link (from, to) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  d3.select(group).attr('class', 'links')

  d3.select(group).append(() => path(from, to))
  d3.select(group).append(() => bezierHandle(from, to))

  return group
}

module.exports = Link
