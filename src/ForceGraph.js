let ElementMakers = require('./ElementMakers.js')

class ForceGraph extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodes: [],
      links: [],
      center: { x: 480, y: 270 }
    }

    this.valueIterator = 0
    this.linkIterator = 0
    this.dragBehaviour = require('./DragBehaviour.js')(this)

    this.simulation = d3.forceSimulation()
    this.addLink = this.addLink.bind(this)
    this.previewLink = this.previewLink.bind(this)
  }

  addNode (center, path, data) {
    let scope = this
    let node = {path: path, fx: center.x, fy: center.y}
    let svg = d3.select('#ForceGraph')
    svg.selectAll('g')
    .data([node], function (d) { return d.path })
    .attr('transform', `translate(${center.x},${center.y})`)
    .enter()
    .append(function () { return ElementMakers.NewNode(center, path, data) })
    .select('circle')
    .call(this.dragBehaviour)
    .on('mouseenter', function () { scope.targetNode = this.parentNode })
    .on('mouseleave', function () { scope.targetNode = null })

    if (data) this.expandLinks(center, path, data)

    // NOTE: this.state should act as cache for gun
    let nodes = this.state.nodes.filter((v) => v.path !== path)
    nodes.push(node)
    this.setState({nodes})
  }

  addLink (link) {
    link.link = `link-${this.linkIterator ++}`
    this.temporaryLink = link

    d3.select('#ForceGraph')
    .selectAll('line')
    .data([link], function (d) { return d.link })
    .enter()
    .insert('line', ':first-child')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.5')
  }

  previewLink (link) {
    this.temporaryLink.x2 = (this.targetNode) ? this.targetNode.getCTM().e : link.x2
    this.temporaryLink.y2 = (this.targetNode) ? this.targetNode.getCTM().f : link.y2

    d3.select('#ForceGraph')
    .selectAll('line')
    .data([this.temporaryLink], function (d) { return d.link })
    .attr('x1', function (d) { return d.x1 })
    .attr('y1', function (d) { return d.y1 })
    .attr('x2', function (d) { return d.x2 })
    .attr('y2', function (d) { return d.y2 })
  }

  removeLink (link) {
    d3.select('#ForceGraph')
    .selectAll('line')
    .data([link], function (d) { return d.link })
    .remove()
  }

  addValue (center) {
    let node = {path: `value-${this.valueIterator ++}`, fx: center.x, fy: center.y}
    let group = d3.select('#ForceGraph')
    .selectAll('g')
    .data([node], function (d) { return d.path })
    .attr('transform', `translate(${center.x},${center.y})`)
    .enter()
    .append('g')
    .attr('transform', `translate(${center.x},${center.y})`)
    .attr('id', function (d) { return d.path })

    let scope = this

    group.append('circle')
    .attr('r', '10')
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.5')
    .call(this.dragBehaviour)
    .on('mouseenter', function () { scope.targetNode = this.parentNode })
    .on('mouseleave', function () { scope.targetNode = null })

    group.append('foreignObject')
    .append('xhtml:p')
    .attr('contenteditable', 'true')
    .attr('class', 'ValueInput')
    .text('')
    .on('blur', () => {
      console.log('should update gun');
    })
  }

  expandLinks (center, path, data) {
    let nodes = [{path: path, fx: center.x, fy: center.y}]
    let links = []
    for (let key in data) {
      let node = { path: `${path}.${key}` }
      if (typeof data[key] !== 'object') node[path] = `${path}.${data[key]}`
      if (typeof data[key] === 'object') Object.assign(node, data[key])

      nodes.push(node)
      links.push({source: path, target: `${path}.${key}`})
    }

    let svg = d3.select('#ForceGraph')

    svg.selectAll('circle')
    .data(nodes, function (d) { return d ? d.path : this.id })
    .enter()
    .append('circle')
    .attr('id', function (d) { return d.path })
    .attr('r', '10')
    .attr('fill', 'red')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('cx', center.x)
    .attr('cy', center.y)

    this.simulation.nodes(nodes)
    this.simulation.force('link', d3.forceLink(links).id((n) => n.path).distance(100))
    this.simulation.force('charge', d3.forceManyBody())
    this.simulation.force('center', d3.forceCenter(center.x, center.y))

    this.simulation.alpha(1).restart()

    this.simulation.on('tick', () => {
      svg.selectAll('circle')
      .data(nodes, function (d) { return d ? d.path : this.id })
      .attr('cx', (n) => n.x)
      .attr('cy', (n) => n.y)

      // svg.selectAll('line')
      // .data(links)
      // .attr('x1', (l) => l.source.x)
      // .attr('y1', (l) => l.source.y)
      // .attr('x2', (l) => l.target.x)
      // .attr('y2', (l) => l.target.y)
    })
    // console.log(nodes, links);
  }

  // draw () {
  //   let nodes = this.state.nodes
  //   let links = this.state.links
  //   let center = this.state.center
  //   let svg = d3.select('#ForceGraph')
  //
  //   this.simulation.nodes(nodes)
  //   this.simulation.force('link', d3.forceLink(links).id((n) => n.key).distance(100))
  //   this.simulation.force('charge', d3.forceManyBody())
  //   this.simulation.force('center', d3.forceCenter(center.x, center.y))
  //
  //   this.simulation.alpha(1).restart()
  //
  //   this.simulation.on('tick', () => {
  //     // console.log('tick', this.simulation.alpha());
  //     svg.selectAll('circle')
  //     .data(nodes)
  //     .attr('cx', (n) => n.x)
  //     .attr('cy', (n) => n.y)
  //
  //     svg.selectAll('line')
  //     .data(links)
  //     .attr('x1', (l) => l.source.x)
  //     .attr('y1', (l) => l.source.y)
  //     .attr('x2', (l) => l.target.x)
  //     .attr('y2', (l) => l.target.y)
  //   })
  // }

  render () {
    return (
      <svg id="ForceGraph" width='960px' height='540px' viewBox='0 0 960 540'>
      </svg>
    )
  }
}

module.exports = ForceGraph
