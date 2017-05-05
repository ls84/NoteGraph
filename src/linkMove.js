let textOrientation = require('./textOrientation.js')
let textWidth = require('./textWidth.js')

function linkMove (link, path, handleAnchor) {
  let description = d3.line()(path)
  let oritation = textOrientation(path[0], path[1])

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .attr('transform', `translate(${path[0][0]},${path[0][1]})`)

  let pathElement = d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('.path')
  .attr('transform', `translate(${path[0][0] * -1},${path[0][1] * -1})`)
  .attr('d', description)

  let text = d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('foreignObject')
  .text()

  let labelWidth = textWidth(text, 'linkLabel')
  let labelOffset = Math.max(0, pathElement.node().getTotalLength() / 2 - labelWidth)
  let labelTranslate
  if (oritation.direction === 'port') labelTranslate = `${(labelWidth * -1) - 20 - labelOffset},-10`
  if (oritation.direction === 'starboard') labelTranslate = `${labelOffset},-10`

  let transform
  if (oritation.direction === 'port') transform = `rotate(${oritation.degree}) translate(${labelTranslate})`
  if (oritation.direction === 'starboard') transform = `rotate(${oritation.degree}) translate(${labelTranslate})`

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('foreignObject')
  .attr('width', labelWidth + 20) // account for margin
  .attr('transform', transform)
  .select('.linkLabelHandle')
  .style('float', () => {
    if (oritation.direction === 'port') return 'left'
    if (oritation.direction === 'starboard') return 'right'
  })
  .text(() => {
    if (oritation.direction === 'port') return '<'
    if (oritation.direction === 'starboard') return '>'
  })
  // TODO:
  // should cache it
}

module.exports = linkMove
