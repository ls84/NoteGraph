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
    this.data.attachedValue = {}
    this.data.detachedValue = {}
    this.links = {from: [], to: [], detachedValue: []}

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
        this.links.detachedValue.forEach((v) => {
          v.data.from = position
          d3.select(v.DOM).select('.path').attr('d', v.pathDescription(true))
        })
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
      //TODO: should update itself? it's acutally almost
      d3.select(v.DOM).select('.path').attr('d', v.pathDescription())
    }
  }

  getValue (valueID) {
    this.gun.val((d, k) => {
      let valueKey = []
      for (let key in d) {
        if (typeof d[key] !== 'object') valueKey.push(key)
      }
      if (valueKey.length > 0) {
        let key = valueKey[0]
        let textLength = this.measureText(key)
        let size = valueID ? this.data.detachedValue[valueID] : {boundingBoxWidth: textLength.width, boundingBoxHeight: 0}
        let DOM = valueID ? document.querySelector(`#${valueID}`) : this.DOM.querySelector('.nodeValue')
        let container = d3.select(DOM).append(() => this.nodeSizeHandle(size, valueID)).node().parentNode
        d3.select(DOM).select('text.valueLabel').text(key)
        this.wrapText(d[key], container.querySelector('.value'), size)

        let cache = valueID ? this.data.detachedValue[valueID] : this.data.attachedValue
        cache.valueKey = key
        cache.value = d[key]
        if (valueID) this.data.detachedValue[valueID] = cache
        if (!valueID) this.data.attachedValue = cache
      }
    })
  }

  wrapText (text, container, overflow) {
    let overflowWidth = overflow.boundingBoxWidth - 15
    let overflowHeight = overflow.boundingBoxHeight
    let words = text.split(' ').reverse()
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

  nodeSizeHandle (size, valueID) {
    let cache = valueID ? this.data.detachedValue[valueID] : this.data

    if (size) {
      cache.boundingBoxWidth = size.boundingBoxWidth
      cache.boundingBoxHeight = size.boundingBoxHeight
    }

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
    })

    dragBehaviour.on('drag', (d, i, g) => {
      // d3.event.sourceEvent.stopPropagation()
      cache.boundingBoxWidth += d3.event.dx
      cache.boundingBoxHeight += d3.event.dy

      let minimalWidth = this.measureText(this.data.valueKey, 'valueLabel').width + 30
      cache.boundingBoxWidth = (cache.boundingBoxWidth < minimalWidth) ? minimalWidth : cache.boundingBoxWidth
      cache.boundingBoxHeight = (cache.boundingBoxHeight < 0) ? 0 : cache.boundingBoxHeight

      d3.select(g[i]).attr('transform', `translate(${cache.boundingBoxWidth}, ${cache.boundingBoxHeight})`)

      if (cache.boundingBoxHeight > 0) this.wrapText(this.data.attachedValue.value, g[i].parentNode.querySelector('.value'), cache)
      d3.select(g[i]).attr('transform', `translate(${cache.boundingBoxWidth}, ${cache.boundingBoxHeight})`)

      if (valueID) this.data.detachedValue[valueID] = cache
      if (!valueID) this.data = cache
    })

    if (valueID) cache.boundingBoxWidth -= 30
    let handle = document.createElementNS(d3.namespaces.svg, 'polygon')
    d3.select(handle).attr('class', 'boundingBoxHandle')
    .attr('transform', `translate(${cache.boundingBoxWidth += 30}, ${cache.boundingBoxHeight})`)
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

  nodeValue (valueID) {
    let group = this.group('nodeValue')
    let circle = this.circle('nodeValueAnchor')
    let dragBehaviour = d3.drag()
    let shadowValueID
    if (!valueID) {
      dragBehaviour.on('start', (d, i, g) => {
        d3.event.sourceEvent.stopPropagation()

        let mouse = d3.mouse(this.DOM.parentNode)
        let id = `value-${this.getRandomValue()}`
        let cache = this.data.detachedValue
        cache[id] = {
          position: mouse,
          boundingBoxWidth: this.data.boundingBoxWidth,
          boundingBoxHeight: this.data.boundingBoxHeight,
          value: this.data.value
        }

        let value = this.nodeValue(id)
        d3.select(this.DOM.parentNode).append(() => value)
        d3.select(this.DOM).select('.nodeValue').remove()
        this.getValue(id)
        shadowValueID = id
        this.data.detachedValue = cache

        let link = new this.canvas.Link(`link-${this.getRandomValue()}`, this.canvas)
        Object.assign(link.data, {from: this.data.position, to: this.data.position})
        link.resetHandle()
        link.appendSelf(true)

        link.toValue = id
        this.links.detachedValue.push(link)
      })

      dragBehaviour.on('drag', () => {
        let container = this.DOM.parentNode
        let mouse = d3.mouse(container)
        d3.select(container).select(`#${shadowValueID}`)
        .attr('transform', `translate(${mouse[0]}, ${mouse[1]})`)
        
        let link = this.links.detachedValue[this.links.detachedValue.length -1]
        link.drawLinkTo(mouse)

        // let cache = this.data.detachedValue
      })

      dragBehaviour.on('end', () => {
        //TODO: make sure it is dragged significantly 
      })

      d3.select(group).attr('transform', 'translate(0,40)').attr('display', 'none')
      .append(() => this.circle('valueAnchorBackground'))
      
      d3.select(group)
      .append(() => circle)
      .call(dragBehaviour)
    }

    if (valueID) {
      dragBehaviour.on('start', () => {
        d3.event.sourceEvent.stopPropagation()
      })
      dragBehaviour.on('drag', (d, i, g) => {
        let id = g[i].parentNode.id
        let container = this.DOM.parentNode
        let mouse = d3.mouse(this.DOM.parentNode)
        d3.select(g[i].parentNode)
        .attr('transform', `translate(${mouse[0]},${mouse[1]})`)

        let cache = this.data.detachedValue
        let link = this.links.detachedValue.filter((v) => v.toValue === id)[0]
        link.drawLinkTo(mouse)

      })
      let mouse = d3.mouse(this.DOM.parentNode)
      d3.select(group).attr('transform', `translate(${mouse[0]}, ${mouse[1]})`)
      .attr('id', valueID)
      .attr('display', 'true')
      .append(() => this.circle('valueAnchorBackground'))
      
      d3.select(group)
      .append(() => circle)
      .call(dragBehaviour)
    }

    d3.select(group).append('text').attr('class', 'valueLabel')
    .attr('transform', 'translate(15,4)')
    d3.select(group).append('text').attr('class', 'value')
    .attr('transform', 'translate(15, 25)')

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

    this.DOM = DOM

    // propagate data to child elements
    d3.select(this.DOM).select('.nodeAnchor circle')
    this.getValue()

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
