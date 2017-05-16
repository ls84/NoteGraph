class Node {
  constructor (id) {
    this.id = id
  }

  startLink () {
  }

  drawLinkBehaviour (selection) {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      console.log('start')
      // let cursor = d3.mouse(document.querySelector('svg#Canvas'))
      // let link = new this.c.Link(`test-${++this.c.state.iterator}`)
      // d3.select('svg#Canvas').selectAll('g.links')
      // .data([link], (d, i, g) => d.id).enter()
      // .append((d) => d.SVGElement(cursor))
      // .call((s) => { this.setContext(s, 'link') })
    })
    dragBehaviour.on('drag', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      console.log('drag')
      // let cursor = d3.mouse(document.querySelector('svg#Canvas'))
      // console.log('still drags')
      // let link = d3.selectAll('svg#Canvas g.links').filter((d, i, g) => (d.id === `test-${this.c.state.iterator}`))
      // link.select('.path').attr('d', (d) => d.pathDescription({to: cursor}, true))
      // link.select('.controlFrom').attr('cx', (d) => d.controlFrom[0]).attr('cy', (d) => d.controlFrom[1])
      // link.select('.controlTo').attr('cx', (d) => d.controlTo[0]).attr('cy', (d) => d.controlTo[1])
    })

    selection.call(dragBehaviour)
  }

  node () {
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', 'node').attr('id', this.id)
    .attr('cx', this.position[0]).attr('cy', this.position[1])
    .attr('r', 10)
    .call(this.drawLinkBehaviour)
    // .on('dragstart', this.link)

    return circle
  }

  updatePosition (position) {
    this.position = position

    return this.position
  }

  startLink (newLink) {
  }

  SVGElement (origin) {
    this.position = origin

    return this.node()
  }
}

module.exports = Node
