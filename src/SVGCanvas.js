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

  appendNode (gunPath, position, displayLevel, cache) {
    let node = new this.Node(`node-${this.getRandomValue()}`, this)
    // node.data.position = position
    node.data.path = gunPath
    node.gun = this.props.gunData
    if (displayLevel) node.displayLevel(displayLevel)
    node.getValue((d, k) => {
      if (d) {
        let normalizedPath = node.normalizedPath
        let existNode = this.nodes.filter((v) => v.normalizedPath === normalizedPath)[0]
        if (!existNode) {
          // should have detachedValue cache first
          node.appendSelf()
          node.data.position = position
          let detachedKey = []
          if (cache) {
            if (Object.keys(cache.detachedValue).length > 0) {
              for (let dv in cache.detachedValue) {
                console.log('detachedValue:', cache.detachedValue[dv])
                let valueID = `value-${this.getRandomValue()}`
                let detachedValueData = node.bindActionToDetachedValueData(valueID)
                node.data.detachedValue[valueID] = detachedValueData

                node.data.detachedValue[valueID].position = cache.detachedValue[dv].position
                node.data.detachedValue[valueID].key = cache.detachedValue[dv].key
                node.data.detachedValue[valueID].value = cache.detachedValue[dv].value
                node.data.detachedValue[valueID].boundingBoxDimension = cache.detachedValue[dv].boundingBoxDimension

                detachedKey.push(cache.detachedValue[dv].key)
              }
            }
          }

          this.nodes.push(node)

          if (k.length === 0) return node.toggleDisplayLevel(1, true)
          // TODO: will have to compare with detachedValue

          let name = node.gun._.field
          node.displayNodeName(name)

          // Attached Value Updates here
          let key = k[0]
          node.updateAttachedValue(key, d[key])
          node.toggleDisplayLevel(2, false)
        }
        if (existNode) {
          console.log('duplicate nodes', existNode)
        }
      }
      if (!d) {
        // after gun.put will trigger gun.val inside getValue()
        this.props.putNewNode(gunPath)
        // node.initNode(gunPath, () => {
        //   let normalizedPath = node.normalizedPath
        //   console.log(normalizedPath)
        // })
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
    .on('dblclick.zoom', null)

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
      if (event.key === 'v') this.interaction.nodeValue(this.target)
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

    this.addInteractions()
    this.context = 'canvas'
  }

  saveCache () {
    console.log(JSON.stringify(this.state.cache, null, 2))
  }

  loadCache () {
    let cache = {
      'nodes': {
        'node-3739980629': {
          'detachedValue': {
            'value-932079070': {
              'position': [
                391,
                208
              ],
              'boundingBoxDimension': [
                84.234375,
                0
              ],
              'key': 'value is',
              'value': 'a is for apple\n'
            }
          },
          'path': 'a',
          'position': [
            473,
            123
          ]
        }
      },
      'links': {
        'link-3842448953': {
          'predicate': '',
          'from': [
            473,
            123
          ],
          'to': [
            391,
            208
          ],
          'controlFrom': [
            459.3333333333333,
            137.16666666666666
          ],
          'controlTo': [
            404.6666666666667,
            193.83333333333334
          ]
        }
      }
    }

    let NodeMapping = {}
    // let LinkMapping = {}

    for (let id in cache.nodes) {
      let nodeCache = cache.nodes[id]
      let position = nodeCache.position
      let path = nodeCache.path

      this.props.getGunData(path)
      let node = this.appendNode(path, position, 1, nodeCache)

      NodeMapping[id] = node
    }

    // for (let id in cache.links) {
    //   let data = cache.links[id]
    //   let link = new this.Link(this.getRandomValue(), this)
    //   Object.assign(link.data, data)
    //   link.data.fromNode = NodeMapping[data.fromNode]
    //   link.data.toNode = NodeMapping[data.toNode]
    //   link.appendSelf()
    //   .call((s) => { this.setContext(s, 'link') })
    //   link.updateText()

    //   LinkMapping[id] = link
    // }

    // for (let id in cache.nodes) {
    //   let fromLinks = cache.nodes[id].fromLink.map((v) => {
    //     return LinkMapping[v]
    //   })
    //   NodeMapping[id].links.from = fromLinks

    //   let toLinks = cache.nodes[id].toLink.map((v) => {
    //     return LinkMapping[v]
    //   })
    //   NodeMapping[id].links.to = toLinks
    // }
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
