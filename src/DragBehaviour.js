module.exports = function () {
  let scope = this
  let dragBehaviour = d3.drag()

  dragBehaviour.on('start', function () {
    let cursor = d3.mouse(document.querySelector('#ForceGraph'))
    let sourceEvent = d3.event.sourceEvent
    let nodePosition = sourceEvent.target.parentNode.getCTM()

    if (sourceEvent.shiftKey) scope.addLink({x1: nodePosition.e, y1: nodePosition.f, x2: cursor[0], y2: cursor[1]})
  })

  dragBehaviour.on('drag', function () {
    let sourceEvent = d3.event.sourceEvent
    if (!sourceEvent.shiftKey) {
      let cursor = d3.mouse(document.querySelector('#ForceGraph'))
      d3.select(this.parentNode)
      .attr('transform', `translate(${cursor[0]},${cursor[1]})`)
    }

    if (sourceEvent.shiftKey) {
      let cursor = d3.mouse(document.querySelector('#ForceGraph'))
      let nodePosition = this.parentNode.getCTM()
      scope.previewLink({x1: nodePosition.e, y1: nodePosition.f, x2: cursor[0], y2: cursor[1]})
    }
  })

  dragBehaviour.on('end', function () {
    if (!scope.targetNode) scope.removeLink(scope.temporaryLink)
  })

  return dragBehaviour
}
