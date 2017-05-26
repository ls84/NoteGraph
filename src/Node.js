let Primitives = require('./Primitives.js')
let bindNodeToCanvasCache = require('./bindNodeToCanvasCache.js')

class Node extends Primitives {
  constructor (id, canvas) {
    super()
    this.data = new Proxy({}, bindNodeToCanvasCache(canvas))
    this.data.id = id
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
        Object.assign(link.data, {from: this.data.position, to: this.data.position})
        link.resetHandle()
        link.appendSelf()
        .call((s) => { this.newLinkContext(s) })
        this.links.from.push(link)
      }
    })

    dragBehaviour.on('drag', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      let container = document.querySelector('svg#Canvas #zoomTransform')
      let position = d3.mouse(container)

      if (!d3.event.sourceEvent.shiftKey) {
        this.data.position = position
        d3.select(this.DOM).attr('transform', `translate(${position[0]}, ${position[1]})`)

        this.links.from.forEach(this.updateAttachedLink('from', position))
        this.links.to.forEach(this.updateAttachedLink('to', position))
      }

      if (d3.event.sourceEvent.shiftKey) {
        let link = this.links.from[this.links.from.length - 1]
        if (this.mouseOnTarget()) position = this.mouseOnTarget().data.position
        link.drawLinkTo(position)
      }
    })

    dragBehaviour.on('end', (d, i, g) => {
      let target = this.mouseOnTarget()
      let link = this.links.from[this.links.from.length - 1]
      if (!target) {
        d3.select(link.DOM).remove()
        link.data.destory = link.data.id
        this.links.from.pop()
        this.setContextToCanvas()
      }
      if (target && target.data.id !== this.data.id) {
        // TODO: should reference the node but cache the path
        link.data.fromNode = this.data.path
        link.data.toNode = target.data.path
        target.addToLink(link)
      }
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

  addFromLink (link) {
    this.links.from.push(link)
    return true
  }

  updateAttachedLink (key, position) {
    return (v) => {
      v.data[key] = position
      d3.select(v.DOM).select('.path').attr('d', v.pathDescription())
    }
  }

  node () {
    let id = this.data.id
    let position = this.data.position
    let path = this.data.path

    let group = this.group('node', id)
    // TODO: use primitives
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', 'nodeAnchor')
    .attr('r', 25)
    .call(this.drawLinkBehaviour)
    .call(this.setNodeTarget)

    d3.select(group).attr('transform', `translate(${position[0]}, ${position[1]})`)
    .append(() => circle)

    d3.select(group).append('text').attr('class', 'nodeLabel')
    .attr('transform', 'translate(-7,7)')
    .text(path[0].toUpperCase())

    return group
  }

  SVGElement () {
    return this.node()
  }

  appendSelf () {
    let DOM = d3.select('#Canvas #zoomTransform').selectAll('.node')
    .data([this], (d) => d ? d.data.path : undefined)
    .attr('transform', `translate(${this.data.position[0]}, ${this.data.position[1]})`)
    .enter()
    .append(() => this.SVGElement())
    .node()

    this.DOM = DOM
    return d3.select(DOM)
  }
}

module.exports = Node
