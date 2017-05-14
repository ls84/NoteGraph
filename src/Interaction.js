class Interaction {
  constructor (c) {
    this.c = c

    this.attachCanvas = this.attachCanvas.bind(this)
    this.canvasInteract = this.canvasInteract.bind(this)
    this.setContext = this.setContext.bind(this)
  }

  attachCanvas (canvas) {
    this.canvas = canvas
    this.context = 'canvas'
  }

  setContext (selection, context) {
    selection.on('mouseenter', (d) => {
      this.context = context
      this.target = d
    })
    selection.on('mouseleave', () => { this.context = 'canvas' })
  }

  canvasInteract (selection) {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))
      let link = new this.c.Link(`test-${++this.c.state.iterator}`)
      d3.select('svg').selectAll('g.links')
      .data([link], (d, i, g) => d.id).enter()
      .append((d) => d.SVGElement(cursor))
      .call((s) => { this.setContext(s, 'link') })
    })

    dragBehaviour.on('drag', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg'))
      console.log('still drags')
      let link = d3.selectAll('svg g.links').filter((d, i, g) => (d.id === `test-${this.c.state.iterator}`))
      link.select('.path').attr('d', (d) => d.pathDescription({to: cursor}, true))
      link.select('.controlFrom').attr('cx', (d) => d.controlFrom[0]).attr('cy', (d) => d.controlFrom[1])
      link.select('.controlTo').attr('cx', (d) => d.controlTo[0]).attr('cy', (d) => d.controlTo[1])
    })

    this.canvas.call(dragBehaviour)

    window.onkeyup = null
  }

  linkInteract (selection) {
    // this.canvas.on('.drag', null)
    let commands = (event) => {
      if (event.key === 'c') this.target.edit()
    }

    window.onkeyup = commands
  }

  set context (value) {
    console.log('set context: ', value)
    if (value === 'canvas') this.canvasInteract()
    if (value === 'link') this.linkInteract()
    return value
  }

}

module.exports = Interaction
