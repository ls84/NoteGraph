class Primitives {
  group (className, idName) {
    let group = document.createElementNS(d3.namespaces.svg, 'g')
    if (className) d3.select(group).attr('class', className)
    if (idName) d3.select(group).attr('id', idName)

    return group
  }

  circle (styleSelector) {
    // TODO: need this, why not css
    let style = {
      'nodeValueAnchor': {
        'r': '5',
        'stroke': 'black',
        'stroke-width': '0.5',
        'fill': 'white'
      },
      'nodeAnchor': {
        'r': '25',
        'stroke': 'white',
        'fill': 'whiteSmoke',
        'stroke-width': '10px'
      },
      'valueAnchorBackground': {
        'stroke': 'white',
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
}

module.exports = Primitives
