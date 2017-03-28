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
    // console.log(d3.select('svg').selectAll('circle').size())
    let svg = d3.select('svg')

    if (svg.selectAll('circle').size() === 0) {
      this.state.nodes.forEach((n) => {
        svg.append('circle')
        .attr('fill', 'red')
        .attr('r', '10')
        .attr('cx', n.x)
        .attr('cy', n.y)
      })

      this.state.links.forEach((l) => {
        svg.append('line')
        .attr('stroke', 'black')
        .attr('x1', l.source.x)
        .attr('y1', l.source.y)
        .attr('x2', l.target.x)
        .attr('y2', l.target.y)
      })

      return
    }

    let nodes = svg.selectAll('circle').nodes()

    nodes.forEach((n, i) => {
      d3.select(n).attr('cx', this.state.nodes[i].x)
      d3.select(n).attr('cy', this.state.nodes[i].y)
    })

    let links = svg.selectAll('line').nodes()

    links.forEach((l, i) => {
      d3.select(l)
      .attr('x1', this.state.links[i].source.x)
      .attr('y1', this.state.links[i].source.y)
      .attr('x2', this.state.links[i].target.x)
      .attr('y2', this.state.links[i].target.y)
    })
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
