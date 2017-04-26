let Elements = require('./Elements.js')
let textOrientation = require('./textOrientation.js')

class ElementMaker extends Elements {
  constructor (graph) {
    super()
    this.graph = graph
    this.nodeMove = this.nodeMove.bind(this)
    this.nodeResize = this.nodeResize.bind(this)
    this.nodeTarget = this.nodeTarget.bind(this)
    this.editCotent = this.editCotent.bind(this)
    this.returnOnNewLine = this.returnOnNewLine.bind(this)
    this.addValue = this.addValue.bind(this)
  }

  nodeMove (selection) {
    let dragBehaviour = d3.drag()

    dragBehaviour.on('drag', (d, i, g) => {
      let sourceEvent = d3.event.sourceEvent
      if (!sourceEvent.shiftKey) {
        let cursor = d3.mouse(document.querySelector('#ForceGraph'))
        let transformGroup = document.querySelector('#ForceGraph #transformGroup')
        let pt = this.point(cursor[0], cursor[1])
        pt = pt.matrixTransform(transformGroup.getCTM().inverse())
        d3.select(g[i].parentNode)
        .attr('transform', `translate(${pt.x},${pt.y})`)
        // TODO: drag links along
      }

      if (sourceEvent.shiftKey) {
        let relation = `relation-${this.graph.relationIterator}`
        let origin = g[i].parentNode.getCTM()
        let cursor = d3.mouse(document.querySelector('#ForceGraph'))
        this.graph.previewLink({relation, x1: origin.e, y1: origin.f, x2: cursor[0], y2: cursor[1]})
      }
    })

    dragBehaviour.on('end', (d, i, g) => {
      let sourceEvent = d3.event.sourceEvent
      if (!this.targetNode) this.graph.removeLink(`relation-${this.graph.relationIterator}`)
      if (sourceEvent.shiftKey && this.targetNode) {
        this.graph.establishLink(`relation-${this.graph.relationIterator}`, g[i].parentNode.id, this.graph.targetNode.id)
      }
      this.graph.relationIterator ++
    })

    selection.call(dragBehaviour)
  }

  nodeTarget (selection) {
    selection.on('mouseenter', (d, i, g) => { this.graph.targetNode = g[i].parentNode })
    selection.on('mouseleave', () => { this.graph.targetNode = null })
  }

  nodeResize (selection) {
    let resize = d3.drag()
    resize.on('drag', (d, i, g) => {
      let boundingBox = d3.select(g[i].parentNode)
      let nodeLabel = d3.select(g[i].parentNode.parentNode).select('foreignObject.nodeLabel')
      let nodeValues = d3.select(g[i].parentNode.parentNode).select('foreignObject.nodeValues')

      let width = Math.max(0, parseFloat(boundingBox.attr('width')) + d3.event.dx)
      let height = Math.max(20, parseFloat(boundingBox.attr('height')) + d3.event.dy)

      boundingBox.attr('width', width).attr('height', height)
      nodeLabel.attr('width', width).attr('height', height)
      nodeValues.attr('width', width).attr('height', height)

      let handleX = Math.max(0, width - 5)
      let handleY = Math.max(0, height + 15)

      d3.select(g[i]).attr('transform', `translate(${handleX},${handleY})`)
    })

    selection.call(resize)
  }

  editCotent (selection) {
    selection.on('mousedown', (d, i, g) => {
      d3.select('#ForceGraph').on('.zoom', null)
      g[i].focus()
    })

    selection.on('blur', (d, i, g) => {
      d3.select('#ForceGraph').call(this.graph.zoom)
      // TODO: update gun
    })
  }

  returnOnNewLine (selection) {
    selection.on('keydown', (d, i, g) => {
      if (d3.event.key === 'Enter') {
        d3.event.preventDefault()
        g[i].parentNode.querySelector('.value').focus()
      }
    })
  }

  addValue (selection) {
    selection.on('click', (d, i, g) => {
      d3.select(g[i].parentNode)
      .insert(() => this.valueGroup('', ''), '.valueGroup:nth-child(2)')
      .call((selection) => {
        selection.select('.valueLabel').call(this.editCotent).call(this.returnOnNewLine)
        selection.select('.value').call(this.editCotent)
        selection.select('.valueLabel').node().focus()
      })
    })
  }

  Node (center, path, data) {
    let group = this.group('nodes', path)
    d3.select(group)
    .attr('transform', `translate(${center.x},${center.y})`)

    let nodeHandle = this.circle(data)
    d3.select(nodeHandle)
    .attr('fill', data ? 'red' : 'lightgrey')
    .call(this.nodeMove).call(this.nodeTarget)

    let nodeLabel = this.nodeLabel(path)
    d3.select(nodeLabel).select('.label')
    .call(this.editCotent)

    let nodeValues = this.nodeValues(data)
    d3.select(nodeValues).select('.moreValue')
    .call(this.addValue)
    d3.select(nodeValues).selectAll('.valueLabel')
    .call(this.editCotent).call(this.returnOnNewLine)
    d3.select(nodeValues).selectAll('.value')
    .call(this.editCotent)

    let boundingBox = this.boundingBox()
    d3.select(boundingBox).select('.boundingBoxHandle')
    .call(this.nodeResize)

    d3.select(group).append(() => nodeHandle)
    d3.select(group).append(() => nodeLabel)
    d3.select(group).append(() => nodeValues)
    d3.select(group).append(() => boundingBox)

    return group
  }

  Link (from, to, relation) {
    let group = this.group('links', relation)
    d3.select(group)
    .attr('transform', `translate(${from[0]},${from[1]})`)

    let linkPath = this.linkPath(from, to)

    let linkLabel = this.linkLabel()
    d3.select(linkLabel).attr('transform', textOrientation(from, to).transform)

    d3.select(group).append(() => linkPath)
    d3.select(group).append(() => linkLabel)

    return group
  }

}

module.exports = ElementMaker
