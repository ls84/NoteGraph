let Link = require('./Link.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { iterator: 0 }
  }

  setGraphSize () {
    let width = window.innerWidth - 16
    let height = window.innerHeight - 36
    let svg = document.querySelector('svg')
    this.setState({width, height})
    svg.setAttribute('width', `${width}px`)
    svg.setAttribute('height', `${height}px`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return {width, height}
  }
  // TODO:
  // cacheLink (id, path) {
  //   let cache = {
  //     from: path.from,
  //     to: path.to,
  //     controlFrom: path.controlFrom,
  //     controlTo: path.controlTo
  //   }
  // }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))

      let link = new Link(`test-${++this.state.iterator}`)
      d3.select('svg').selectAll('g.links')
      .data([link], (d, i, g) => d.id)
      .enter()
      .append((d) => d.SVGElement(cursor))
    })
    dragBehaviour.on('drag', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))
      console.log(cursor, this.state.iterator)
      d3.selectAll('svg g.links').filter((d, i, g) => (d.id === `test-${this.state.iterator}`))
      .select('path').attr('d', (d) => d.pathDescription({to: cursor}, true))
    })

    d3.select('svg').call(dragBehaviour)
  }

  render () {
    console.log('state:', this.state)
    return (<svg></svg>)
  }
}

module.exports = SVGCanvas
