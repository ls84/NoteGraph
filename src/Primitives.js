class Primitives {
  point (x, y) {
    // NOTE: depends on the svg element
    let pt = document.querySelector('#ForceGraph').createSVGPoint()
    pt.x = x
    pt.y = y
    return pt
  }

  group (className, idName) {
    let group = document.createElementNS(d3.namespaces.svg, 'g')
    if (className) d3.select(group).attr('class', className)
    if (idName) d3.select(group).attr('id', idName)

    return group
  }

  div (className, text, contentEditable) {
    let div = document.createElement('div')
    if (className) d3.select(div).attr('class', className)
    if (text) d3.select(div).text(text)
    if (contentEditable) d3.select(div).attr('contenteditable', 'true')

    return div
  }

  circle (styleSelector) {
    let style = {
      'nodeValueAnchor': {
        'r': '5',
        'stroke': 'black',
        'stroke-width': '0.5',
        'fill': 'white'
      }
    }
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle)
    .attr('r', '10')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)

    for (let attr in style[styleSelector]) {
      d3.select(circle).attr(attr, style[styleSelector][attr])
    }

    return circle
  }

  valueGroup (label, content) {
    let valuegroup = this.div('valueGroup')
    d3.select(valuegroup).append(() => this.div('valueLabel', label, true))
    d3.select(valuegroup).append(() => this.div('value', content, true))

    return valuegroup
  }
}

module.exports = Primitives
