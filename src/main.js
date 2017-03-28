const ForceGraph = require('../src/ForceGraph.js') // eslint-disable-line no-unused-vars

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.gun = Gun()
  }

  componentDidMount () {
    const test = this.gun.get('test')
    // keeping this data injection for now
    // test.put({value: null})
    // test.put({name: 'test'})

    // const node = this.gun.get('node')
    // test.path('node 01').put(node.path('node1').put({name: '1st node'}))
    // test.path('node 02').put(node.path('node2').put({name: '2nd node'}))
    // test.path('node 03').put(node.path('node3').put({name: '3rd node'}))
    // test.path('node 04').put(node.path('node4').put({name: '4th node'}))
    // test.path('node 05').put(node.path('node5').put({name: '5th node'}))

    test.on((data, path) => {
      let graphData = {}
      for (let key in data) {
        if (key !== '_' && data[key] !== null) graphData[key] = data[key]
      }
      this.setState({data: graphData})
    })

    // window.setTimeout(() => {
    //   this.setState({data:{}})
    // }, 1000)
  }

  render () {
    return (
      <div>
        <ForceGraph data={this.state.data} />
      </div>
    )
  }
}

module.exports = Main
