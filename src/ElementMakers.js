let DragBehaviour = require('./DragBehaviour.js')

function NewNode (center, path) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .append('circle')
  .attr('id', path)
  .attr('r', '10')
  .attr('fill', 'lightgrey')
  .attr('stroke', 'black')
  .attr('stroke-width', 0.5)
  .call(DragBehaviour.call(this))
  .on('mouseenter', function () { scope.targetNode = this.parentNode })
  .on('mouseleave', function () { scope.targetNode = null })

  return group
}

function EmptyValue (center, path) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .attr('id', path)
  .append('circle')
  .attr('r', '10')
  .attr('fill', 'white')
  .attr('stroke', 'black')
  .attr('stroke-width', '0.5')
  .call(DragBehaviour.call(this))
  .on('mouseenter', function () { scope.targetNode = this.parentNode })
  .on('mouseleave', function () { scope.targetNode = null })

  d3.select(group)
  .append('foreignObject')
  .append('xhtml:p')
  .attr('contenteditable', 'true')
  .attr('class', 'ValueInput')
  .text('')
  .on('blur', () => {
    console.log('should update gun');
  })

  return group
}

function Node (center, data) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .append('circle')
  .attr('id', data.path)
  .attr('r', '10')
  .attr('fill', 'red')
  .attr('stroke', 'black')
  .attr('stroke-width', 0.5)
  .call(DragBehaviour.call(this))
  .on('mouseenter', function () { scope.targetNode = this.parentNode })
  .on('mouseleave', function () { scope.targetNode = null })

  return group
}

function Value (center, data) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .attr('id', data.path)
  .append('circle')
  .attr('r', '10')
  .attr('fill', 'white')
  .attr('stroke', 'black')
  .attr('stroke-width', '0.5')
  .call(DragBehaviour.call(this))
  .on('mouseenter', function () { scope.targetNode = this.parentNode })
  .on('mouseleave', function () { scope.targetNode = null })

  d3.select(group)
  .append('foreignObject')
  .append('xhtml:p')
  .attr('contenteditable', 'true')
  .attr('class', 'ValueInput')
  .text('')
  .on('blur', () => {
    console.log('should update gun');
  })

  return group
}

function Link (relation, from, to) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')
  let scope = this

  let curve = d3.line()
  let description = curve([from, to])

  d3.select(group)
  .attr('id', relation)
  .append('path')
  .attr('stroke', 'black')
  .attr('stroke-width', '0.5')
  .attr('d', description)

  return group
}

module.exports = { NewNode, EmptyValue, Node, Value, Link }
