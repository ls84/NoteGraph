class Primitives {

  point (x, y) {
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

  circle (color) {
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle)
    .attr('r', '10')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    // .call(this.moveNode)
    // .on('mouseenter', (d, i, g) => { this.graph.targetNode = g[i].parentNode })
    // .on('mouseleave', () => { this.graph.targetNode = null })

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
