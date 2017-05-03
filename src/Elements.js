let Primitives = require('./Primitives.js')

class Elements extends Primitives {
  constructor (graph) {
    super()
    this.defaultWidth = 0
    this.defaultHeight = 0
  }

  nodeLabel (path) {
    let nodeLabel = document.createElementNS(d3.namespaces.svg, 'foreignObject')
    d3.select(nodeLabel)
    .attr('class', 'nodeLabel')
    .attr('transform', 'translate(20,-13)')
    .attr('width', this.defaultWidth).attr('height', '24px')
    .append(() => this.div('label', path, true))

    return nodeLabel
  }

  nodeValues (data) {
    let nodeValues = document.createElementNS(d3.namespaces.svg, 'foreignObject')
    d3.select(nodeValues)
    .attr('class', 'nodeValues')
    .attr('transform', 'translate(0,20)')
    .attr('width', this.defaultWidth)
    .attr('height', this.defaultHeight)

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
    .attr('transform', 'translate(5,5)')
    .attr('points', '5,0 5,5 0,5')

    return boundingBox
  }

  linkPath (from, to) {
    let curve = d3.line()
    let description = curve([from, to])

    let path = document.createElementNS(d3.namespaces.svg, 'path')
    d3.select(path)
    .attr('transform', `translate(-${from[0]},-${from[1]})`)
    .attr('class', 'path')
    .attr('d', description)
    // .on('click', function () {
    //   // TODO:
    //   // add new path point
    // })

    return path
  }

  linkLabel () {
    let label = document.createElementNS(d3.namespaces.svg, 'foreignObject')
    d3.select(label)
    .attr('width', '200')
    .append(() => this.div('linkLabel', 'predicate', true))

    return label
  }
}

module.exports = Elements
