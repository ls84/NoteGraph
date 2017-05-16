let LinkInteract = require('./LinkInteract.js') // eslint-disable-line no-unused-vars
let Interaction = require('./Interaction.js')

let Node = require('./Node.js')
let Link = require('./Link.js')
let bindCache = require('./bindCache.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { iterator: 0 }

    this.Link = bindCache.call(this, Link)
    this.Node = Node // TODO: bindCache
    this.setGraphSize = this.setGraphSize.bind(this)
  }

  setGraphSize () {
    let width = window.innerWidth - 16
    let height = window.innerHeight - 36

    document.documentElement.style.setProperty(`--windowHeight`, `${height}px`)
    document.documentElement.style.setProperty(`--windowWidth`, `${width}px`)

    let svg = document.querySelector('svg')
    svg.setAttribute('width', `${width}px`)
    svg.setAttribute('height', `${height}px`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return {width, height}
  }

  cursorPoint (event) {
    let svg = document.querySelector('svg#Canvas')
    let pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY

    let zoomTransform = document.querySelector('svg#Canvas #zoomTransform')
    pt = pt.matrixTransform(zoomTransform.getCTM().inverse())
    pt = pt.matrixTransform(svg.getScreenCTM().inverse())
    return [pt.x, pt.y]
  }

  addZoomBehaviour () {
    let canvas = document.querySelector('svg#Canvas')
    let zoom = d3.zoom()
    zoom.on('zoom', function () {
      console.log('should not be called')
      d3.select(canvas).select('#zoomTransform')
      .attr('transform', d3.event.transform)
    })

    d3.select(canvas).call(zoom)
  }

  addDropNodeBehaviour (newNode, context) {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    DropArea.addEventListener('drop', (event) => {
      let position = this.cursorPoint(event)

      document.querySelector('div#NodeInteract').classList.remove('show')
      let node = newNode('test')
      d3.select('#Canvas #zoomTransform').selectAll('.node')
      .data([node], (d) => d.id)
      .attr('cx', (d) => d.updatePosition(position)[0]).attr('cy', (d) => d.updatePosition(position)[1])
      .enter()
      .append(() => node.SVGElement(position))
      .call((s) => { context(s, node) })
    })
    // TODO: separate to cancelInput()
    DropArea.addEventListener('click', (event) => {
      let NodeInteract = document.querySelector('div#NodeInteract')
      if (NodeInteract.classList.value === 'show') NodeInteract.classList.remove('show')
    })
  }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    this.interaction = new Interaction(this)
    // this.addDropNodeBehaviour()
    // this.addZoomBehaviour()
    // TODO: should move all the addxxxxBehaviour to Interaction class
    // d3.select('svg').call(this.interaction.attachCanvas)
  }

  showNodeInteract () {
    let NodeInteract = document.querySelector('div#NodeInteract')
    NodeInteract.classList.add('show')
    NodeInteract.querySelector('#PathInput').focus()
  }

  showLinkInteract (targetLink) {
    this.linkInteract.show(targetLink)
  }

  render () {
    console.log('state:', this.state)
    return (
      <div>
        <div id="DropArea">
          <svg id='Canvas'><g id="zoomTransform"></g></svg>
        </div>
        <div id="Status"></div>
        <div id="NodeInteract">
          <div className="center">
            <div draggable='true' id="NodeSymbol">
              <svg width="20px" height="20px" viewBox="0 0 20 20" >
                <circle r="9" cx="10" cy="10" fill={this.state.nodeColor} stroke='grey' strokeWidth="0.5" />
              </svg>
            </div>
            <input type='text' id="PathInput" onChange={this.pathChange} />
          </div>
        </div>
        <LinkInteract ref={(c) => { this.linkInteract = c }} />
      </div>
    )
  }
}

module.exports = SVGCanvas
