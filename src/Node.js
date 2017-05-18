class Node {
  constructor (id) {
    this.id = id

    this.drawLinkBehaviour = this.drawLinkBehaviour.bind(this)
  }

  drawLinkBehaviour (selection) {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      let position = d3.mouse(g[i].parentNode)

      if (d3.event.sourceEvent.shiftKey) {
        let link = this.newLink()
        d3.select('svg#Canvas #zoomTransform').selectAll('g.links')
        .data([link], (d, i, g) => d.id).enter()
        .append((d) => d.SVGElement(this.position))
        .call((s) => {this.newLinkContext(s)})
      }
    })

    dragBehaviour.on('drag', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      let position = d3.mouse(g[i].parentNode)

      if (!d3.event.sourceEvent.shiftKey) {
        let node = d3.selectAll('svg#Canvas #zoomTransform circle.node').filter((d, i, g) => {return d.id === this.id})
        node.attr('cx', (d) => d.updatePosition(position)[0]).attr('cy', (d) => d.updatePosition(position)[1])
      }

      if (d3.event.sourceEvent.shiftKey) {
        let link = d3.selectAll('svg#Canvas #zoomTransform g.links').filter((d, i, g) => {return (d.id === 'link-test')})
        link.select('.path').attr('d', (d) => d.pathDescription({to: position}, true))
        link.select('.controlFrom').attr('cx', (d) => d.controlFrom[0]).attr('cy', (d) => d.controlFrom[1])
        link.select('.controlTo').attr('cx', (d) => d.controlTo[0]).attr('cy', (d) => d.controlTo[1])
      }
    })

    selection.call(dragBehaviour)
  }

  node () {
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', 'node').attr('id', this.id)
    .attr('cx', this.position[0]).attr('cy', this.position[1])
    .attr('r', 10)
    .call(this.drawLinkBehaviour)

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
