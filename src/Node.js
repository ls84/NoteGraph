let Primitives = require('./Primitives.js')
let bindNodeToCanvasCache = require('./bindNodeToCanvasCache.js')
let Value = require('./Value.js')

class Node extends Primitives {
  constructor (id, canvas) {
    super()
    this.canvas = canvas
    this.data = new Proxy({}, bindNodeToCanvasCache(canvas, this))
    this.data.id = id
    this.data.attachedValue = new Proxy({}, {
      set: (t, p, v, r) => {
        if (p === 'key') {
          this.gun.val((d, k) => {
            if (d[v]) {
              let value = new Value(v, d[v], this)
              this.attachedValue = value
              this.attachedValue.appendAttachedValue()
              this.toggleDisplayLevel(2)
            }
          })
        }

        return Reflect.set(t, p, v, r)
      }
    })

    this.data.detachedValue = new Proxy({}, {
      set: (t, p, v, r) => {
        // must append link first
        let link = new this.canvas.Link(`link-${this.getRandomValue()}`, this.canvas)
        Object.assign(link.data, {from: this.data.position, to: v.position})
        link.resetHandle()
        link.appendSelf(true)
        link.toValue = p
        this.links.detachedValue[p] = link

        let value = new Value(v.key, v.value, this)
        this.detachedValue[p] = value
        this.detachedValue[p].appendDetachedValue(p)
        this.detachedValue[p].data.position = v.position
        this.detachedValue[p].data.boundingBoxDimension = v.boundingBoxDimension

        this.valueFilter.add(v.key)

        return Reflect.set(t, p, v, r)
      }
    })

    this.attachedValue = {}
    this.detachedValue = {}
    this.links = {from: {}, to: {}, detachedValue: {}}

    this.displayLevel = (function () {
      let counter = 0
      let level = [0, 1, 2]
      let divider = 3

      return function (overwrite, empty) {
        counter += 1
        if (empty === true) divider = 2
        if (empty === false) divider = 3
        if (overwrite) counter = overwrite
        return level[counter % divider]
      }
    })()

    this.valueFilter = new Set(['_'])
    this.drawLinkBehaviour = this.drawLinkBehaviour.bind(this)
    this.drawLinkedNodes = this.drawLinkedNodes.bind(this)
    this.setNodeTarget = this.setNodeTarget.bind(this)
  }

  drawLinkBehaviour (selection) {
    let dragBehaviour = d3.drag()
    let link
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()

      if (d3.event.sourceEvent.shiftKey) {
        let linkID = `link-${this.getRandomValue()}`
        link = new this.canvas.Link(linkID, this.canvas)
        link.data.cache = true
        link.data.id = linkID
        Object.assign(link.data, {from: this.data.position, to: this.data.position})
        link.resetHandle()
        link.appendSelf()
        .call((s) => this.canvas.setContext(s, 'link'))
      }
    })

    dragBehaviour.on('drag', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      let container = document.querySelector('svg#Canvas #zoomTransform')
      let position = d3.mouse(container)

      if (!d3.event.sourceEvent.shiftKey) {
        this.data.position = position
        // d3.select(this.DOM).attr('transform', `translate(${position[0]}, ${position[1]})`)

        for (let link in this.links.from) {
          this.updateAttachedLink.call(this.links.from[link], 'from', position)
        }
        for (let link in this.links.to) {
          this.updateAttachedLink.call(this.links.to[link], 'to', position)
        }

        for (let link in this.links.detachedValue) {
          this.updateAttachedLink.call(this.links.detachedValue[link], 'from', position, true)
        }
      }

      if (d3.event.sourceEvent.shiftKey) {
        if (this.canvas.targetNode) position = this.canvas.targetNode.data.position
        link.drawLinkTo(position)
      }
    })

    dragBehaviour.on('end', (d, i, g) => {
      let target = this.canvas.targetNode
      if (!target) {
        d3.select(link.DOM).remove()
        link.data.destory = link.data.id
        this.canvas.target = null
        this.canvas.context = 'canvas'
      }
      if (target && target.data.id !== this.data.id) {
        link.data.fromNode = this.data.id
        link.data.toNode = target.data.id
        link.fromNode = this
        link.toNode = target
        target.links.to[this.data.id] = link
        this.links.from[target.data.id] = link
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

  updateAttachedLink (key, position, calculateHandle) {
    this.data[key] = position
    d3.select(this.DOM).select('.path').attr('d', this.pathDescription(calculateHandle))
    this.updateText()
  }

  displayNodeName (name) {
    if (name) this.data.displayName = name
    d3.select(this.DOM).select('.nodeAnchor .nodeLabel').text(this.data.displayName)
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

  SVGElement () {
    let id = this.data.id
    // let position = this.data.position

    let group = this.group('nodes', id)

    // d3.select(group).attr('transform', `translate(${position[0]}, ${position[1]})`)
    d3.select(group).append(() => this.circle('nodeOrbit'))
    d3.select(group).append(() => this.nodeAnchor())
    // d3.select(group).append(() => this.nodeAttachedValue())

    return group
  }

  appendSelf () {
    let DOM = d3.select('#Canvas #zoomTransform').selectAll('.nodes')
    .data([this], (d) => d ? d.data.path : undefined)
    // .attr('transform', `translate(${this.data.position[0]}, ${this.data.position[1]})`)
    .enter()
    .append(() => this.SVGElement())
    .node()

    this.DOM = DOM

    // propagate d3 data to children
    d3.select(this.DOM).select('.nodeAnchor circle')
    d3.select(this.DOM).select('.nodeValue .nodeValueAnchor')

    return d3.select(DOM)
  }

  toggleDisplayLevel (level, empty) {
    this.data.displayLevel = this.displayLevel(level, empty)
    let displayName = this.data.displayName ? this.data.displayName : ''
    switch (this.data.displayLevel) {
      case 0:
        d3.select(this.DOM).select('.nodeLabel').text(displayName[0])
        d3.select(this.DOM).select('.nodeValue').attr('display', 'none')
        break
      case 1:
        d3.select(this.DOM).select('.nodeLabel').text(displayName)
        break
      case 2:
        d3.select(this.DOM).select('.nodeValue').attr('display', 'true')
        break
    }
  }
}

module.exports = Node
