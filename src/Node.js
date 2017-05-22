let Primitives = require('./Primitives.js')

class Node extends Primitives {
  constructor (id) {
    super()
    this.id = id
    this.links = {from: [], to: []}

    this.drawLinkBehaviour = this.drawLinkBehaviour.bind(this)
    this.setNodeTarget = this.setNodeTarget.bind(this)
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
        this.updatePosition(position)
        let node = d3.selectAll('svg#Canvas #zoomTransform g.node').filter((d, i, g) => { return d.id === this.id })
        node.attr('transform', `translate(${position[0]}, ${position[1]})`)

        this.links.from.forEach(this.updateAttachedLink({from: position}))
        this.links.to.forEach(this.updateAttachedLink({to: position}))
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

    dragBehaviour.on('end', (d, i, g) => {
      let target = this.mouseOnTarget()
      let lastLink = this.links.from[this.links.from.length - 1]
      if (!target) d3.selectAll('svg#Canvas #zoomTransform g.links').filter((d, i, g) => { return (d.id === lastLink.id) }).remove()
      if (target && target.id !== this.id) target.addToLink(lastLink)
    })

    selection.call(dragBehaviour)
  }

  setNodeTarget (selection) {
    selection.on('mouseenter.setTarget', (d, i, g) => { this.setThisAsTarget() })
    selection.on('mouseleave.setTarget', (d, i, g) => { this.clearThisAsTarget() })
  }

  addToLink (link) {
    this.links.to.push(link)
    return true
  }

  updateAttachedLink (position) {
    return (v) => {
      let link = d3.selectAll('svg#Canvas #zoomTransform g.links').filter((d, i, g) => { return (d.id === v.id) })
      link.select('.path').attr('d', (d) => d.pathDescription(position))
    }
  }

  node () {
    let group = this.group('node', this.id)

    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', 'node').attr('id', this.id)
    .attr('r', 10)
    .call(this.drawLinkBehaviour)
    .call(this.setNodeTarget)

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
