let Primitives = require('./Primitives.js')

class Elements extends Primitives {
  constructor (graph) {
    super()
    this.defaultWidth = 200
    this.defaultHeight = 200
  }

  nodeLabel (path) {
    let nodeLabel = document.createElementNS(d3.namespaces.svg, 'foreignObject')
    d3.select(nodeLabel)
    .attr('class', 'nodeLabel')
    .attr('transform', 'translate(20,-13)')
    .attr('width', this.defaultWidth)
    .append(() => this.div('path', path, true))

    return nodeLabel
  }

  nodeValues (data) {
    let nodeValues = document.createElementNS(d3.namespaces.svg, 'foreignObject')
    d3.select(nodeValues)
    .attr('class', 'nodeValues')
    .attr('transform', 'translate(0,20)')
    .attr('width', this.defaultWidth)
    .attr('height', this.defaultHeight)
    .append(() => this.div('moreValue', '+'))

    for (let key in data) {
      if (typeof data[key] !== 'object') d3.select(nodeValues).append(() => this.valueGroup(key, data[key]))
    }

    return nodeValues
  }

  boundingBox () {
    let boundingBox = this.group('boundingBox')
    d3.select(boundingBox)
    .attr('width', this.defaultWidth)
    .attr('height', this.defaultHeight)
    .append('polygon')
    .attr('class', 'boundingBoxHandle')
    .attr('transform', `translate(${this.defaultWidth - 5},${this.defaultHeight + 15})`)
    .attr('points', '5,0 5,5 0,5')

    return boundingBox
  }
}

module.exports = Elements
