let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let NodeInteract = require('./NodeInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js')

let Node = require('./Node.js')
let Link = require('./Link.js')
let bindCache = require('./bindCache.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { iterator: 0, nodes: {} }

    this.Link = bindCache.call(this, Link)
    this.Node = Node // TODO: bindCache
    this.setGraphSize = this.setGraphSize.bind(this)
    this.setNodePath = this.setNodePath.bind(this)
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

  addDropNodeBehaviour () {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    DropArea.addEventListener('drop', (event) => {
      this.nodeInteract.hide()

      let position = this.cursorPoint(event)
      let node = this.newNode()
      node.data = this.props.gunData

      d3.select('#Canvas #zoomTransform').selectAll('.node')
      .data([node], (d) => d ? d.id : undefined)
      .attr('transform', `translate(${position[0]}, ${position[1]})`)
      .enter()
      .append(() => node.SVGElement(position))
      .call((s) => { this.newNodeContext(s) })

      this.updateCanvasCache(node.id, node)
    })
  }

  addCancelInputBehaviour () {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('click', (event) => {
      let NodeInteract = document.querySelector('div#NodeInteract')
      if (NodeInteract.classList.value === 'show') this.nodeInteract.hide()
    })
  }

  setNodePath (nodePath) {
    this.setState({nodePath})
    this.props.getGunData(nodePath)
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

  updateCanvasCache (key, data) {
    let cache = this.state.nodes
    cache[key] = data
    this.setState({nodes: cache})
  }

  render () {
    console.log('state:', this.state)
    return (
      <div>
        <div id="DropArea">
          <svg id='Canvas'><g id="zoomTransform"></g></svg>
        </div>
        <div id="Status"></div>
        <NodeInteract ref={(c) => { this.nodeInteract = c }} setNodePath={this.setNodePath} />
        <LinkInteract ref={(c) => { this.linkInteract = c }} />
      </div>
    )
  }
}

module.exports = SVGCanvas
