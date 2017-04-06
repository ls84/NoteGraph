let DragBehaviour = require('./DragBehaviour.js')

function NewNode (center, path, data) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .append('circle')
  .attr('id', path)
  .attr('r', '10')
  .attr('fill', (data) ? 'red' : 'white')
  .attr('stroke', 'black')
  .attr('stroke-width', 0.5)

  return group
}

function EmptyValue (center, data) {
  let group = document.createElementNS(d3.namespaces.svg, 'g')

  d3.select(group)
  .attr('transform', `translate(${center.x},${center.y})`)
  .attr('id', data.path)
  .append('circle')
  .attr('r', '10')
  .attr('fill', 'white')
  .attr('stroke', 'black')
  .attr('stroke-width', '0.5')

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

module.exports = { NewNode, EmptyValue }
