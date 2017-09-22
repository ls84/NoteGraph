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
      let divider = 3

      return function (overwrite, empty) {
        counter += 1
        if (empty === true) divider = 2
        if (empty === false) divider = 3
        if (overwrite) counter = overwrite
        return level[counter % divider]
      }
    })()
    this.getRandomValue = canvas.getRandomValue
    this.measureText = canvas.measureText
    this.drawLinkBehaviour = this.drawLinkBehaviour.bind(this)
    this.drawLinkedNodes = this.drawLinkedNodes.bind(this)
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
        link.fromNode = this
        link.toNode = target
        target.addToLink(link)
      }
    })

    selection.call(dragBehaviour)
  }

  drawLinkedNodes (selection) {
    // TODO: linked Nodes
    // var gun = this.gun
    selection.on('dblclick', (d, i, g) => {
      let orbit = d3.select(this.DOM).select('.nodeOrbit').node()
      let nodes = []
      this.gun.val((d, k) => {
        let nodeKey = []
        for (let key in d) {
          if (typeof d[key] === 'object' && key !== '_' && d[key] !== null) nodeKey.push(key)
        }
        if (nodeKey.length > 0) {
          let svg = document.querySelector('svg#Canvas')
          let nodeTranslate = this.DOM.getCTM()
          let pt = svg.createSVGPoint()
          let length = orbit.getTotalLength() / 2
          let segment = length / nodeKey.length
          let offset = length * 0.75
          nodeKey.forEach((v, i) => {
            let path = `${this.data.path}.${v}`
            let position = orbit.getPointAtLength(offset + (segment * i))
            pt.x = position.x
            pt.y = position.y
            pt = pt.matrixTransform(nodeTranslate)
            this.canvas.props.getGunData(path)
            let node = this.canvas.appendNode(path, [pt.x, pt.y], 1)
            nodes.push(node)
          })
        }
        nodes.forEach((v) => {
          let link = new this.canvas.Link(`link-${this.getRandomValue()}`, this.canvas)
          link.data.from = this.data.position
          link.data.to = v.data.position
          link.fromNode = this
          link.toNode = v
          link.resetHandle()
          link.appendSelf()
          .call((s) => { this.canvas.setContext(s, 'link') })

          let predicate = v.data.path.split('.').pop()
          link.updatePredicate(predicate)
          this.links.from.push(link)
          v.links.to.push(link)
        })
      })
    })
  }

  setNodeTarget (selection) {
    selection.on('mouseenter.setTarget', (d, i, g) => { this.canvas.targetNode = this })
    selection.on('mouseleave.setTarget', (d, i, g) => { this.canvas.targetNode = null })
  }
  // TODO: can binding of links and nodes be aggregated into one function?
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
      // TODO: should update itself? it's acutally almost
      d3.select(v.DOM).select('.path').attr('d', v.pathDescription())
      v.updateText()
    }
  }

  displayNodeName (name) {
    if (name) this.data.displayName = name
    d3.select(this.DOM).select('.nodeAnchor .nodeLabel').text(this.data.displayName)
  }

  updateAttachedValue (key, value) {
    let textLength = this.measureText(key)
    let size = { boundingBoxWidth: textLength.width, boundingBoxHeight: 0 }
    let DOM = this.DOM.querySelector('.nodeValue')
    let container = d3.select(DOM).append(() => this.nodeSizeHandle(size)).node().parentNode
    d3.select(DOM).select('text.valueLabel').text(key)
    this.wrapText(value, container.querySelector('.value'), size)

    let cache = this.data.attachedValue
    cache.valueKey = key
    cache.value = value
    this.data.attachedValue = cache
  }

  updateDetachedValue (valueID, key, value) {
    let textLength = this.measureText(key)
    let size = { boundingBoxWidth: textLength.width, boundingBoxHeight: 0 }
    let DOM = document.querySelector(`.Value#${valueID}`)
    let container = d3.select(DOM).append(() => this.nodeSizeHandle(size)).node().parentNode
    d3.select(DOM).select('text.valueLabel').text(key)
    this.wrapText(value, container.querySelector('.value'), size)

    // let cache = this.data.detachedValue
    // cache[key] = {}
    // cache[key].value = value
    // // cache.valueKey = key
    // // cache.value = value
    // this.data.detachedValue = cache
  }

  initNode (k, cb) {
    // this.gun.val((d, k) => {
    //   this.normalizedPath = d['_']['#']
    //   this.displayNodeName()
    //   cb()
    // })
    this.canvas.props.putNewNode(k)
  }

  getValue (cb) {
    // let name = this.gun._.field
    // this.displayNodeName(name)
    // in order for '.not' to be called, it has to preceds 'val'
    this.gun.not((k) => {
      cb(null, k)
    })

    this.gun.val((d, k) => {
      this.normalizedPath = d['_']['#']
      // if (d !== null) {
      //   let name = d['name']
      //   if (name) this.displayNodeName(name)
      // }
      let valueKey = []
      for (let key in d) {
        valueKey.push(key)
      }

      valueKey = valueKey.filter((v) => {
        if (typeof d[v] === 'object') return false
        if (d[v] === null) return false
        if (v === 'name') return false
        if (this.data.detachedValue[v]) return false
        return true
      })
      cb(d, valueKey)
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
    let cache = valueID ? this.data.detachedValue[valueID] : this.data.attachedValue

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

      let minimalWidth = this.measureText(cache.valueKey, 'valueLabel').width + 30
      cache.boundingBoxWidth = (cache.boundingBoxWidth < minimalWidth) ? minimalWidth : cache.boundingBoxWidth
      cache.boundingBoxHeight = (cache.boundingBoxHeight < 0) ? 0 : cache.boundingBoxHeight

      d3.select(g[i]).attr('transform', `translate(${cache.boundingBoxWidth}, ${cache.boundingBoxHeight})`)

      if (cache.boundingBoxHeight > 0) this.wrapText(cache.value, g[i].parentNode.querySelector('.value'), cache)
      d3.select(g[i]).attr('transform', `translate(${cache.boundingBoxWidth}, ${cache.boundingBoxHeight})`)

      if (valueID) this.data.detachedValue[valueID] = cache
      if (!valueID) this.data.attachedValue = cache
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
    // let path = this.data.path

    let group = this.group('nodeAnchor')
    let circle = this.circle('nodeAnchor')
    d3.select(circle)
    .call(this.drawLinkBehaviour)
    .call(this.drawLinkedNodes)
    .call(this.setNodeTarget)
    .call((s) => this.canvas.setContext(s, 'node'))

    d3.select(group).append(() => circle)

    d3.select(group).append('text').attr('class', 'nodeLabel')
    .attr('transform', 'translate(-7,7)')

    return group
  }

  nodeAttachedValue () {
    let group = this.group('nodeValue')
    let circle = this.circle('nodeValueAnchor')
    let dragBehaviour = d3.drag()
    let shadowValueID

    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()

      let mouse = d3.mouse(this.DOM.parentNode)
      let id = `value-${this.getRandomValue()}`

      let value = this.nodeDetachedValue(id)
      d3.select(value).datum(this)
      d3.select(value).select('.nodeValueAnchor')
      .call((s) => { this.canvas.setContext(s, 'value') })
      d3.select(this.DOM.parentNode).append(() => value)
      .attr('transform', `translate(${mouse[0]},${mouse[1]})`)

      let k = this.data.attachedValue.valueKey
      let v = this.data.attachedValue.value

      this.updateDetachedValue(id, k, v)
      d3.select(this.DOM).select('.nodeValue').remove()

      let cache = this.data.detachedValue
      cache[k] = {
        position: mouse,
        value: v,
        boundingBoxWidth: this.data.attachedValue.boundingBoxWidth,
        boundingBoxHeight: this.data.attachedValue.boundingBoxHeight
      }
      this.data.detachedValue = cache

      shadowValueID = id

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
      d3.select(`.Value#${shadowValueID}`)
      .attr('transform', `translate(${mouse[0]}, ${mouse[1]})`)

      let link = this.links.detachedValue[this.links.detachedValue.length - 1]
      link.drawLinkTo(mouse)
      // TODO: update detachedValue Cache
    })

    dragBehaviour.on('end', () => {
      // TODO: make sure it is dragged significantly
      // TODO: should check if all value has been detached
      d3.select(this.DOM).append(() => this.nodeAttachedValue())
      this.getValue((d, k) => {
        if (d) {
          if (k.length === 0) return this.toggleDisplayLevel(1, true)
          let key = k[0]
          this.updateAttachedValue(key, d[key])
          this.toggleDisplayLevel(2, false)
        }
        if (!d) {
        }
      })
    })

    d3.select(group).attr('transform', 'translate(0,40)').attr('display', 'none')
    .append(() => this.circle('valueAnchorBackground'))

    d3.select(group)
    .append(() => circle)
    .call(dragBehaviour)
    .call((s) => { this.canvas.setContext(s, 'attachedValue') })

    d3.select(group).append('text').attr('class', 'valueLabel')
    .attr('transform', 'translate(15,4)')
    d3.select(group).append('text').attr('class', 'value')
    .attr('transform', 'translate(15, 25)')

    return group
  }

  nodeDetachedValue (valueID) {
    let group = this.group('Value')
    let circle = this.circle('nodeValueAnchor')
    let dragBehaviour = d3.drag()

    dragBehaviour.on('start', () => {
      d3.event.sourceEvent.stopPropagation()
    })
    dragBehaviour.on('drag', (d, i, g) => {
      let id = g[i].parentNode.id
      // let container = this.DOM.parentNode
      let mouse = d3.mouse(this.DOM.parentNode)
      d3.select(g[i].parentNode)
      .attr('transform', `translate(${mouse[0]},${mouse[1]})`)

      // let cache = this.data.detachedValue
      let link = this.links.detachedValue.filter((v) => v.toValue === id)[0]
      link.drawLinkTo(mouse)
    })

    d3.select(group).attr('transform', 'translate(0,40)').attr('id', valueID)
    .append(() => this.circle('valueAnchorBackground'))

    d3.select(group)
    .append(() => circle)
    .call(dragBehaviour)
    .call((s) => { this.canvas.setContext(s, 'value') })

    d3.select(group).append('text').attr('class', 'valueLabel')
    .attr('transform', 'translate(15,4)')
    d3.select(group).append('text').attr('class', 'value')
    .attr('transform', 'translate(15, 25)')

    return group
  }

  SVGElement () {
    let id = this.data.id
    let position = this.data.position

    let group = this.group('nodes', id)

    d3.select(group).attr('transform', `translate(${position[0]}, ${position[1]})`)
    d3.select(group).append(() => this.circle('nodeOrbit'))
    d3.select(group).append(() => this.nodeAnchor())
    // d3.select(group).append(() => this.nodeValue())
    d3.select(group).append(() => this.nodeAttachedValue())

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

    d3.select(this.DOM).select('.nodeAnchor circle')
    d3.select(this.DOM).select('.nodeValue .nodeValueAnchor')

    return d3.select(DOM)
  }

  toggleDisplayLevel (level, empty) {
    this.data.displayLevel = this.displayLevel(level, empty)
    let displayName = this.data.displayName ? this.data.displayName : ''
    switch (this.data.displayLevel) {
      case 'minimal':
        d3.select(this.DOM).select('.nodeLabel').text(displayName[0])
        d3.select(this.DOM).select('.nodeValue').attr('display', 'none')
        break
      case 'showPath':
        d3.select(this.DOM).select('.nodeLabel').text(displayName)
        break
      case 'showValue':
        d3.select(this.DOM).select('.nodeValue').attr('display', 'true')
        break
    }
  }
}

module.exports = Node
