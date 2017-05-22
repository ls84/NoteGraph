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
    this.canvas.newNode = () => {
      let node = new this.canvas.Node(this.canvas.state.nodePath)
      node.mouseOnTarget = () => { return this.targetNode }
      return node
    }
    this.canvas.newNodeContext = (selection) => { this.setContext(selection, 'node') }

    let commands = (event) => {
      if (event.key === 'n') this.canvas.showNodeInteract()
    }

    window.onkeyup = commands
  }

  nodeInteract () {
    this.target.newLink = (event) => new this.canvas.Link('link-test')
    this.target.newLinkContext = (selection) => { this.setContext(selection, 'link') }
    this.target.setThisAsTarget = () => { this.targetNode = this.target }
    this.target.clearThisAsTarget = () => { this.targetNode = null }
  }

  linkInteract (selection) {
    let commands = (event) => {
      if (event.key === 'c') this.target.edit()
      if (event.key === 'n') this.canvas.showLinkInteract(this.target)
    }

    window.onkeyup = commands
  }

  set context (value) {
    console.log('set context: ', value)
    if (value === 'canvas') this.canvasInteract()
    if (value === 'link') this.linkInteract()
    if (value === 'node') this.nodeInteract()
    return value
  }

}

module.exports = Interaction
