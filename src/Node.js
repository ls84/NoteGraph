let Primitives = require('./Primitives.js')

class Node extends Primitives {
  constructor (id) {
    super()
    this.id = id
    this.links = {from: [], to: []}

    this.drawLinkBehaviour = this.drawLinkBehaviour.bind(this)
    this.setNodeTarget = this.setNodeTarget.bind(this)
    this.clearNodeTarget = this.clearNodeTarget.bind(this)
  }

  drawLinkBehaviour (selection) {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()

      if (d3.event.sourceEvent.shiftKey) {
        let link = this.newLink()
        this.links.from.push(link)
        d3.select('svg#Canvas #zoomTransform').selectAll('g.links')
        .data([link], (d, i, g) => d.id).enter()
        .insert((d) => d.SVGElement(this.position), ':first-child')
        .call((s) => { this.newLinkContext(s) })
      }
    })

    dragBehaviour.on('drag', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      let container = document.querySelector('svg#Canvas #zoomTransform')
      let position = d3.mouse(container)

      if (!d3.event.sourceEvent.shiftKey) {
        let node = d3.selectAll('svg#Canvas #zoomTransform g.node').filter((d, i, g) => { return d.id === this.id })
        this.updatePosition(position)
        node.attr('transform', `translate(${position[0]}, ${position[1]})`)
      }

      if (d3.event.sourceEvent.shiftKey) {
        let lastLink = this.links.from[this.links.from.length - 1]
        let link = d3.selectAll('svg#Canvas #zoomTransform g.links').filter((d, i, g) => { return (d.id === lastLink.id) })
        if (this.mouseOnTarget()) position = this.mouseOnTarget().position
        link.select('.path').attr('d', (d) => d.pathDescription({to: position}, true))
        link.select('.controlFrom').attr('cx', (d) => d.controlFrom[0]).attr('cy', (d) => d.controlFrom[1])
        link.select('.controlTo').attr('cx', (d) => d.controlTo[0]).attr('cy', (d) => d.controlTo[1])
      }
    })

    selection.call(dragBehaviour)
  }

  setNodeTarget (selection) {
    selection.on('mouseenter', (d, i, g) => {
      this.setThisAsTarget()
    })
  }

  clearNodeTarget (selection) {
    selection.on('mouseleave', (d, i, g) => {
      this.clearThisAsTarget()
    })
  }

  node () {
    let group = this.group('node', this.id)

    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', 'node').attr('id', this.id)
    .attr('r', 10)
    .call(this.drawLinkBehaviour)
    .call(this.setNodeTarget)
    .call(this.clearNodeTarget)

    d3.select(group).attr('transform', `translate(${this.position[0]}, ${this.position[1]})`)
    .append(() => circle)

    return group
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
