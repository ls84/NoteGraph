const ForceGraph = require('../src/ForceGraph.js') // eslint-disable-line no-unused-vars

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodeColor: 'white'
    }
    this.gun = Gun()

    this.pathChange = this.pathChange.bind(this)
  }

  componentDidMount () {
    // const test = this.gun.get('test')

    // keeping this data injection for now
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
    if (input === '') return false

    let path = this.gun.get(input)
    path.val((data, path) => {
      let graphData = {}
      for (let key in data) {
        if (key !== '_' && data[key] !== null) graphData[key] = data[key]
      }

      // this.setState({data: graphData})
      this.setState({nodeColor: 'red'})
    })
  }

  render () {
    return (
      <div>
        <div>
          <svg id="NodeSymbol" width="20px" height="20px" viewBox="0 0 20 20">
            <circle r="9" cx="10" cy="10" fill={this.state.nodeColor} stroke='grey' strokeWidth="0.5" />
          </svg>
          <input id="PathInput" type='text' onChange={this.pathChange}/>
        </div>
        <ForceGraph data={this.state.data} />
      </div>
    )
  }
}

module.exports = Main
