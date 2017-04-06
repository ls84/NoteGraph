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

module.exports = { NewNode }
