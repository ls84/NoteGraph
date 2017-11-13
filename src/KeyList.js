let Primitives = require('./Primitives.js')

class KeyList extends Primitives {
  constructor (node) {
    super()
    this.node = node
    this.canvasDOM = document.querySelector('svg#Canvas #zoomTransform')
  }

  listElement () {
    let dragBehaviour = d3.drag()
    let valueID

    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      this.node.keylist = null
      this.DOM.remove()

      valueID = `value-${this.getRandomValue()}`
      let position = d3.mouse(this.canvasDOM)
      let key = d.key

      this.node.data.detachedValue[valueID] = {
        position,
        key
      }
    })
    dragBehaviour.on('drag', (d, i, g) => {
      let mouse = d3.mouse(this.canvasDOM)
      this.node.detachedValue[valueID].data.position = mouse
    })

    let counter = 0
    this.list = this.node.keys().map((v) => {
      let id = `${this.node.data.path}-${v}`
      let element = this.text('list-value', id)
      d3.select(element).attr('transform', `translate(0, ${counter * 20})`)
      .text(v)

      counter += 1

      d3.select(element)
      .call(dragBehaviour)

      return {
        element,
        key: v,
        id
      }
    })
  }

  SVGElement () {
    this.listElement()
    let group = this.group('keyList')

    d3.select(group)
    .attr('transform', 'translate(0, 45)')
    .selectAll('.list-value')
    .data(this.list, (d) => d.id ? d.id : undefined)
    .enter()
    .append((d) => d.element)

    this.DOM = group

    return this.DOM
  }
}

module.exports = KeyList
