class Link {
  constructor (id) {
    this.id = id

    this.controlBezier = this.controlBezier.bind(this)
  }

  resetHandle () {
    let tick = [(this.to[0] - this.from[0]) / 6, (this.to[1] - this.from[1]) / 6]
    this.controlFrom = [this.from[0] + tick[0], this.from[1] + tick[1]]
    this.controlTo = [this.to[0] - tick[0], this.to[1] - tick[1]]
  }

  edit (d, i, g) {
    console.log('edit')
    let handle = d3.select(g[i].parentNode).select('g.bezierHandle')
    let display = handle.attr('display')
    if (display === 'none') handle.attr('display', 'block')
    if (display === 'block') handle.attr('display', 'none')
  }
  
  controlBezier (selection) {
    let dragBehaviour = d3.drag()

    dragBehaviour.on('drag', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))
      let handle = g[i].classList.value
      this[handle] = cursor
      
      d3.select(g[i]).attr('cx', cursor[0]).attr('cy', cursor[1])
      d3.select(`svg g.links#${this.id}`).select('path').attr('d', () => this.pathDescription())
    })

    selection.call(dragBehaviour)
  }

  path () {
    let path = document.createElementNS(d3.namespaces.svg, 'path')
    d3.select(path)
    .attr('class', 'path')
    .attr('d', this.pathDescription())
    .on('dblclick', this.edit.bind(this))

    return path
  }

  handle (className, position) {
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', className)
    .attr('cx', position[0]).attr('cy', position[1])
    .attr('r', 5)
    .call(this.controlBezier)

    return circle
  }

  bezierHandle () {
    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'bezierHandle').attr('display', 'none')
    d3.select(group).append(() => this.handle('controlFrom', this.controlFrom))
    d3.select(group).append(() => this.handle('controlTo', this.controlTo))

    return group
  }

  SVGElement (origin) {
    this.from = origin
    this.to = origin
    this.resetHandle()

    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'links').attr('id', this.id)

    d3.select(group).append(() => this.path())
    d3.select(group).append(() => this.bezierHandle())

    return group
  }

  pathDescription (waypoints, calculateHandle) {
    for (let key in waypoints) { this[key] = waypoints[key] }
    if (calculateHandle) this.resetHandle()
    let pathDescription = d3.path()
    pathDescription.moveTo(this.from[0], this.from[1])
    pathDescription.bezierCurveTo(this.controlFrom[0], this.controlFrom[1], this.controlTo[0], this.controlTo[1], this.to[0], this.to[1])

    return pathDescription.toString()
  }
}

module.exports = Link
