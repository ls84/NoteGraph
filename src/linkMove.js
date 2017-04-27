let textOrientation = require('./textOrientation.js')

function linkMove (link, path) {
  let description = d3.line()(path)
  let oritation = textOrientation(path[0], path[1])

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .attr('transform', `translate(${path[0][0]},${path[0][1]})`)

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('.path')
  .attr('transform', `translate(-${path[0][0]},-${path[0][1]})`)
  .attr('d', description)

  d3.select('#ForceGraph').selectAll('g.links')
  .data([link], (d) => d.relation)
  .select('foreignObject')
  .attr('transform', oritation.transform)
  .select('div')
  .attr('align', oritation.align)

  // TODO:
  // should cache it
}

module.exports = linkMove
