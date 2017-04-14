module.exports = function () {
  let scope = this
  let dragBehaviour = d3.drag()

  dragBehaviour.on('start', function () {
    scope.relationIterator ++
  })

  dragBehaviour.on('drag', function () {
    let sourceEvent = d3.event.sourceEvent
    if (!sourceEvent.shiftKey) {
      let cursor = d3.mouse(document.querySelector('#ForceGraph'))
      d3.select(this.parentNode)
      .attr('transform', `translate(${cursor[0]},${cursor[1]})`)
      // TODO: drag links along
      console.log(this.parentNode.id);
    }

    if (sourceEvent.shiftKey) {
      let relation = `relation-${scope.relationIterator}`
      let origin = this.parentNode.getCTM()
      let cursor = d3.mouse(document.querySelector('#ForceGraph'))
      scope.previewLink({relation, x1: origin.e, y1: origin.f, x2: cursor[0], y2: cursor[1]})
    }
  })

  dragBehaviour.on('end', function () {
    let sourceEvent = d3.event.sourceEvent
    if (!scope.targetNode) scope.removeLink(`relation-${scope.relationIterator}`)
    if (sourceEvent.shiftKey && scope.targetNode) {
      scope.establishLink(`relation-${scope.relationIterator}`, this.parentNode.id, scope.targetNode.id)
    }
  })

  return dragBehaviour
}
