class Link {
  constructor (id) {
    this.id = id
  }

  controlHandle () {
    let tick = [(this.to[0] - this.from[0]) / 6, (this.to[1] - this.from[1]) / 6]
    this.controlFrom = [this.from[0] + tick[0], this.from[1] + tick[1]]
    this.controlTo = [this.to[0] - tick[0], this.to[1] - tick[1]]
  }

  path () {
    let path = document.createElementNS(d3.namespaces.svg, 'path')
    d3.select(path)
    .attr('class', 'path')
    .attr('d', this.pathDescription())
  //  .on('dblclick', edit)

    return path
  }

  SVGElement (origin) {
    this.from = origin
    this.to = origin
    this.controlHandle()

    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'links').attr('id', this.id)
    d3.select(group).append(() => this.path())

    return group
  }

  pathDescription (waypoints, calculateHandle) {
    for (let key in waypoints) { this[key] = waypoints[key] }
    if (calculateHandle) this.controlHandle()
    let pathDescription = d3.path()
    pathDescription.moveTo(this.from[0], this.from[1])
    pathDescription.bezierCurveTo(this.controlFrom[0], this.controlFrom[1], this.controlTo[0], this.controlTo[1], this.to[0], this.to[1])

    return pathDescription.toString()
  }
}

module.exports = Link
