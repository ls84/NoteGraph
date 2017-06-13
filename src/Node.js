let Primitives = require('./Primitives.js')
let bindNodeToCanvasCache = require('./bindNodeToCanvasCache.js')

class Node extends Primitives {
  constructor (id, canvas) {
    super()
    this.canvas = canvas
    this.data = new Proxy({}, bindNodeToCanvasCache(canvas))
    this.data.id = id
    // this.data.boundingBoxWidth = 0
    // this.data.boundingBoxHeight = 0
    this.data.fromLink = []
    this.data.toLink = []
    this.data.detachedValue = {}
    this.links = {from: [], to: []}

    this.displayLevel = (function () {
      let counter = 0
      let level = ['minimal', 'showPath', 'showValue']

      return function () {
        counter += 1
        return level[counter % 3]
      }
    })()
    this.getRandomValue = canvas.getRandomValue
    this.measureText = canvas.measureText
    this.drawLinkBehaviour = this.drawLinkBehaviour.bind(this)
    this.setNodeTarget = this.setNodeTarget.bind(this)
  }

  drawLinkBehaviour (selection) {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()

      if (d3.event.sourceEvent.shiftKey) {
        let link = new this.canvas.Link(`link-${this.getRandomValue()}`, this.canvas)
        Object.assign(link.data, {from: this.data.position, to: this.data.position})
        link.resetHandle()
        link.appendSelf()
        .call((s) => this.canvas.setContext(s, 'link'))
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
        if (this.canvas.targetNode) position = this.canvas.targetNode.data.position
        link.drawLinkTo(position)
      }
    })

    dragBehaviour.on('end', (d, i, g) => {
      let target = this.canvas.targetNode
      let link = this.links.from[this.links.from.length - 1]
      if (!target) {
        d3.select(link.DOM).remove()
        link.data.destory = link.data.id
        this.popLastLink()
        this.canvas.target = null
        this.canvas.context = 'canvas'
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
    selection.on('mouseenter.setTarget', (d, i, g) => { this.canvas.targetNode = this })
    selection.on('mouseleave.setTarget', (d, i, g) => { this.canvas.targetNode = null })
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

  wrapText (text, container) {
    let overflowWidth = this.data.boundingBoxWidth - 15
    let overflowHeight = this.data.boundingBoxHeight
    if (text) this.value = text
    let words = this.value.split(' ').reverse()
    let lines = []
    let line = words.pop()
    let word = words.pop()
    while (word) {
      let linePreview = line
      linePreview += ` ${word}`
      let overflow = (this.measureText(linePreview, 'value').width > overflowWidth)
      if (!overflow) line += ` ${word}`
      if (overflow) {
        lines.push(line)
        line = `${word}`
      }
      word = words.pop()
    }
    lines.push(line)
    d3.select(container).selectAll('tspan').remove()
    lines.forEach((v, i) => {
      if (((i + 1) * 13) < (overflowHeight)) {
        d3.select(container)
        .append('tspan').attr('x', 0).attr('y', `${i * 13}`)
        .text(v)
      }
    })
  }

  nodeSizeHandle (size) {
    if (size) {
      this.data.boundingBoxWidth = size.width
      this.data.boundingBoxHeight = size.height
    }

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
    })

    dragBehaviour.on('drag', (d, i, g) => {
      // d3.event.sourceEvent.stopPropagation()
      this.data.boundingBoxWidth += d3.event.dx
      this.data.boundingBoxHeight += d3.event.dy

      let minimalWidth = this.measureText(this.data.valueKey, 'valueLabel').width + 30
      this.data.boundingBoxWidth = (this.data.boundingBoxWidth < minimalWidth) ? minimalWidth : this.data.boundingBoxWidth
      this.data.boundingBoxHeight = (this.data.boundingBoxHeight < 0) ? 0 : this.data.boundingBoxHeight

      if (this.data.boundingBoxHeight > 0) this.wrapText(null, g[i].parentNode.querySelector('.value'))
      d3.select(this.DOM).select('.boundingBoxHandle').attr('transform', `translate(${this.data.boundingBoxWidth}, ${this.data.boundingBoxHeight})`)
      d3.select(g[i]).attr('transform', `translate(${this.data.boundingBoxWidth}, ${this.data.boundingBoxHeight})`)
    })

    let handle = document.createElementNS(d3.namespaces.svg, 'polygon')
    d3.select(handle).attr('class', 'boundingBoxHandle')
    .attr('transform', `translate(${this.data.boundingBoxWidth += 30}, ${this.data.boundingBoxHeight})`)
    .attr('points', '5,0 5,5 0,5')
    .call(dragBehaviour)

    return handle
  }

  nodeAnchor () {
    let path = this.data.path

    let group = this.group('nodeAnchor')
    let circle = this.circle('nodeAnchor')
    d3.select(circle)
    .call(this.drawLinkBehaviour)
    .call(this.setNodeTarget)
    .call((s) => this.canvas.setContext(s, 'node'))

    d3.select(group).append(() => circle)

    d3.select(group).append('text').attr('class', 'nodeLabel')
    .attr('transform', 'translate(-7,7)')
    .text(path[0])

    return group
  }

  nodeValue () {
    let group = this.group('nodeValue')
    let circle = this.circle('nodeValueAnchor')
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', () => {
      d3.event.sourceEvent.stopPropagation() 
    })
    dragBehaviour.on('drag', () => {
      let mouse = d3.mouse(this.DOM)
      d3.select(this.DOM).select('.nodeValue')
      .attr('transform', `translate(${mouse[0]},${mouse[1]})`)
      // TODO: should add new value link
    })
    dragBehaviour.on('end', () => {
      let mouse = d3.mouse(this.DOM.parentNode)
      let id = `value-${this.getRandomValue()}`
      let cache = this.data.detachedValue
      cache[id] = {position: mouse}

      let value = d3.select(this.DOM).select('.nodeValue').remove().node()
      d3.select(this.DOM.parentNode).append(() => value)
      .attr('id', id)
      .attr('transform', `translate(${mouse[0]},${mouse[1]})`)
      
      // TODO: this new dragBehaviour is too nested
      d3.select(value).select('circle').on('.drag', null)
      let dragBehaviour = d3.drag()
      dragBehaviour.on('start', (d, i, g) => {
        d3.event.sourceEvent.stopPropagation() 
      })
      dragBehaviour.on('drag', (d, i, g) => {
        let mouse = d3.mouse(g[i].parentNode.parentNode)
        d3.select(g[i].parentNode).attr('transform', `translate(${mouse[0]}, ${mouse[1]})`)
        let id = g[i].parentNode.id

        let cache = this.data.detachedValue
        cache[id].position = mouse
        this.data.detachedValue = cache
      })
      d3.select(value).select('circle').call(dragBehaviour)
      // TODO: should append new Nodevalue

      this.data.detachedValue = cache
    })

    d3.select(group).attr('transform', 'translate(0,40)').attr('display', 'none')
    .append(() => circle)
    .call(dragBehaviour)

    d3.select(group).append('text').attr('class', 'valueLabel')
    .attr('transform', 'translate(15,4)')
    d3.select(group).append('text').attr('class', 'value')
    .attr('transform', 'translate(15, 25)')

    this.gun.val((d, k) => {
      let valueKey = []
      for (let key in d) {
        if (typeof d[key] !== 'object') valueKey.push(key)
      }
      if (valueKey.length > 0) {
        let key = valueKey[0]
        let size = this.measureText(key)
        this.data.valueKey = key
        d3.select(group).append(() => this.nodeSizeHandle({ width: size.width, height: 0 }))
        d3.select(this.DOM).select('text.valueLabel').text(key)
        this.value = d[key]
      }
    })

    // TODO: this.gun.not()

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

    // propagate data to child elements
    d3.select(DOM).select('.nodeAnchor circle')

    this.DOM = DOM
    return d3.select(DOM)
  }

  toggleDisplayLevel () {
    this.data.displayLevel = this.displayLevel()
    switch (this.data.displayLevel) {
      case 'minimal':
        d3.select(this.DOM).select('.nodeLabel').text(this.data.path[0])
        d3.select(this.DOM).select('.nodeValue').attr('display', 'none')
        break
      case 'showPath':
        d3.select(this.DOM).select('.nodeLabel').text(this.data.path)
        break
      case 'showValue':
        d3.select(this.DOM).select('.nodeValue').attr('display', 'true')
        break
    }
  }
}

module.exports = Node
