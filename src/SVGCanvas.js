let Interaction = require('./Interaction.js')

let Link = require('./Link.js')
let bindCache = require('./bindCache.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { iterator: 0 }

    this.Link = bindCache.call(this, Link)
    this.setGraphSize = this.setGraphSize.bind(this)
    this.interaction = new Interaction(this)
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

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    d3.select('svg').call(this.interaction.attachCanvas)
  }

  render () {
    console.log('state:', this.state)
    return (<svg></svg>)
  }
}

module.exports = SVGCanvas
