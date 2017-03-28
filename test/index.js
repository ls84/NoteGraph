/* eslint-env mocha */
// https://webpack.github.io/docs/context.html#require-context
// let req = require.context('./', true, /\.js$/)

const Main = require('../src/Main.js') // eslint-disable-line no-unused-vars

describe('main.js', () => {
  it('should work', () => {
    let container = document.createElement('div')
    container.id = 'main'
    document.body.appendChild(container)

    ReactDOM.render(<Main />, container)
  })
})
