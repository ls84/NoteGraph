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
    // if (this.simulation) console.log('draw', this.simulation.alpha());
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
    let nodes = this.props.nodes || []
    let links = this.props.links || []

    this.simulation = d3.forceSimulation(nodes)

    this.simulation.force('charge', d3.forceManyBody())
    // this.simulation.force('center')
    // this.simulation.force('center', d3.forceCenter(480, 270))
    // .force('charge', d3.forceManyBody())
    // .force('link', d3.forceLink(links))

    this.simulation.on('tick', () => {
      this.setState({nodes, links})
    })

    document.onmousedown = () => {
      let nodes = this.state.nodes
      let links = this.state.links
      // if (nodes.length > 0) nodes.push({name: 1}), links.push({source: 0, target: 1})

      if (nodes.length > 0) {
        nodes.push({name: 1})
        this.simulation.nodes(nodes)
        links.push({source: nodes.length - 1, target: 0})
        this.simulation.force('link', d3.forceLink(links))
      }

      if (nodes.length === 0) {
        nodes.push({name: 0, fx: 480, fy: 270})
        this.simulation.nodes(nodes)
        this.simulation.force('center', d3.forceCenter(480, 270))
      }

      this.simulation = this.simulation.alpha(1).restart()
    }
  }

  render () {
    return (
      <svg width='960px' height='540px' viewBox='0 0 960 540'>
        {this.draw()}
      </svg>
    )
  }
}

module.exports = ForceGraph
