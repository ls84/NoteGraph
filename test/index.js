/* eslint-env mocha */
// https://webpack.github.io/docs/context.html#require-context
// let req = require.context('./', true, /\.js$/)

const ForceGraph = require('../src/ForceGraph.js') // eslint-disable-line no-unused-vars

describe('main.js', () => {
  it('should work', () => {
    let container = document.createElement('div')
    container.id = 'main'
    document.body.appendChild(container)

    const nodes = [
      {name: 0},
      {name: 1},
      {name: 2},
      {name: 3},
      {name: 4},
      {name: 5}
    ]

    const links = [
      {'source': 1, 'target': 2},
      {'source': 3, 'target': 4},
      {'source': 5, 'target': 0}
    ]

    ReactDOM.render(<ForceGraph nodes={nodes} links={links} />, container)
  })
})
