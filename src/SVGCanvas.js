let Interaction = require('./Interaction.js')

let Link = require('./Link.js')
let bindCache = require('./bindCache.js')

class SVGCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = { iterator: 0 }

    this.Link = bindCache.call(this, Link)
    this.setGraphSize = this.setGraphSize.bind(this)
    this.interaction = new Interaction(this)
  }

  setGraphSize () {
    let width = window.innerWidth - 16
    let height = window.innerHeight - 36
    let svg = document.querySelector('svg')
    this.setState({width, height})
    svg.setAttribute('width', `${width}px`)
    svg.setAttribute('height', `${height}px`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    return {width, height}
  }

  cursorPoint (event) {
    let svg = document.querySelector('#Canvas')
    let pt = svg.createSVGPoint()
    pt.x = event.clientX
    pt.y = event.clientY
    
    return pt.matrixTransform(svg.getScreenCTM().inverse())
  }

  addDropNodeBehaviour () {
    let DropArea = document.querySelector('#DropArea')
    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
    DropArea.addEventListener('drop', (event) => {
      let center = this.cursorPoint(event)
      // if (this.state.path === undefined) return this.forceGraph.addValue(center)
      // TODO:
      // this.forceGraph.addNode(center, this.state.path, this.state.data)
      document.querySelector('div#NodeInteract').classList.remove('show')
    })
    DropArea.addEventListener('click', (event) => {
      let NodeInteract = document.querySelector('div#NodeInteract')
      if (NodeInteract.classList.value === 'show') NodeInteract.classList.remove('show')
    })
  }

  componentDidMount () {
    this.setGraphSize()
    window.onresize = this.setGraphSize

    this.addDropNodeBehaviour()
    d3.select('svg').call(this.interaction.attachCanvas)
  }

  showNodeInteract () {
    let NodeInteract = document.querySelector('div#NodeInteract')
    NodeInteract.classList.add('show')
    NodeInteract.querySelector('#PathInput').focus()
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
        <div id="PreRender"></div>
      </div>
    )
  }
}

module.exports = SVGCanvas
