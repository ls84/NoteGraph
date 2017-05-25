class Link {
  constructor (id) {
    this.id = id
    this.predicate = ''

    this.controlBezier = this.controlBezier.bind(this)
  }

  resetHandle () {
    let tick = [(this.to[0] - this.from[0]) / 6, (this.to[1] - this.from[1]) / 6]
    this.controlFrom = [this.from[0] + tick[0], this.from[1] + tick[1]]
    this.controlTo = [this.to[0] - tick[0], this.to[1] - tick[1]]
  }

  edit (d, i, g) {
    console.log('edit')
    let handle = d3.select(`svg g.links#${this.id}`).select('g.bezierHandle')
    let display = handle.attr('display')
    if (display === 'none') handle.attr('display', 'block')
    if (display === 'block') handle.attr('display', 'none')
  }

  updatePredicate (predicate) {
    this.predicate = predicate
    this.updateText()
  }

  controlBezier (selection) {
    let dragBehaviour = d3.drag()

    dragBehaviour.on('drag', (d, i, g) => {
      let cursor = d3.mouse(document.querySelector('svg#Canvas #zoomTransform'))
      let handle = g[i].classList.value
      d[handle] = cursor

      d3.select(g[i]).attr('cx', cursor[0]).attr('cy', cursor[1])
      d3.select(`svg g.links#${this.id}`).select('path').attr('d', () => this.pathDescription())
    })

    selection.call(dragBehaviour)
  }

  path () {
    let path = document.createElementNS(d3.namespaces.svg, 'path')
    d3.select(path)
    .attr('class', 'path').attr('id', `path.${this.id}`)
    .attr('d', this.pathDescription())

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
    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'bezierHandle').attr('display', 'none')
    d3.select(group).append(() => this.handle('controlFrom', this.controlFrom))
    d3.select(group).append(() => this.handle('controlTo', this.controlTo))

    return group
  }

  text () {
    let text = document.createElementNS(d3.namespaces.svg, 'text')
    d3.select(text).attr('text-anchor', 'middle').attr('dy', '4px')
    let textPath = d3.select(text).append('textPath').attr('xlink:href', `#path.${this.id}`).attr('startOffset', '50%')
    textPath.append('tspan').attr('class', 'padding')
    textPath.append('tspan').attr('class', 'predicate').text(this.predicate)
    textPath.append('tspan').attr('class', 'padding')

    return text
  }

  SVGElement (origin) {
    if (origin) {
      this.from = origin
      this.to = origin
      this.resetHandle()
    }

    let group = document.createElementNS(d3.namespaces.svg, 'g')
    d3.select(group).attr('class', 'links').attr('id', this.id)
    .on('mousedown', () => { d3.event.stopPropagation() })

    d3.select(group).append(() => this.path())
    d3.select(group).append('rect').attr('class', 'textBackground')
    d3.select(group).append(() => this.text())
    d3.select(group).append(() => this.bezierHandle())

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
    d3.selectAll(`svg #${this.id} textPath .padding`).text(padding)
  }

  updateText () {
    let link = document.querySelector(`svg #${this.id}`)
    // skip when element is has not been added to DOM Tree
    if (!link) return false
    let text = link.querySelector('.predicate')
    d3.select(text).text(this.predicate)

    let path = link.querySelector('.path')
    let pathLength = path.getTotalLength()
    // let text = document.querySelector(`svg #${this.id} text`)
    // d3.select(text).style('fill', 'black')
    // d3.select(text).select('tspan').text('a')
    // let oneLetterLength = text.getComputedTextLength()
    let oneLetterLength = 7.80126953125
    let textLength = this.predicate.length * oneLetterLength
    if (pathLength + oneLetterLength * 2 > textLength) this.paddtext(textLength, pathLength, oneLetterLength)
  }

  pathDescription (waypoints, calculateHandle) {
    for (let key in waypoints) { this[key] = waypoints[key] }
    if (calculateHandle) this.resetHandle()
    let pathDescription = d3.path()
    pathDescription.moveTo(this.from[0], this.from[1])
    pathDescription.bezierCurveTo(this.controlFrom[0], this.controlFrom[1], this.controlTo[0], this.controlTo[1], this.to[0], this.to[1])

    this.updateText()

    return pathDescription.toString()
  }
}

module.exports = Link
