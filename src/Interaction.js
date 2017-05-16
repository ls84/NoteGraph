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

  setContext (selection, context, target) {
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
    this.canvas.addDropNodeBehaviour((id) => new this.canvas.Node(id), 
    (s, t) => { this.setContext(s, 'node', t) })
      
    // let dragBehaviour = d3.drag()
    // dragBehaviour.on('start', (d, i, g) => {
    //   let cursor = d3.mouse(document.querySelector('svg#Canvas'))
    //   let link = new this.c.Link(`test-${++this.c.state.iterator}`)
    //   d3.select('svg#Canvas').selectAll('g.links')
    //   .data([link], (d, i, g) => d.id).enter()
    //   .append((d) => d.SVGElement(cursor))
    //   .call((s) => { this.setContext(s, 'link') })
    // })
    // dragBehaviour.on('drag', (d, i, g) => {
    //   let cursor = d3.mouse(document.querySelector('svg#Canvas'))
    //   console.log('still drags')
    //   let link = d3.selectAll('svg#Canvas g.links').filter((d, i, g) => (d.id === `test-${this.c.state.iterator}`))
    //   link.select('.path').attr('d', (d) => d.pathDescription({to: cursor}, true))
    //   link.select('.controlFrom').attr('cx', (d) => d.controlFrom[0]).attr('cy', (d) => d.controlFrom[1])
    //   link.select('.controlTo').attr('cx', (d) => d.controlTo[0]).attr('cy', (d) => d.controlTo[1])
    // })

    // this.canvas.call(dragBehaviour)
    let commands = (event) => {
      if (event.key === 'n') this.canvas.showNodeInteract()
    }

    window.onkeyup = commands
  }

  nodeInteract () {
    console.log(this.target)
    // this.target.startLink = (cursor) => {console.log(cursor)}
  }

  linkInteract (selection) {
    // this.canvas.on('.drag', null)
    let commands = (event) => {
      if (event.key === 'c') this.target.edit()
      if (event.key === 'n') this.c.showLinkInteract(this.target)
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
