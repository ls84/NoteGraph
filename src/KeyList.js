let Primitives = require('./Primitives.js')

class KeyList extends Primitives {
  constructor (node) {
    super()
    this.node = node
  }

  listElement () {
    let dragBehaviour = d3.drag()
    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      console.log('starts drag')
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
        id
      }
    })
  }

  SVGElement () {
    this.listElement()
    let group = this.group('keyList')

    d3.select(group)
    .attr('transform', 'translate(0, 60)')
    .selectAll('.list-value')
    .data(this.list, (d) => d.id ? d.id : undefined)
    .enter()
    .append((d) => d.element)

    this.DOM = group

    return this.DOM
  }
}

module.exports = KeyList
