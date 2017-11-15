let Primitives = require('./Primitives.js')

class KeyList extends Primitives {
  constructor (node) {
    super()
    this.node = node
    this.canvasDOM = document.querySelector('svg#Canvas #zoomTransform')
  }

  valueInputBox () {
    let valueInputBox = this.foreignObject('valueInputBox')
    d3.select(valueInputBox)
    .attr('transform', 'translate(0,25)')
    .attr('width', 160)
    .attr('height', 90)
    .append('xhtml:textarea')
    .style('width', 160)
    .style('height', 90)

    valueInputBox.querySelector('textarea').addEventListener('keyup', (event) => {
      event.stopPropagation()
    })

    return valueInputBox
  }

  keyInputBox () {
    let dragBehaviour = d3.drag()
    let valueID
    let dragged

    dragBehaviour.on('start', () => {
      d3.event.sourceEvent.stopPropagation()
      valueID = `value-${this.getRandomValue()}`
    })

    dragBehaviour.on('drag', () => {
      let mouse = d3.mouse(this.canvasDOM)
      if (!dragged) {
        this.node.keylist = null
        this.DOM.remove()
        let newData = {
          key: this.DOM.querySelector('.keyInputBox input').value,
          value: this.DOM.querySelector('.valueInputBox textarea').value
        }
        this.node.data.associatedValue[valueID] = {
          value: newData.value,
          position: mouse,
          key: newData.key
        }

        this.node.gunCache.data.path(newData.key).put(newData.value)

        dragged = true
      } else {
        this.node.associatedValue[valueID].data.position = mouse
      }
    })

    let keyInputBox = this.foreignObject('keyInputBox')
    d3.select(keyInputBox)
    .attr('width', 160)
    .attr('height', 20)
    .append('xhtml:input')
    .style('width', 160)

    d3.select(keyInputBox).select('input').node().addEventListener('keyup', (event) => {
      event.stopPropagation()
      let key = keyInputBox.querySelector('input').value

      let dimension = this.measureText(key, 'valueLabel')
      let inputWidth = dimension.width > 145 ? dimension.width + 25 : 160
      d3.select(keyInputBox).attr('width', inputWidth)
      .select('input')
      .style('width', inputWidth)

      d3.select(this.DOM).select('.valueInputBox').attr('width', inputWidth)
      .select('textarea')
      .style('width', inputWidth)

      if (event.key === 'Enter') {
        d3.select(keyInputBox).select('input')
        .call(dragBehaviour)

        d3.select(this.DOM).select('.keys').attr('transform', 'translate(0, 105)')
        let valueInputBox = this.valueInputBox()
        d3.select(valueInputBox).attr('width', inputWidth)
        .select('textarea')
        .style('width', inputWidth)

        this.DOM.insertBefore(valueInputBox, this.DOM.querySelector('.keys'))
        this.DOM.querySelector('.valueInputBox textarea').focus()

        d3.select(keyInputBox)
        .call(dragBehaviour)

        // TODO: add dragBehaviour
      }
    })

    return keyInputBox
  }

  listElement () {
    let dragBehaviour = d3.drag()
    let valueID
    let dragged

    dragBehaviour.on('start', (d, i, g) => {
      d3.event.sourceEvent.stopPropagation()
      valueID = `value-${this.getRandomValue()}`
    })
    dragBehaviour.on('drag', (d, i, g) => {
      let mouse = d3.mouse(this.canvasDOM)
      if (!dragged) {
        this.node.keylist = null
        this.DOM.remove()
        this.node.data.associatedValue[valueID] = {
          position: mouse,
          key: d.key
        }
        dragged = true
      } else {
        this.node.associatedValue[valueID].data.position = mouse
      }
    })

    let counter = 0
    this.list = this.node.keys().map((v) => {
      let id = `${this.node.data.path}-${v}`
      let element = this.text('list-value', id)
      d3.select(element).attr('transform', `translate(1, ${counter * 20 + 35})`)
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

    d3.select(group).append(() => this.keyInputBox())

    d3.select(group)
    .attr('transform', 'translate(0, 30)')
    .append(() => this.group('keys'))
    .selectAll('.list-value')
    .data(this.list, (d) => d.id ? d.id : undefined)
    .enter()
    .append((d) => d.element)

    this.DOM = group

    return this.DOM
  }
}

module.exports = KeyList
