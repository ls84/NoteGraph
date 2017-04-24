let DragBehaviour = require('./DragBehaviour.js')

function Node (center, path, data) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .attr('class', 'nodes')
  .attr('id', path)

  d3.select(group).append('circle')
  .attr('r', '10')
  .attr('fill', data ? 'red' : 'lightgrey')
  .attr('stroke', 'black')
  .attr('stroke-width', 0.5)
  .call(DragBehaviour.call(this))
  .on('click', function () { console.log(this);})
  .on('mouseenter', function () { scope.targetNode = this.parentNode })
  .on('mouseleave', function () { scope.targetNode = null })

  d3.select(group).append('foreignObject')
  .attr('class', 'pathLabel')
  .attr('transform', 'translate(20,-13)')
  .attr('width', '200px')
  .append('xhtml:span')
  .attr('contenteditable', 'true')
  .text(path)
  .on('mousedown', function () { this.focus() })

  function valueGroup (label, content) {
    function onSelect () {
      d3.select('#ForceGraph')
      .on('.zoom', null)
      this.focus()
    }
    function onBlur () {
      d3.select('#ForceGraph')
      .call(scope.zoom)
      // TODO: update gun
    }

    let valuegroup = document.createElement('div')
    d3.select(valuegroup)
    .attr('class', 'valueGroup')

    d3.select(valuegroup).append('xhtml:div')
    .attr('class', 'valueLabel')
    .attr('contenteditable', 'true')
    .text(label)
    .on('mousedown', onSelect)
    .on('blur', onBlur)
    .on('keydown', function () {
      if (d3.event.key === 'Enter') {
        d3.event.preventDefault()
        this.parentNode.querySelector('.value').focus()
      }
    })

    d3.select(valuegroup).append('xhtml:div')
    .attr('class', 'value')
    .attr('contenteditable', 'true')
    .text(content)
    .on('mousedown', onSelect)
    .on('blur', onBlur)

    return valuegroup
  }

  let nodeValues = document.createElementNS(d3.namespaces.svg, 'foreignObject')

  d3.select(nodeValues)
  .attr('class', 'nodeValues')
  .attr('transform', 'translate(0,20)')
  .attr('width', '200px')
  .attr('height', '200px')

  d3.select(nodeValues).append('xhtml:div')
  .attr('class', 'moreValue')
  .text('+')
  .on('click', () => {
    let emptyValueGroup = valueGroup('', '')
    d3.select(nodeValues)
    .insert(() => emptyValueGroup, '.valueGroup:nth-child(2)')

    emptyValueGroup.querySelector('.valueLabel').focus()
  })

  for (let key in data) {
    if (typeof data[key] !== 'object') d3.select(nodeValues).append(() => valueGroup(key, data[key]))
  }

  d3.select(group).append(() => nodeValues)

  let boundingBox = d3.select(group).append('g')
  .attr('class', 'boundingBox')

  boundingBox.append('rect')
  .attr('width', '200')
  .attr('height', '200')

  let dragResize = d3.drag()
  dragResize.on('drag', () => {
    let width = Math.max(0, parseFloat(boundingBox.select('rect').attr('width')) + d3.event.dx)
    let height = Math.max(20, parseFloat(boundingBox.select('rect').attr('height')) + d3.event.dy)
    boundingBox.select('rect').attr('width', width).attr('height', height)
    d3.select(nodeValues).attr('width', width).attr('height', `${height - 20}`)
    let handleX = Math.max(0, width - 5)
    let handleY = Math.max(0, height - 5)
    boundingBox.select('polygon').attr('transform', `translate(${handleX},${handleY})`)
  })

  boundingBox.append('polygon')
  .attr('transform', 'translate(195,195)')
  .attr('points', '5,0 5,5 0,5')
  .call(dragResize)

  return group
}

function Link (relation, from, to) {
  function direction (observer, vector) {
    let svg = document.querySelector('#ForceGraph')
    let M = svg.createSVGMatrix()
    M = M.flipY()
    M = M.translate(-observer.x, -observer.y)

    let P = svg.createSVGPoint()
    P.x = vector.x
    P.y = vector.y
    P = P.matrixTransform(M)
    let angle = Math.atan2(P.y, P.x)
    let sign = Math.sign(angle)
    let degree = Math.abs(Math.round(360 * angle / (Math.PI * 2)))
    let direction
    if ((sign && degree <= 90) || (!sign && degree <= 90)) direction = 'starboard'
    if ((!sign && degree > 90) || (sign && degree > 90)) direction = 'port'

    return direction
  }

  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  let curve = d3.line()
  let description = curve([from, to])

  d3.select(group)
  .attr('id', relation)
  .attr('class', 'link')
  .attr('transform', `translate(${from[0]},${from[1]})`)

  d3.select(group)
  .append('path')
  .attr('transform', `translate(-${from[0]},-${from[1]})`)
  .attr('class', 'link')
  .attr('stroke', 'black')
  .style('stroke-dasharray', ('3,3'))
  .style('stroke-width', '2')
  .attr('d', description)
  .on('click', function () {
    // TODO:
    // add new path point
  })

  let textOrientation = Math.atan2(0, 1)
  let target = Math.atan2(to[1] - from[1], to[0] - from[0])
  var sign = target > textOrientation ? 1 : -1
  var angle = target - textOrientation
  var K = -sign * Math.PI * 2
  angle = (Math.abs(K + angle) < Math.abs(angle)) ? K + angle : angle
  let degree = Math.abs(Math.round(360 * angle / (Math.PI * 2))) * sign

  let side = direction({x: from[0], y: from[1]}, {x: to[0], y: to[1]})
  let transform = `rotate(${degree}) translate(20, 0)`
  let float = 'left'
  if (side === 'port') transform = `rotate(${degree - 180}) translate(-220, 0)`
  if (side === 'port') float = 'right'

  d3.select(group)
  .append('foreignObject')
  .attr('width', '200')
  .attr('transform', transform)
  .append('xhtml:span')
  .attr('class', 'predicate')
  .attr('contenteditable', 'true')
  .style('float', float)
  .text('predicate')
  .on('blur', function () {
    let nodes = this.parentNode.parentNode.id.split('->')
    if (nodes.length === 2) nodes.splice(1, 0, this.textContent)
    if (nodes.length === 3) nodes[1] = this.textContent

    function findLink (v) {
      return v === this.parentNode.parentNode.id
    }
    let originalAt
    let cache = {
      [nodes[0]]: scope.state.links[nodes[0]],
      [nodes[2]]: scope.state.links[nodes[2]]
    }

    originalAt = cache[nodes[0]].from.findIndex(findLink.bind(this))
    cache[nodes[0]].from.splice(originalAt, 1, nodes.join('->'))
    originalAt = cache[nodes[2]].to.findIndex(findLink.bind(this))
    cache[nodes[2]].to.splice(originalAt, 1, nodes.join('->'))

    this.parentNode.parentNode.id = nodes.join('->')

    scope.setState({links: Object.assign(scope.state.links, cache)})
  })
  .on('mousedown', function () {
    this.focus()
  })

  return group
}

module.exports = { Node, Link }
