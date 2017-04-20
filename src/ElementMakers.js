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
  .on('mouseenter', function () { scope.targetNode = this.parentNode })
  .on('mouseleave', function () { scope.targetNode = null })

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
