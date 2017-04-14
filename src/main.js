const ForceGraph = require('../src/ForceGraph.js') // eslint-disable-line no-unused-vars

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodeColor: 'white'
    }
    this.gun = Gun()

    this.pathChange = this.pathChange.bind(this)
    this.displayValues = this.displayValues.bind(this)
    // this.dragStart = this.dragStart.bind(this)
    // this.dragOver = this.dragOver.bind(this)
  }

  componentDidMount () {
    // let symbol = document.querySelector('#NodeSymbol')
    let DropArea = document.querySelector('#DropArea')

    // symbol.addEventListener('dragstart', () => {
    //   console.log('dragStart');
    // })

    DropArea.addEventListener('dragover', (event) => {
      event.preventDefault()
    })

    DropArea.addEventListener('drop', (event) => {
      function cursorPoint (evt) {
        let svg = document.querySelector('#ForceGraph')
        let pt = svg.createSVGPoint()
        pt.x = evt.clientX
        pt.y = evt.clientY
        return pt.matrixTransform(svg.getScreenCTM().inverse())
      }

      let center = cursorPoint(event)
      if (this.state.path === undefined) return this.forceGraph.addValue(center)
      this.forceGraph.addNode(center, this.state.path, this.state.data)
    })

    // keeping this data injection for now
    // const test = this.gun.get('test')
    // test.put({value: null})
    // test.put({name: 'test'})
    // const node = this.gun.get('node')
    // test.path('node 01').put(node.path('node1').put({name: '1st node'}))
    // test.path('node 02').put(node.path('node2').put({name: '2nd node'}))
    // test.path('node 03').put(node.path('node3').put({name: '3rd node'}))
    // test.path('node 04').put(node.path('node4').put({name: '4th node'}))
    // test.path('node 05').put(node.path('node5').put({name: '5th node'}))

    // test.on((data, path) => {
    //   let graphData = {}
    //   for (let key in data) {
    //     if (key !== '_' && data[key] !== null) graphData[key] = data[key]
    //   }
    //   this.setState({data: graphData})
    // })

    // window.setTimeout(() => {
    //   this.setState({data:{}})
    // }, 1000)
  }

  pathChange (event) {
    let input = event.target.value

    if (input === '') return this.setState({path: undefined, nodeColor: 'white'})

    let path = this.gun.get(input)

    path.not(() => {
      this.setState({data: undefined, path: input, nodeColor: 'lightgrey'})
    })
    path.val((data, path) => {
      let graphData = {}
      for (let key in data) {
        if (key !== '_' && data[key] !== null) graphData[key] = data[key]
      }
      this.setState({data: graphData, path: input, nodeColor: 'red'})
    })
  }

  displayValues (path, values) {
    function value (key, value) {
      let uniqueKey = `${path}.${key}`
      return (
        <div id={uniqueKey} key={uniqueKey}>
          <p>{key}</p>
          <p>{value}</p>
        </div>
      )
    }
    let lists = []
    for (let key in values) {
      lists.push(value(key, values[key]))
    }

    this.setState({values: lists})
  }

  render () {
    let style = {height: '51px', width: '100%'}
    return (
      <div>
        <div style={style}>
          <div draggable='true' id="NodeSymbol">
            <svg width="20px" height="20px" viewBox="0 0 20 20" >
              <circle r="9" cx="10" cy="10" fill={this.state.nodeColor} stroke='grey' strokeWidth="0.5" />
            </svg>
          </div>
          <input type='text' id="PathInput" onChange={this.pathChange} />
        </div>
        <div id="DropArea">
          <ForceGraph ref={(c) => { this.forceGraph = c }} displayValues={ this.displayValues }/>
        </div>
        <div id="NodeValue">
          {this.state.values}
        </div>
      </div>
    )
  }
}

module.exports = Main
