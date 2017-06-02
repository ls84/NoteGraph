let Primitives = require('./Primitives.js')
let bindNodeToCanvasCache = require('./bindNodeToCanvasCache.js')

class Node extends Primitives {
  constructor (id, canvas) {
    super()
    this.data = new Proxy({}, bindNodeToCanvasCache(canvas))
    this.data.id = id
    this.data.fromLink = []
    this.data.toLink = []
    this.links = {from: [], to: []}

    this.measureText = canvas.measureText
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
        this.addFromLink(link)
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
        this.popLastLink()
        this.setContextToCanvas()
      }
      if (target && target.data.id !== this.data.id) {
        link.data.fromNode = this.data.id
        link.data.toNode = target.data.id
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
    let cache = this.data.toLink
    cache.push(link.data.id)
    this.data.toLink = cache
    return true
  }

  addFromLink (link) {
    this.links.from.push(link)
    let cache = this.data.fromLink
    cache.push(link.data.id)
    this.data.fromLink = cache
    return true
  }

  popLastLink () {
    this.links.from.pop()
    let cache = this.data.fromLink
    cache.pop()
    this.data.fromLink = cache
  }

  updateAttachedLink (key, position) {
    return (v) => {
      v.data[key] = position
      d3.select(v.DOM).select('.path').attr('d', v.pathDescription())
    }
  }

  wrapText (text) {
    let overflowWidth = 300
    if (text) this.value = text
    let words = this.value.split(' ').reverse()
    let lines = []
    let line = ''
    let word = words.pop()
    while (word) {
      let linePreview = line
      linePreview += `${word} `
      let overflow = (this.measureText(linePreview).width > overflowWidth)
      if (!overflow) line += `${word} `
      if (overflow) {
        lines.push(line)
        line = `${word} `
      }
      word = words.pop()
    }
    lines.forEach((v,i) => {
      d3.select(this.DOM).select('.value')
      .append('tspan').attr('x', 0).attr('y', `${i * 13}`)
      .text(v)
    })
  }

  nodeAnchor () {
    let path = this.data.path

    let group = this.group('nodeAnchor')
    // TODO: use primitives
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle)
    .attr('r', 25)
    .call(this.drawLinkBehaviour)
    .call(this.setNodeTarget)

    d3.select(group).append(() => circle)

    d3.select(group).append('text').attr('class', 'nodeLabel')
    .attr('transform', 'translate(-7,7)')
    .text(path[0].toUpperCase())

    return group
  }

  nodeValue () {
    let group = this.group('nodeValue')
    let circle = this.circle('nodeValueAnchor')

    d3.select(group).attr('transform', 'translate(0,40)')
    
    d3.select(group).append(() => circle)

    d3.select(group).append('text').attr('class', 'valueLabel')
    .attr('transform', 'translate(15,4)')
    d3.select(group).append('text').attr('class', 'value')
    .attr('transform', 'translate(15, 25)')
    
    this.gun.val((d, k) => {
      let value = []
      for (let key in d ) {
        if (typeof d[key] !== 'object') value.push(key)
      }
      if (value.length > 0) {
        d3.select(this.DOM).select('text.valueLabel').text(value[0])
        this.wrapText(d[value[0]])
        }
    })
    
    //TODO: this.gun.not()

    return group
  }

  SVGElement () {
    let id = this.data.id
    let position = this.data.position

    let group = this.group('nodes', id)

    d3.select(group).attr('transform', `translate(${position[0]}, ${position[1]})`)
    d3.select(group).append(() => this.nodeAnchor())
    d3.select(group).append(() => this.nodeValue())

    return group
  }

  appendSelf () {
    let DOM = d3.select('#Canvas #zoomTransform').selectAll('.nodes')
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
