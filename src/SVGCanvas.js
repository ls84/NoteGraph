let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let NodeInteract = require('./NodeInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js')

let Node = require('./Node.js')
let Link = require('./Link.js')
let bindCache = require('./bindCache.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { cache: { nodes: {}, links: {} } }

    // this.Link = bindCache.call(this, Link)
    this.Link = Link
    this.Node = bindCache.call(this, Node)
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
    node.data = this.props.gunData
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
    let cache = {"nodes":{"a":{"position":[365,285]},"b":{"position":[676,230]},"c":{"position":[549,390]},"d":{"position":[338,397]},"e":{"position":[793,492]},"test":{"position":[366,503]}},"links":{}}
    for (let id in cache.nodes) {
      let position = cache.nodes[id].position
      this.props.getGunData(id)
      this.appendNode(id, position)
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
