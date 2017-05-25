let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let NodeInteract = require('./NodeInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js')

let Node = require('./Node.js')
let Link = require('./Link.js')
let bindLinkToCache = require('./bindLinkToCache.js')
let bindNodeToCache = require('./bindNodeToCache.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { cache: { nodes: {}, links: {} } }

    this.Link = bindLinkToCache.call(this, Link)
    this.Node = bindNodeToCache.call(this, Node)
    this.setGraphSize = this.setGraphSize.bind(this)
  }

  setGraphSize () {
    let width = window.innerWidth - 16
    let height = window.innerHeight - 36

    document.documentElement.style.setProperty(`--windowHeight`, `${height}px`)
    document.documentElement.style.setProperty(`--windowWidth`, `${width}px`)

    let svg = document.querySelector('svg')
    svg.setAttribute('width', `${width}px`)
    svg.setAttribute('height', `${height}px`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return {width, height}
  }

  cursorPoint (event) {
    let svg = document.querySelector('svg#Canvas')
    let pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY

    let zoomTransform = document.querySelector('svg#Canvas #zoomTransform')
    pt = pt.matrixTransform(zoomTransform.getCTM().inverse())
    pt = pt.matrixTransform(svg.getScreenCTM().inverse())
    return [pt.x, pt.y]
  }

  addZoomBehaviour () {
    let canvas = document.querySelector('svg#Canvas')
    let zoom = d3.zoom()
    zoom.on('zoom', function () {
      d3.select(canvas).select('#zoomTransform')
      .attr('transform', d3.event.transform)
    })

    d3.select(canvas).call(zoom)
  }

  appendNode (id, position) {
    let node = this.newNode(id)
    node.gun = this.props.gunData
    d3.select('#Canvas #zoomTransform').selectAll('.node')
    .data([node], (d) => d ? d.id : undefined)
    .attr('transform', (d) => {
      d.updatePosition(position)
      return `translate(${d.position[0]}, ${d.position[1]})`
    })
    .enter()
    .append(() => node.SVGElement(position))
    .call((s) => { this.newNodeContext(s) })
  }

  addDropNodeBehaviour () {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    DropArea.addEventListener('drop', (event) => {
      this.nodeInteract.hide()

      let position = this.cursorPoint(event)
      this.appendNode(this.nodeInteract.state.nodePath, position)
    })
  }

  addCancelInputBehaviour () {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('click', (event) => {
      let NodeInteract = document.querySelector('div#NodeInteract')
      if (NodeInteract.classList.value === 'show') this.nodeInteract.hide()
    })
  }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    this.addZoomBehaviour()
    this.addDropNodeBehaviour()
    this.addCancelInputBehaviour()
    this.interaction = new Interaction(this)
  }

  showNodeInteract () {
    this.nodeInteract.show()
  }

  showLinkInteract (targetLink) {
    this.linkInteract.show(targetLink)
  }

  saveCache () {
    console.log(JSON.stringify(this.state.cache))
  }

  loadCache () {
    let cache = {"nodes":{"a":{"position":[503,180]},"b":{"position":[273,521]},"c":{"position":[748,509]}},"links":{"link-2":{"from":[503,180],"to":[273,521],"controlFrom":[465.5,233.83333333333334],"controlTo":[315.5,449.1666666666667],"fromNode":"a","toNode":"b"},"link-3":{"from":[273,521],"to":[748,509],"controlFrom":[352.1666666666667,519],"controlTo":[668.8333333333334,511],"fromNode":"b","toNode":"c"},"link-4":{"from":[748,509],"to":[503,180],"controlFrom":[707.1666666666666,454.1666666666667],"controlTo":[543.8333333333334,234.83333333333334],"fromNode":"c","toNode":"a"}}}
    for (let id in cache.nodes) {
      let position = cache.nodes[id].position
      this.props.getGunData(id)
      this.appendNode(id, position)
    }

    for (let id in cache.links) {
      let data = cache.links[id]
      let link = new this.Link(id)
      Object.assign(link, data)
      let linkDom = d3.select('svg#Canvas #zoomTransform').selectAll('g.links')
      .data([link], (d, i, g) => d.id).enter()
      .insert((d) => d.SVGElement(), ':first-child')
      .call((s) => {this.interaction.setContext(s, 'link')})
      link.updateText()
      // NOTE: propagate data to children
      linkDom.select('.controlFrom')
      linkDom.select('.controlTo')

      let fromNode = d3.select('svg#Canvas #zoomTransform').select(`g.node#${data.fromNode}`).datum()
      fromNode.addFromLink(link)
      let toNode = d3.select('svg#Canvas #zoomTransform').select(`g.node#${data.toNode}`).datum()
      toNode.addToLink(link)
    }
  }

  render () {
    console.log('state:', this.state)
    return (
      <div>
        <div id="DropArea">
          <svg id='Canvas'><g id="zoomTransform"></g></svg>
        </div>
        <div id="Status"></div>
        <NodeInteract ref={(c) => { this.nodeInteract = c }} getGunData={this.props.getGunData} />
        <LinkInteract ref={(c) => { this.linkInteract = c }} />
      </div>
    )
  }
}

module.exports = SVGCanvas
