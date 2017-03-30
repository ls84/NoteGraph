class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
      center: { x: 480, y: 270 }
    }

    this.simulation = d3.forceSimulation()
    this.initGraph = this.initGraph.bind(this)
    this.draw = this.draw.bind(this)
  }

  addNodes (node, center) {
    // console.log(document.querySelector('#ForceGraph'));
    let svg = d3.select('#ForceGraph')
    svg.selectAll('circle')
    .data(node)
    .enter()
    .append('circle')
    .attr('r', '10')
    .attr('fill', 'red')
    .attr('cx', center.x)
    .attr('cy', center.y)
    // .on('mouseup', () => {console.log('mouseup');})
    // .on('mousedown', () => {console.log('mousedown');})

    return this.state.nodes.concat(node)
  }

  addLinks (link, center) {
    let svg = d3.select('#ForceGraph')
    svg.selectAll('line')
    .data(link)
    .enter()
    .append('line')
    .attr('stroke', 'black')
    .attr('x1', center.x)
    .attr('y1', center.y)
    .attr('x2', center.x)
    .attr('y2', center.y)

    return this.state.nodes.concat(link)
  }

  initGraph (data, center, path) {
    let nodes = [{key: path, fx: center.x, fy: center.y}]
    let links = []
    for (let key in data) {
      let node = { key }
      if (typeof data[key] !== 'object') node[key] = data[key]
      if (typeof data[key] === 'object') Object.assign(node, data[key])

      nodes.push(node)
      links.push({source: path, target: key})
    }

    this.addNodes(nodes, center)
    this.addLinks(links, center)

    this.setState({nodes, links, center})
  }

  draw () {
    let nodes = this.state.nodes
    let links = this.state.links
    let center = this.state.center
    let svg = d3.select('#ForceGraph')

    this.simulation.nodes(nodes)
    this.simulation.force('link', d3.forceLink(links).id((n) => n.key).distance(100))
    this.simulation.force('charge', d3.forceManyBody())
    this.simulation.force('center', d3.forceCenter(center.x, center.y))

    this.simulation.alpha(1).restart()

    this.simulation.on('tick', () => {
      // console.log('tick', this.simulation.alpha());
      svg.selectAll('circle')
      .data(nodes)
      .attr('cx', (n) => n.x)
      .attr('cy', (n) => n.y)

      svg.selectAll('line')
      .data(links)
      .attr('x1', (l) => l.source.x)
      .attr('y1', (l) => l.source.y)
      .attr('x2', (l) => l.target.x)
      .attr('y2', (l) => l.target.y)
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
    // function jsonShallowEqual (a, b) {
    //   let aKeys = Object.keys(a).sort()
    //   let bKeys = Object.keys(b).sort()
    //   if (aKeys.length !== bKeys.length) return false
    //   if (aKeys.reduce((p, c) => p + c, '') !== bKeys.reduce((p, c) => p + c, '')) return false
    //   return aKeys.every((v) => {
    //     return a[v] === b[v]
    //   })
    // }

    if (this.props.data === undefined && nextProps.data) return this.initGraph(nextProps.data, nextProps.center, 'test')
    // TODO:
    // if (jsonShallowEqual(this.props.data, nextProps.data)) return this.updateGraph(nextProps.props, 'test')
  }

  render () {
    return (
      <svg id="ForceGraph" width='960px' height='540px' viewBox='0 0 960 540'>
        {this.draw()}
      </svg>
    )
  }
}

module.exports = ForceGraph
