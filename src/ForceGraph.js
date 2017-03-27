class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: []
    }

    this.draw = this.draw.bind(this)
  }

  draw () {
    // if (!this.state.nodes) return
    let nodes = this.state.nodes.map((n) => {
      return (
        <circle key={'node' + n.index} cx={n.x} cy={n.y} fill="red" r="10" />
      )
    })

    let links = this.state.links.map((l) => {
      let source = l.source
      let target = l.target
      return (
        <line key={'link' + l.index} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke='black' />
      )
    })

    return nodes.concat(links)
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
