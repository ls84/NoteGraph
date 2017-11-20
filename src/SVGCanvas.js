let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let NodeInteract = require('./NodeInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js') // eslint-disable-line no-unused-vars

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.conext = 'canvas'
    this.target = null
    this.targetNode = null

    this.state = { cache: { nodes: {}, links: {} } }
    this.nodes = []

    this.Node = require('./Node.js')
    this.Link = require('./Link.js')
    this.setGraphSize = this.setGraphSize.bind(this)
    this.parseCache = this.parseCache.bind(this)
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

    let cacheLoader = document.querySelector('.cacheLoader')
    cacheLoader.querySelector('textarea').style.width = `${width}px`
    cacheLoader.querySelector('textarea').style.height = `${height - 10}px`

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

  appendNode (gunPath, position, cache, id) {
    return new Promise((resolve, reject) => {
      let node = new this.Node(id || `node-${this.getRandomValue()}`, gunPath, this)
      node.appendSelf()
      node.data.position = position
      if (cache && Object.keys(cache.associatedValue).length > 0) {
        for (let id in cache.associatedValue) {
          let cacheData = cache.associatedValue[id]
          // TODO: check this value inside value instance
          if (node.gunCache.cache[cacheData.key]) node.data.associatedValue[id] = cacheData
        }
      }

      this.nodes.push(node)
      resolve()
    })
  }

  addInteractions () {
    let canvas = document.querySelector('svg#Canvas')
    let zoom = d3.zoom()
    zoom.on('zoom', function () {
      d3.select(canvas).select('#zoomTransform')
      .attr('transform', d3.event.transform)
    })

    d3.select(canvas).call(zoom)
    .on('dblclick.zoom', null)

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
    if (value === 'attachedValue') this.applyAttachedValueContext()
    return value
  }

  setContext (selection, context) {
    selection.on('mouseenter', (d) => {
      this.target = d
      this.context = context
      if (context === 'value' || context === 'attachedValue') {
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
      if (event.key === 's') this.saveCache()
      if (event.key === 'l') this.loadCache()
    }

    window.onkeyup = commands
  }

  applyNodeContext (selection) {
    let commands = (event) => {
      if (event.key === 'p') this.target.gun.val((data, key) => { console.log(data, key) })
      if (event.key === 's') this.target.toggleDisplayLevel()
      if (event.key === 'n') this.interaction.nodeName(this.target)
      if (event.key === 'a') this.interaction.nodeValue(this.target)
      if (event.key === 'v') this.target.toggleKeys()
      if (event.key === 'Backspace') this.props.removeNode(this.target, event.shiftKey)
    }

    window.onkeyup = commands
  }

  applyValueContext (selection) {
    let commands = (event) => {
      if (event.key === 'Backspace') {
        let valueID = this.valueDOM.id
        let link = this.target.links.detachedValue.filter((l) => l.toValue === valueID)[0]
        this.valueDOM.remove()
        link.DOM.remove()
        if (event.shiftKey) this.target.gun.path(this.valuePath).put(null)
      }
    }

    window.onkeyup = commands
  }

  applyAttachedValueContext (selection) {
    let commands = (event) => {
      // if (event.key === 'ArrowRight')
      // if (event.key === 'ArrowLeft')
    }

    window.onkeyup = commands
  }

  applyLinkContext (selection) {
    let commands = (event) => {
      if (event.key === 'c') this.target.edit()
      if (event.key === 'n') this.linkInteract.show(this.target)
      if (event.key === 'Backspace') this.props.removeLink(this.target, event.shiftKey)
    }

    window.onkeyup = commands
  }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    document.querySelector('.cacheLoader textarea').addEventListener('keyup', (event) => {
      event.stopPropagation()
    })

    this.addInteractions()
    this.context = 'canvas'
  }

  saveCache () {
    window.open().document.write('<pre>' + JSON.stringify(this.state.cache, null, 2) + '</pre>')
  }

  loadCache () {
    document.querySelector('.cacheLoader').classList.toggle('show')
  }

  parseCache () {
    let cache = document.querySelector('.cacheLoader textarea').value
    try {
      let bluePrint = JSON.parse(cache)
      let appends = []
      for (let id in bluePrint.nodes) {
        let nodeCache = bluePrint.nodes[id]
        let position = nodeCache.position
        let path = nodeCache.path

        this.props.getGunData(path)
        appends.push(this.appendNode(path, position, nodeCache, id))
      }

      Promise.all([appends]).then(() => {
        for (let id in bluePrint.links) {
          let linkID = `link-${this.getRandomValue()}`
          let link = new this.Link(linkID, this)
          link.data.bluePrint = true
          link.data.id = linkID
          let bluePrintData = bluePrint.links[id]
          Object.assign(link.data, {from: bluePrintData.from, controlFrom: bluePrintData.controlFrom, to: bluePrintData.to, controlTo: bluePrintData.controlTo, predicate: bluePrintData.predicate})
          link.appendSelf()
          .call((s) => this.setContext(s, 'link'))

          let fromNode = this.nodes.find((v) => v.data.id === bluePrintData.fromNode)
          let toNode = this.nodes.find((v) => v.data.id === bluePrintData.toNode)
          fromNode.links.from[toNode.data.id] = link
          toNode.links.to[fromNode.data.id] = link
          link.fromNode = fromNode
          link.data.fromNode = fromNode.data.id
          link.toNode = toNode
          link.data.toNode = toNode.data.id
        }
      })
      document.querySelector('.cacheLoader').classList.toggle('show')
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (
      <div>
        <div id="DropArea">
          <svg id='Canvas'><g id="zoomTransform"></g></svg>
        </div>
        <div id="Status"></div>
        <svg id='preRender'></svg>
        <div className="cacheLoader">
          <textarea></textarea>
          <button onClick={this.parseCache}>Load</button>
          <button onClick={() => document.querySelector('.cacheLoader').classList.toggle('show')}>Cancel</button>
        </div>
        <NodeInteract ref={(c) => { this.nodeInteract = c }} getGunData={this.props.getGunData} />
        <LinkInteract ref={(c) => { this.linkInteract = c }} />
        <Interaction ref={(c) => { this.interaction = c }} />
      </div>
    )
  }
}

module.exports = SVGCanvas
