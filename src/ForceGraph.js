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

    this.simulation = d3.forceSimulation()
    this.draw = this.draw.bind(this)
    this.addLink = this.addLink.bind(this)
    this.previewLink = this.previewLink.bind(this)
  }

  addNode (center, path, data) {
    // console.log('addnode', data);
    let node = {path: path, fx: center.x, fy: center.y}
    let svg = d3.select('#ForceGraph')
    svg.selectAll('circle')
    .data([node], function (d) { return d.path })
    .attr('cx', center.x)
    .attr('cy', center.y)
    .enter()
    .append('circle')
    .attr('id', path)
    .attr('r', '10')
    .attr('fill', (data) ? 'red' : 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('cx', center.x)
    .attr('cy', center.y)
    // .on('mouseup', () => {console.log('mouseup');})
    // .on('mousedown', () => {console.log('mousedown');})

    let nodes = this.state.nodes.filter((v) => v.path !== path)
    nodes.push(node)
    this.setState({nodes})

    if (data) this.expandLinks(center, path, data)

    // TODO
    // this.setState({forces: {path: data})
    // TODO

    // if (!data) return console.log('add new');
    // return console.log('add node');
  }

  addLink (link) {
    link.link = `link-${this.linkIterator ++}`
    this.temporaryLink = link

    d3.select('#ForceGraph')
    .selectAll('line')
    .data([link], function (d) { return d.link })
    .enter()
    .append('line')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.5')
  }

  previewLink (link) {
    console.log(this.temporaryLink);
    this.temporaryLink.x2 = link.x2
    this.temporaryLink.y2 = link.y2

    d3.select('#ForceGraph')
    .selectAll('line')
    .data([this.temporaryLink], function (d) { return d.link })
    .attr('x1', function (d) { return d.x1 })
    .attr('y1', function (d) { return d.y1 })
    .attr('x2', function (d) { return d.x2 })
    .attr('y2', function (d) { return d.y2 })
  }

  addValue (center) {
    console.log('addValue', center);
    let node = {path: `value-${this.valueIterator ++}`, fx: center.x, fy: center.y}
    let group = d3.select('#ForceGraph')
    .selectAll('g')
    .data([node], function (d) { return d.path })
    .attr('transform', `translate(${center.x},${center.y})`)
    .enter()
    .append('g')
    .attr('transform', `translate(${center.x},${center.y})`)
    .attr('id', function (d) { return d.path })

    let dragBehaviour = d3.drag()
    // dragBehaviour.on('start', function (d) { console.log(this.parentNode); })
    let scope = this

    dragBehaviour.on('start', function (d) {
      let cursor = d3.mouse(document.querySelector('#ForceGraph'))
      let nodePosition = this.parentNode.getCTM()

      if (d3.event.sourceEvent.shiftKey) scope.addLink({x1: nodePosition.e, y1: nodePosition.f, x2: cursor[0], y2: cursor[1]})
    })

    dragBehaviour.on('drag', function (d) {
      if (!d3.event.sourceEvent.shiftKey) {
        let cursor = d3.mouse(document.querySelector('#ForceGraph'))
        d3.select(this.parentNode)
        .attr('transform', `translate(${cursor[0]},${cursor[1]})`)
      }

      if (d3.event.sourceEvent.shiftKey) {
        let cursor = d3.mouse(document.querySelector('#ForceGraph'))
        let nodePosition = this.parentNode.getCTM()
        scope.previewLink({x1: nodePosition.e, y1: nodePosition.f, x2: cursor[0], y2: cursor[1]})
      }
    })

    dragBehaviour.on('end', function () { console.log(this.parentNode); })

    group.append('circle')
    .attr('r', '10')
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.5')
    .call(dragBehaviour)

    group.append('foreignObject')
    .append('xhtml:body')
    .append('xhtml:p')
    .attr('contenteditable', 'true')
    .attr('class', 'ValueInput')
    .text('')
    .on('blur', () => {
      console.log('should update gun');
    })
  }

  expandLinks (center, path, data) {
    // console.log('expandLinks', path, data);
    // console.log(this.state);
    // let center = {x: this.state.nodes[path].fx, y: this.state.nodes[path].fy}
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

    // this.setState()

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

    // if (this.props.data === undefined && nextProps.data) return this.initGraph(nextProps.data, nextProps.center, 'test')
    // if (this.props.data && nextProps.data === undefined) return this.updateGraph(nextProps.props, 'test')
    // console.log(this.props.data, nextProps.data);
    // TODO:
    // if (jsonShallowEqual(this.props.data, nextProps.data)) return this.updateGraph(nextProps.props, 'test')
  }

  render () {
    return (
      <svg id="ForceGraph" width='960px' height='540px' viewBox='0 0 960 540'>
      </svg>
    )
  }
}

module.exports = ForceGraph
