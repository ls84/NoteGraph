class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}

    this.draw = this.draw.bind(this)
  }

  draw () {
    if (!this.state.nodes) return
    return this.state.nodes.map((n) => {
      return (
        <circle cx={n.x} cy={n.y} key={n.index} fill="red" r="10" />
      )
    })
  }

  componentDidMount () {
    let nodes = this.props.nodes
    let links = this.props.links

    this.simulation = d3.forceSimulation(nodes)

    this.simulation.force('center', d3.forceCenter(5, 5))
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink(links))
    .force('center', d3.forceCenter(480, 270))

    this.simulation.on('tick', () => {
      this.setState({nodes, links})
    })
  }

  render () {
    return (
      <div>
        <svg width='960px' height='540px' viewBox='0 0 960 540'>
          {this.draw()}
        </svg>
      </div>
    )
  }
}

module.exports = ForceGraph
