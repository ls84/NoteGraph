class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: []
    }

    this.simulation = d3.forceSimulation()
    this.draw = this.draw.bind(this)
    this.handleClick = this.handleClick.bind(this)
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

  handleClick (event) {
    let globalX = event.clientX
    let globalY = event.clientY

    let nodes = this.state.nodes
    // let links = this.state.links

    if (nodes.length > 0) {
      nodes.push({name: 1, fx: globalX, fy: globalY})
      this.simulation.nodes(nodes)
      // links.push({source: nodes.length - 1, target: 0})
    }

    this.simulation = this.simulation.alpha(1).restart()
  }

  componentWillReceiveProps (nextProps) {
    function jsonShallowEqual (a, b) {
      let aKeys = Object.keys(a).sort()
      let bKeys = Object.keys(b).sort()
      if (aKeys.length !== bKeys.length) return false
      if (aKeys.reduce((p, c) => p + c, '') !== bKeys.reduce((p, c) => p + c, '')) return false
      return aKeys.every((v) => {
        return a[v] === b[v]
      })
    }

    if (jsonShallowEqual(this.props.data, nextProps.data)) return false

    let center = { x: 480, y: 270 }
    let nodes = [{key: 'test', fx: center.x, fy: center.y}]
    let links = []
    for (let key in nextProps.data) {
      let node = { key }
      if (typeof nextProps.data[key] !== 'object') node[key] = nextProps.data[key]
      if (typeof nextProps.data[key] === 'object') Object.assign(node, nextProps.data[key])

      nodes.push(node)
      links.push({source: 'test', target: key})
    }
    // console.log(nodes, links);

    this.simulation.nodes(nodes)
    this.simulation.force('charge', d3.forceManyBody())
    this.simulation.force('center', d3.forceCenter(center.x, center.y))
    this.simulation.force('link', d3.forceLink(links).id((n) => n.key).distance(100))

    this.simulation.on('tick', () => {
      this.setState({nodes, links})
    })
  }

  render () {
    return (
      <svg width='960px' height='540px' viewBox='0 0 960 540' onClick={this.handleClick}>
        {this.draw()}
      </svg>
    )
  }
}

module.exports = ForceGraph
