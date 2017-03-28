class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: []
    }

    this.simulation = d3.forceSimulation()
    this.initNode = this.initNode.bind(this)
    this.draw = this.draw.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  initNode (data, path) {
    let center = { x: 480, y: 270 }
    let nodes = [{key: path, fx: center.x, fy: center.y}]
    let links = []
    for (let key in data) {
      let node = { key }
      if (typeof data[key] !== 'object') node[key] = data[key]
      if (typeof data[key] === 'object') Object.assign(node, data[key])

      nodes.push(node)
      links.push({source: path, target: key})
    }

    let svg = d3.select('svg')
    nodes.forEach((n) => {
      svg.append('circle')
      .attr('fill', 'red')
      .attr('r', '10')
      .attr('cx', center.x)
      .attr('cy', center.y)
    })

    links.forEach((l) => {
      svg.append('line')
      .attr('stroke', 'black')
      .attr('x1', center.x)
      .attr('y1', center.y)
      .attr('x2', center.x)
      .attr('y2', center.y)
    })

    this.simulation.nodes(nodes)
    this.simulation.force('charge', d3.forceManyBody())
    this.simulation.force('center', d3.forceCenter(center.x, center.y))
    this.simulation.force('link', d3.forceLink(links).id((n) => n.key).distance(100))

    this.simulation.on('tick', () => {
      this.setState({nodes, links})
    })
  }

  draw () {
    if (this.state.nodes.length === 0) return false
    console.log('draw', this.simulation.alpha());

    let svg = d3.select('svg')

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
    // TODO: broken
    // let globalX = event.clientX
    // let globalY = event.clientY
    //
    // let nodes = this.state.nodes
    // // let links = this.state.links
    // console.log('clicked', globalX, globalY);
    //
    // if (nodes.length > 0) {
    //   nodes.push({key: 'new', fx: globalX, fy: globalY})
    //   this.simulation.nodes(nodes)
    //   this.setState({nodes})
    //   // links.push({source: nodes.length - 1, target: 0})
    // }
    //
    // this.simulation = this.simulation.alpha(1).restart()
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
    // console.log(this.props.data);
    if (this.props.data === undefined && nextProps.data) return this.initNode(nextProps.data, 'test')
    // TODO:
    // if (jsonShallowEqual(this.props.data, nextProps.data)) return this.updateGraph(nextProps.props, 'test')

    // if (jsonShallowEqual(this.props.data, nextProps.data)) return false
    //
    // let center = { x: 480, y: 270 }
    // let nodes = [{key: 'test', fx: center.x, fy: center.y}]
    // let links = []
    // for (let key in nextProps.data) {
    //   let node = { key }
    //   if (typeof nextProps.data[key] !== 'object') node[key] = nextProps.data[key]
    //   if (typeof nextProps.data[key] === 'object') Object.assign(node, nextProps.data[key])
    //
    //   nodes.push(node)
    //   links.push({source: 'test', target: key})
    // }
    // // console.log(nodes, links);
    //
    // this.simulation.nodes(nodes)
    // this.simulation.force('charge', d3.forceManyBody())
    // this.simulation.force('center', d3.forceCenter(center.x, center.y))
    // this.simulation.force('link', d3.forceLink(links).id((n) => n.key).distance(100))
    //
    // // this.addNewNode()
    //
    // this.simulation.on('tick', () => {
    //   this.setState({nodes, links})
    // })
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
