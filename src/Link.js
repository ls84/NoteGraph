let bindLinkToCanvasCache = require('./bindLinkToCanvasCache.js')

class Link {
  constructor (id, canvas) {
    this.canvas = canvas
    this.data = new Proxy({}, bindLinkToCanvasCache(canvas))
    this.data.id = id
    this.data.predicate = ''

    this.controlBezier = this.controlBezier.bind(this)
  }

  resetHandle () {
    let from = this.data.from
    let to = this.data.to

    let tick = [(to[0] - from[0]) / 6, (to[1] - from[1]) / 6]
    this.data.controlFrom = [from[0] + tick[0], from[1] + tick[1]]
    this.data.controlTo = [to[0] - tick[0], to[1] - tick[1]]
  }

  edit (d, i, g) {
    let handle = d3.select(this.DOM).select('g.bezierHandle')
    let display = handle.attr('display')
    if (display === 'none') handle.attr('display', 'block')
    if (display === 'block') handle.attr('display', 'none')
  }

  updatePredicate (predicate) {
    if (!this.data.predicate && predicate !== '') this.canvas.props.connectNode(this.fromNode.data.path, predicate, this.toNode.data.path)
    this.data.predicate = predicate
    // TODO: should update gun when predicate is updated and not empty
    this.updateText()
  }

  controlBezier (selection) {
    let dragBehaviour = d3.drag()

    dragBehaviour.on('drag', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg#Canvas #zoomTransform'))
      let handle = g[i].classList.value
      this.data[handle] = cursor

      d3.select(g[i]).attr('cx', cursor[0]).attr('cy', cursor[1])
      d3.select(this.DOM).select('.path').attr('d', () => this.pathDescription())
    })

    selection.call(dragBehaviour)
  }

  path (simple) {
    let path = document.createElementNS(d3.namespaces.svg, 'path')
    d3.select(path)
    .attr('class', 'path').attr('id', `path.${this.data.id}`)
    .attr('d', this.pathDescription())

    if (simple) d3.select(path).attr('class', 'path simple')

    return path
  }

  handle (className, position) {
    let circle = document.createElementNS(d3.namespaces.svg, 'circle')
    d3.select(circle).attr('class', className)
    .attr('cx', position[0]).attr('cy', position[1])
    .attr('r', 5)
    .call(this.controlBezier)

    return circle
  }

  bezierHandle () {
    let controlFrom = this.data.controlFrom
    let controlTo = this.data.controlTo

    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'bezierHandle').attr('display', 'none')
    d3.select(group).append(() => this.handle('controlFrom', controlFrom))
    d3.select(group).append(() => this.handle('controlTo', controlTo))

    return group
  }

  text () {
    let text = document.createElementNS(d3.namespaces.svg, 'text')
    d3.select(text).attr('text-anchor', 'middle').attr('dy', '4px')
    let textPath = d3.select(text).append('textPath').attr('xlink:href', `#path.${this.data.id}`).attr('startOffset', '50%')
    textPath.append('tspan').attr('class', 'padding')
    textPath.append('tspan').attr('class', 'predicate').text(this.predicate)
    textPath.append('tspan').attr('class', 'padding')

    return text
  }

  SVGElement (simple) {
    let id = this.data.id
    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'links').attr('id', id)
    .on('mousedown', () => { d3.event.stopPropagation() })

    d3.select(group).append(() => this.path(simple))
    if (!simple) d3.select(group).append('rect').attr('class', 'textBackground')
    if (!simple) d3.select(group).append(() => this.text())
    if (!simple) d3.select(group).append(() => this.bezierHandle())

    return group
  }

  paddtext (textLength, pathLength, oneLetterLength) {
    let differences = pathLength - textLength
    let oneUnitLength = oneLetterLength * 3
    let count = (differences - (differences % oneUnitLength)) / oneUnitLength
    let oneSide = ((count % 2) === 0) ? count / 2 : (count - 1) / 2
    let padding = ''
    for (let i = 0; i < oneSide; i++) {
      padding = ' > ' + padding + ' > '
    }
    d3.select(this.DOM).selectAll('textPath .padding').text(padding)
  }

  updateText () {
    // let link = document.querySelector(`svg #${this.id}`)
    // skip when element is has not been added to DOM Tree
    let predicate = this.data.predicate

    let text = this.DOM.querySelector('.predicate')
    d3.select(text).text(predicate)

    let path = this.DOM.querySelector('.path')
    let pathLength = path.getTotalLength()
    // let text = document.querySelector(`svg #${this.id} text`)
    // d3.select(text).style('fill', 'black')
    // d3.select(text).select('tspan').text('a')
    // let oneLetterLength = text.getComputedTextLength()
    let oneLetterLength = 7.80126953125
    let textLength = predicate.length * oneLetterLength
    if (pathLength + oneLetterLength * 2 > textLength) this.paddtext(textLength, pathLength, oneLetterLength)
  }

  pathDescription (calculateHandle) {
    if (calculateHandle) this.resetHandle()

    let from = this.data.from
    let to = this.data.to
    let controlFrom = this.data.controlFrom
    let controlTo = this.data.controlTo

    let pathDescription = d3.path()
    pathDescription.moveTo(from[0], from[1])
    pathDescription.bezierCurveTo(controlFrom[0], controlFrom[1], controlTo[0], controlTo[1], to[0], to[1])

    return pathDescription.toString()
  }

  appendSelf (simple) {
    let DOM = d3.select('svg#Canvas #zoomTransform').selectAll('g.links')
    .data([this], (d) => d ? d.data.id : undefined).enter()
    .insert(() => this.SVGElement(simple), ':first-child')
    .node()

    this.DOM = DOM
    this.updateText()
    return d3.select(DOM)
  }

  drawLinkTo (position) {
    this.data.to = position
    let link = d3.select(this.DOM)
    link.select('.path').attr('d', this.pathDescription(true))
    this.updateText()
    link.select('.controlFrom').attr('cx', this.data.controlFrom[0]).attr('cy', this.data.controlFrom[1])
    link.select('.controlTo').attr('cx', this.data.controlTo[0]).attr('cy', this.data.controlTo[1])
  }
}

module.exports = Link
