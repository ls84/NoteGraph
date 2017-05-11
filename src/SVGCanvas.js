let Link = require('./Link.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
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

  // TODO: drawPath (from, to, [controlFrom, controlTo])
  // return pathDescription

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))
      let linkData = ['test']
      d3.select('svg').selectAll('g.links')
      .data(linkData)
      .enter()
      .append(() => Link(cursor, cursor))

      this.setState({from: cursor})
    })
    dragBehaviour.on('drag', (d, i, g) => {
      let pathDescription = d3.path()
      let from = this.state.from
      let to = d3.mouse(document.querySelector('svg'))
      let tick = [(to[0] - from[0]) / 6, (to[1] - from[1]) / 6]
      let controlFrom = [from[0] + tick[0], from[1] + tick[1]]
      let controlTo = [to[0] - tick[0], to[1] - tick[1]]
      pathDescription.moveTo(from[0], from[1])
      pathDescription.bezierCurveTo(controlFrom[0], controlFrom[1], controlTo[0], controlTo[1], to[0], to[1])

      console.log(pathDescription.toString())
      let linkData = ['test']
      let link = d3.select('svg').selectAll('g.links').data(linkData)

      link.select('path').attr('d', pathDescription.toString())
      link.select('circle.controlFrom').attr('cx', controlFrom[0]).attr('cy', controlFrom[1])
      link.select('circle.controlTo').attr('cx', controlTo[0]).attr('cy', controlTo[1])
    })

    d3.select('svg').call(dragBehaviour)
  }

  render () {
    console.log('state:', this.state)
    return (<svg></svg>)
  }
}

module.exports = SVGCanvas
