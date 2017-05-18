class Interaction {
  constructor (canvas) {
    this.canvas = canvas
    this.context = 'canvas'
    this.target = null

    this.attachCanvas = this.attachCanvas.bind(this)
    this.canvasInteract = this.canvasInteract.bind(this)
    this.nodeInteract = this.nodeInteract.bind(this)
    this.setContext = this.setContext.bind(this)
  }

  attachCanvas (canvas) {
    this.canvas = canvas
    this.context = 'canvas'
  }

  setContext (selection, context) {
    selection.on('mouseenter', (d) => {
      this.target = d
      this.context = context
    })

    selection.on('mouseleave', () => {
      this.target = null
      this.context = 'canvas'
    })
  }

  canvasInteract (selection) {
    this.canvas.addZoomBehaviour()
    this.canvas.addDropNodeBehaviour((id) => new this.canvas.Node(id), (s) => { this.setContext(s, 'node') })

    let commands = (event) => {
      if (event.key === 'n') this.canvas.showNodeInteract()
    }

    window.onkeyup = commands
  }

  nodeInteract () {
    this.target.newLink = (event) => new this.canvas.Link('link-test')
    this.target.newLinkContext = (selection) => { this.setContext(selection, 'link') }
  }

  linkInteract (selection) {
    let commands = (event) => {
      if (event.key === 'c') this.target.edit()
      if (event.key === 'n') this.canvas.showLinkInteract(this.target)
    }

    window.onkeyup = commands
  }

  set context (value) {
    if (value === 'canvas') this.canvasInteract()
    if (value === 'link') this.linkInteract()
    if (value === 'node') this.nodeInteract()
    return value
  }

}

module.exports = Interaction
