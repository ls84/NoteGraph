/* eslint-env mocha */
// https://webpack.github.io/docs/context.html#require-context
// let req = require.context('./', true, /\.js$/)

describe('main.js', () => {
  it('should work', () => {
    let container = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    container.setAttribute('width', '960px')
    container.setAttribute('height', '540px')
    container.setAttribute('viewbox', '0 0 960 540')
    container.setAttribute('oncontextmenu', 'return false;')

    container.id = 'main'
    document.body.appendChild(container)

    var svg = d3.select('svg')

    let nodes = [
      {name: 0},
      {name: 1},
      {name: 2},
      {name: 3},
      {name: 4},
      {name: 5}
    ]

    let links = [
      {'source': 1, 'target': 2},
      {'source': 3, 'target': 4},
      {'source': 5, 'target': 0}
    ]

    let simulation = d3.forceSimulation(nodes)

    simulation.force('center', d3.forceCenter(5, 5))
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink(links))
    .force('center', d3.forceCenter(480, 270))

    nodes.forEach((node) => {
      svg.append('circle')
      .attr('r', 5)
      .attr('fill', 'red')
      .attr('cx', 480)
      .attr('cy', 270)
    })

    simulation.on('tick', () => {
      let elements = document.querySelectorAll('svg circle')
      nodes.forEach((v, i) => {
        elements[i].setAttribute('cx', v.x)
        elements[i].setAttribute('cy', v.y)
      })
    })
  })
})
