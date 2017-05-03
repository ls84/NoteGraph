let ElementMaker = require('./ElementMaker.js')
// let textOrientation = require('./textOrientation.js')
let linkMove = require('./linkMove.js')

class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: {},
      links: {}
    }

    this.ElementMaker = new ElementMaker(this)
    this.relationIterator = 0

    this.simulation = d3.forceSimulation()
    this.setGraphSize = this.setGraphSize.bind(this)
    this.previewLink = this.previewLink.bind(this)
  }

  setGraphSize () {
    let width = window.innerWidth - 16
    let height = window.innerHeight - 70
    // NOTE: do i need this state?
    // this.setState({width, height})
    let svg = document.querySelector('#ForceGraph')
    svg.setAttribute('width', `${width}px`)
    svg.setAttribute('height', `${height}px`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    return {width, height}
  }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    let svg = d3.select('#ForceGraph')
    let transformGroup = svg.append('g')
    transformGroup.attr('id', 'transformGroup')

    let zoom = d3.zoom()
    .on('zoom', function () {
      d3.select('#ForceGraph #transformGroup')
      .attr('transform', d3.event.transform)
    })
    this.zoom = zoom
    svg.call(zoom)
  }

  addNode (center, path, data) {
    let transformGroup = document.querySelector('#ForceGraph #transformGroup')
    center = center.matrixTransform(transformGroup.getCTM().inverse())

    let node = {path: path}
    let svg = d3.select('#ForceGraph #transformGroup')
    let elements = svg.selectAll('g.nodes')
    .data([node], function (d) { return d.path })
    .attr('transform', `translate(${center.x},${center.y})`)
    .enter()
    .append(d => this.ElementMaker.Node(center, path, data))

    let cache = { nodes: this.state.nodes, links: this.state.links }
    cache.nodes[path] = data || {}
    cache.links[path] = { position: [center.x, center.y] }

    this.setState(cache)

    let t = d3.transition().duration(500).ease(d3.easePolyInOut)
    elements.select('.boundingBoxHandle').transition(t).attr('transform', 'translate(200,5)')
    elements.select('.nodeLabel').transition(t).attr('width', '185')
    elements.select('.boundingBox').transition(t).attr('width', '200')

    // if (data) this.expandLinks(center, path, data)

    // NOTE: this.state should act as cache for gun
    // let nodes = this.state.nodes.filter((v) => v.path !== path)
    // nodes.push(node)
    // this.setState({nodes})
  }

  previewLink (link) {
    if (this.targetNode) Object.assign(link, { x2: this.targetNode.getCTM().e, y2: this.targetNode.getCTM().f })

    let transformGroup = document.querySelector('#ForceGraph #transformGroup')
    let pt = this.ElementMaker.point(link.x1, link.y1)
    pt = pt.matrixTransform(transformGroup.getCTM().inverse())
    let from = [pt.x, pt.y]
    pt = this.ElementMaker.point(link.x2, link.y2)
    pt = pt.matrixTransform(transformGroup.getCTM().inverse())
    let to = [pt.x, pt.y]
    d3.select('#ForceGraph #transformGroup')
    .selectAll('g.links')
    .data([link], (d) => d.relation)
    .enter()
    .insert((d) => this.ElementMaker.Link(from, to, d.relation), ':first-child')

    linkMove(link, [from, to])
  }

  establishLink (link, from, to) {
    d3.select('#ForceGraph #transformGroup')
    .selectAll('g.links')
    .data([{relation: link}], (d) => d.relation)
    .datum(function (d) { return {relation: `${from}->${to}`} })
    .attr('id', `${from}->${to}`)

    let cache = this.state.links
    let linkName = `${from}->${to}`
    let linkPath = [cache[from].position, cache[to].position]

    if (cache[from]['from']) cache[from]['from'][linkName] = linkPath
    if (cache[to]['to']) cache[to]['to'][linkName] = linkPath

    if (!cache[from]['from']) cache[from] = Object.assign(cache[from], {'from': {[linkName]: linkPath}})
    if (!cache[to]['to']) cache[to] = Object.assign(cache[to], {'to': {[linkName]: linkPath}})

    this.setState({links: cache})
  }

  removeLink (link) {
    d3.select('#ForceGraph #transformGroup')
    .selectAll('g.links')
    .data([{relation: link}], (d) => d.relation)
    .remove()
  }

  // expandLinks (center, path, data) {
  //   let nodes = [{path: path, fx: center.x, fy: center.y}]
  //   let links = []
  //   let nodeCache = this.state.nodes
  //   let linkCache = this.state.links
  //   let values = {}
  //
  //   for (let key in data) {
  //     if (typeof data[key] !== 'object') {
  //       values[key] = data[key]
  //     }
  //
  //     if (typeof data[key] === 'object') {
  //       let node = { path: `${path}.${key}` }
  //       Object.assign(node, data[key])
  //       nodes.push(node)
  //       links.push({source: path, target: `${path}.${key}`})
  //       nodeCache[`${path}.${key}`] = {}
  //       if (!linkCache[path]) linkCache[path] = {}
  //       if (linkCache[path].from) linkCache[path].from.push(`${path}->${key}->${path}.${key}`)
  //       if (!linkCache[path].from) linkCache[path].from = [`${path}->${key}->${path}.${key}`]
  //
  //       if (!linkCache[`${path}.${key}`]) linkCache[`${path}.${key}`] = {}
  //       if (linkCache[`${path}.${key}`].to) linkCache[`${path}.${key}`].to.push(`${path}->${key}->${path}.${key}`)
  //       if (!linkCache[`${path}.${key}`].to) linkCache[`${path}.${key}`].to = [`${path}->${key}->${path}.${key}`]
  //     }
  //   }
  //
  //   let svg = d3.select('#ForceGraph')
  //
  //   svg.selectAll('g')
  //   .data(nodes, function (d) { return d ? d.path : this.id })
  //   .enter()
  //   .append((d) => {
  //     return ElementMakers.Node.call(this, center, d)
  //   })
  //
  //   this.setState({nodes: nodeCache, links: linkCache})
  //
  //   // this.props.displayValues(path, values)
  //   // TODO: set links state
  //
  //   this.simulation.nodes(nodes)
  //   this.simulation.force('link', d3.forceLink(links).id((n) => n.path).distance(100))
  //   this.simulation.force('charge', d3.forceManyBody())
  //   this.simulation.force('center', d3.forceCenter(center.x, center.y))
  //
  //   this.simulation.alpha(1).restart()
  //
  //   this.simulation.on('tick', () => {
  //     // console.log(this.simulation.alpha);
  //     svg.selectAll('g')
  //     .data(nodes, function (d) { return d ? d.path : this.id })
  //     .attr('transform', (n) => `translate(${n.x},${n.y})`)
  //
  //     // svg.selectAll('line')
  //     // .data(links)
  //     // .attr('x1', (l) => l.source.x)
  //     // .attr('y1', (l) => l.source.y)
  //     // .attr('x2', (l) => l.target.x)
  //     // .attr('y2', (l) => l.target.y)
  //   })
  //   // console.log(nodes, links);
  // }

  render () {
    console.log('state:', this.state)
    return (
      <svg id="ForceGraph">
      </svg>
    )
  }
}

module.exports = ForceGraph
