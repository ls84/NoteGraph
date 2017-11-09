let Primitives = require('./Primitives.js')

class Value extends Primitives {
  constructor (key, value, node) {
    super()
    this.node = node
    this.key = key
    this.value = value
    this.canvasDOM = document.querySelector('svg#Canvas #zoomTransform')
    this.keyRenderLength = this.measureText(this.key).width
    this.data = new Proxy({}, {
      set: (t, p, v, r) => {
        if (p === 'boundingBoxDimension') {
          let minimalWidth = this.keyRenderLength + 30
          v[0] = (v[0] < minimalWidth) ? minimalWidth : v[0]
          v[1] = (v[1] < 0) ? 0 : v[1]

          d3.select(this.DOM).select('.boundingBoxHandle')
          .attr('transform', `translate(${v[0]}, ${v[1]})`)
          this.wrapText(v)
        }

        if (p === 'position') {
          d3.select(this.DOM)
          .attr('transform', `translate(${v[0]}, ${v[1]})`)

          let link = this.node.links.detachedValue[this.valueID]
          link.drawLinkTo(v)
        }
        return Reflect.set(t, p, v, r)
      }
    })
  }

  wrapText (overflow) {
    let overflowWidth = overflow[0] - 15
    let overflowHeight = overflow[1]
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
    d3.select(this.DOM).select('.value').selectAll('tspan').remove()
    lines.forEach((v, i) => {
      if (((i + 1) * 13) < (overflowHeight)) {
        d3.select(this.DOM).select('.value')
        .append('tspan').attr('x', 0).attr('y', `${i * 13}`)
        .text(v)
      }
    })
    // TODO: return if all text are displayed
  }

  valueSizeHandle () {
    this.data.boundingBoxDimension = [this.keyRenderLength, 0]

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
    })

    dragBehaviour.on('drag', (d, i, g) => {
      let dimension = [this.data.boundingBoxDimension[0] += d3.event.dx, this.data.boundingBoxDimension[1] += d3.event.dy]
      this.data.boundingBoxDimension = dimension
    })

    let handle = document.createElementNS(d3.namespaces.svg, 'polygon')
    d3.select(handle).attr('class', 'boundingBoxHandle')
    .attr('transform', `translate(${this.data.boundingBoxDimension[0]}, ${this.data.boundingBoxDimension[1]})`)
    .attr('points', '5,0 5,5 0,5')
    .call(dragBehaviour)

    return handle
  }

  baseDOM () {
    this.DOM = this.group()
    let circle = this.circle('nodeValueAnchor')

    d3.select(this.DOM).attr('transform', 'translate(0,40)').attr('display', 'true')
    .append(() => this.circle('valueAnchorBackground'))

    d3.select(this.DOM)
    .append(() => circle)

    d3.select(this.DOM).append('text').attr('class', 'valueLabel')
    .attr('transform', 'translate(15,4)').text(this.key)
    d3.select(this.DOM).append('text').attr('class', 'value')
    .attr('transform', 'translate(15, 25)')
    d3.select(this.DOM).append(() => this.valueSizeHandle())
  }

  appendAttachedValue () {
    this.baseDOM()
    this.DOM.classList = ['nodeValue']
    let valueID

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      this.DOM.remove()
      valueID = `value-${this.getRandomValue()}`
      let position = d3.mouse(this.canvasDOM)
      this.node.data.detachedValue[valueID] = {
        key: this.key,
        value: this.value,
        boundingBoxDimension: this.data.boundingBoxDimension,
        position
      }
    })

    dragBehaviour.on('drag', () => {
      let mouse = d3.mouse(this.canvasDOM)
      let detachedValue = this.node.detachedValue[valueID]
      detachedValue.data.position = mouse
    })

    d3.select(this.DOM).select('.nodeValueAnchor')
    .call(dragBehaviour)
    .call((s) => this.node.canvas.setContext(s, 'attachedValue'))

    d3.select(this.node.DOM).append(() => this.DOM)
  }

  appendDetachedValue (valueID) {
    this.valueID = valueID
    this.baseDOM()
    this.DOM.classList = ['Value']
    this.DOM.id = this.valueID

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
    })
    dragBehaviour.on('drag', (d, i, g) => {
      let mouse = d3.mouse(this.canvasDOM)
      this.data.position = mouse
    })

    d3.select(this.DOM).select('.nodeValueAnchor')
    .call(dragBehaviour)
    .call((s) => this.node.canvas.setContext(s, 'detachedValue'))

    d3.select('svg#Canvas #zoomTransform').append(() => this.DOM)
  }
}

module.exports = Value
