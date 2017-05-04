let textOrientation = require('./textOrientation.js')
let textWidth = require('./textWidth.js')

function linkMove (link, path) {
  let description = d3.line()(path)
  let oritation = textOrientation(path[0], path[1])

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .attr('transform', `translate(${path[0][0]},${path[0][1]})`)

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('.path')
  .attr('transform', `translate(${path[0][0] * -1},${path[0][1] * -1})`)
  .attr('d', description)

  let text = d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('foreignObject')
  .text()
  let labelWidth = textWidth(text, 'linkLabel')
  console.log(labelWidth)

  let transform
  if (oritation.direction === 'port') transform = `rotate(${oritation.degree}) translate(${(labelWidth * -1) - 20},0)`
  if (oritation.direction === 'starboard') transform = `rotate(${oritation.degree}) translate(20,0)`

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('foreignObject')
  .attr('transform', transform)
  .select('div')

  // TODO:
  // should cache it
}

module.exports = linkMove
