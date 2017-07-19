let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let NodeInteract = require('./NodeInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js') //eslint-disable-line no-unused-vars

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.conext = 'canvas'
    this.target = null
    this.targetNode = null

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

  // TODO: use d3.mouse instead
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

  measureText (text, style) {
    d3.select('svg#preRender').attr('class', style)
    let renderedText = d3.select('svg#preRender').append('text').text(text).node()
    
    let size = renderedText.getBBox()
    renderedText.remove()

    return size
  }

  getRandomValue () {
    let a = new Uint32Array(1)
    return window.crypto.getRandomValues(a)
  }

  appendNode (gunPath, position, displayLevel) {
    let node = new this.Node(`node-${this.getRandomValue()}`, this)
    node.data.position = position
    node.data.path = gunPath
    node.gun = this.props.gunData
    if (displayLevel) node.displayLevel(displayLevel)
    node.appendSelf()
    node._getValue((d, k) => {
      if (d) {
        if (k.length === 0) return node.toggleDisplayLevel(1, true)
        let key = k[0]
        node.updateAttachedValue(key, d[key])
        node.toggleDisplayLevel(2, false)
      }
      if (!d) {
        node._initNode(gunPath)
      }
    })

    return node
  }

  addInteractions () {
    let canvas = document.querySelector('svg#Canvas')
    let zoom = d3.zoom()
    zoom.on('zoom', function () {
      d3.select(canvas).select('#zoomTransform')
      .attr('transform', d3.event.transform)
    })

    d3.select(canvas).call(zoom)
    .on("dblclick.zoom", null)

    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    DropArea.addEventListener('drop', (event) => {
      this.nodeInteract.hide()

      let nodePath = this.nodeInteract.state.gunPath
      let position = this.cursorPoint(event)
      this.appendNode(nodePath, position, 1)
    })
    DropArea.addEventListener('click', (event) => {
      let NodeInteract = document.querySelector('div#NodeInteract')
      if (NodeInteract.classList.value === 'show') this.nodeInteract.hide()
    })
  }

  set context (value) {
    console.log('set context: ', value)
    if (value === 'canvas') this.applyCanvasContext()
    if (value === 'link') this.applyLinkContext()
    if (value === 'node') this.applyNodeContext()
    if (value === 'value') this.applyValueContext()
    return value
  }

  setContext (selection, context) {
    selection.on('mouseenter', (d) => {
      this.target = d
      this.context = context
      if (context === 'value') {
        this.valueDOM = selection.node().parentNode
        this.valuePath = this.valueDOM.querySelector('.valueLabel').innerHTML
      }
    })

    selection.on('mouseleave', () => {
      this.target = null
      this.context = 'canvas'
    })
  }

  applyCanvasContext (selection) {
    let commands = (event) => {
      if (event.key === 'n') this.nodeInteract.show()
      // if (event.key === 's') this.saveCache()
      // if (event.key === 'l') this.loadCache()
    }

    window.onkeyup = commands
  }

  applyNodeContext (selection) {
    let commands = (event) => {
      if (event.key === 'p') this.target.gun.val((data, key) => { console.log(data, key) })
      if (event.key === 's') this.target.toggleDisplayLevel()
      if (event.key === 'n') this.interaction.nodeName(this.target)
      if (event.key === 'v') this.interaction.nodeValue(this.target)
      if (event.key === 'Backspace') this.props.removeNode(this.target)
    }

    window.onkeyup = commands
  }

  applyValueContext (selection) {
    let commands = (event) => {
      if (event.key === 'Backspace') {
        this.target.gun.path(this.valuePath).put(null)
      }
    }

    window.onkeyup = commands
  }

  applyLinkContext (selection) {
    let commands = (event) => {
      if (event.key === 'c') this.target.edit()
      if (event.key === 'n') this.linkInteract.show(this.target)
    }

    window.onkeyup = commands
  }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    this.addInteractions()
    this.context = 'canvas'
  }

  saveCache () {
    console.log(JSON.stringify(this.state.cache))
  }

  loadCache () {
    // let cache = {"nodes":{"node-4210259129":{"fromLink":["link-1976719957"],"toLink":["link-3501817744"],"position":[451,158],"path":"a"},"node-3650578120":{"fromLink":["link-2478644371"],"toLink":["link-1976719957"],"position":[256,425],"path":"b"},"node-4053994535":{"fromLink":["link-3501817744"],"toLink":["link-2478644371"],"position":[638,426],"path":"c"}},"links":{"link-1976719957":{"predicate":"","from":[451,158],"to":[256,425],"controlFrom":[418.5,202.5],"controlTo":[288.5,380.5],"fromNode":"node-4210259129","toNode":"node-3650578120"},"link-2478644371":{"predicate":"","from":[256,425],"to":[638,426],"controlFrom":[322,531],"controlTo":[563,521],"fromNode":"node-3650578120","toNode":"node-4053994535"},"link-3501817744":{"predicate":"","from":[638,426],"to":[451,158],"controlFrom":[606.8333333333334,381.3333333333333],"controlTo":[482.1666666666667,202.66666666666666],"fromNode":"node-4053994535","toNode":"node-4210259129"}}}
    // let cache = {"nodes":{"node-2222167242":{"fromLink":[],"toLink":[],"position":[414,118],"path":"test"}},"links":{}}
    // let cache = {"nodes":{"node-1929895751":{"fromLink":[],"toLink":[],"position":[253,214],"path":"test","normalizedKey":"LppE0z1iME59sHwnbncBRz1e"}},"links":{}}

    let NodeMapping = {}
    let LinkMapping = {}

    for (let id in cache.nodes) {
      let position = cache.nodes[id].position
      let path = cache.nodes[id].path

      this.props.getGunData(path)
      let node = this.appendNode(path, position, 1)

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

      LinkMapping[id] = link
    }

    for (let id in cache.nodes) {
      let fromLinks = cache.nodes[id].fromLink.map((v) => {
        return LinkMapping[v]
      })
      NodeMapping[id].links.from = fromLinks

      let toLinks = cache.nodes[id].toLink.map((v) => {
        return LinkMapping[v]
      })
      NodeMapping[id].links.to = toLinks
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
        <svg id='preRender'></svg>
        <NodeInteract ref={(c) => { this.nodeInteract = c }} getGunData={this.props.getGunData} />
        <LinkInteract ref={(c) => { this.linkInteract = c }} />
        <Interaction ref={(c) => { this.interaction = c }} />
      </div>
    )
  }
}

module.exports = SVGCanvas
