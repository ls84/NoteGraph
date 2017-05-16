class Node {
  constructor (id) {
    this.id = id
  }

  node () {
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', 'node').attr('id', this.id)
    .attr('cx', this.position[0]).attr('cy', this.position[1])
    .attr('r', 10)
    return circle
  }

  updatePosition (position) {
    this.position = position

    return this.position
  }

  SVGElement (origin) {
    this.position = origin

    return this.node()
  }
}

module.exports = Node
