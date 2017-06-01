let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let NodeInteract = require('./NodeInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { cache: { nodes: {}, links: {} } }

    this.Node = require('./Node.js')
    this.Link = require('./Link.js')
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

  appendNode (gunPath, position) {
    let node = this.newNode()
    node.data.position = position
    node.mouseOnTarget = () => { return this.interaction.targetNode }
    node.data.path = gunPath
    node.gun = this.props.gunData
    node.appendSelf()
    .call((s) => {this.interaction.setContext(s, 'node')})

    return node
  }

  addDropNodeBehaviour () {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    DropArea.addEventListener('drop', (event) => {
      this.nodeInteract.hide()

      let nodePath = this.nodeInteract.state.gunPath
      let position = this.cursorPoint(event)
      this.appendNode(nodePath, position)
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

  getRandomValue () {
    let a = new Uint32Array(1)
    return window.crypto.getRandomValues(a)
  }

  saveCache () {
    console.log(JSON.stringify(this.state.cache))
  }

  loadCache () {
    let cache = {"nodes":{"node-2358568056":{"position":[462,238],"path":"a"},"node-2395031451":{"position":[296,477],"path":"b"},"node-2154447669":{"position":[629,480],"path":"c"}},"links":{"link-1496855771":{"predicate":"","from":[462,238],"to":[296,477],"controlFrom":[361,211],"controlTo":[203,312],"fromNode":"node-2358568056","toNode":"node-2395031451"},"link-2636264888":{"predicate":"","from":[296,477],"to":[629,480],"controlFrom":[350,596],"controlTo":[555,596],"fromNode":"node-2395031451","toNode":"node-2154447669"},"link-1134414514":{"predicate":"","from":[629,480],"to":[462,238],"controlFrom":[707,389],"controlTo":[561,215],"fromNode":"node-2154447669","toNode":"node-2358568056"}}}
    let NodeMapping = {}
    for (let id in cache.nodes) {
      let position = cache.nodes[id].position
      let path = cache.nodes[id].path

      this.props.getGunData(path)
      let node = this.appendNode(path, position)

      NodeMapping[id] = node
    }

    for (let id in cache.links) {
      let data = cache.links[id]
      let link = new this.Link(this.getRandomValue(), this)
      Object.assign(link.data, data)
      link.data.fromNode = NodeMapping[data.fromNode]
      link.data.toNode = NodeMapping[data.toNode]
      link.appendSelf()
      .call((s) => { this.interaction.setContext(s, 'link') })
      link.updateText()
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
