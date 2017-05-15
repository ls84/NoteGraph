const SVGCanvas = require('./SVGCanvas.js') // eslint-disable-line no-unused-vars

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nodeColor: 'white'
    }
    this.gun = Gun().get('app')

    this.pathChange = this.pathChange.bind(this)
  }

  componentDidMount () {
    this.gun.val((data, key) => {
      let graphData = {}
      for (let key in data) {
        if (key !== '_' && data[key] !== null) graphData[key] = data[key]
      }
      this.setState({path: 'app', data: graphData, rootCache: graphData})
    })



    // keeping this data injection for now
    // const test = this.gun.get('test')
    // test.put({value: null})
    // test.put({name: 'test'})
    // test.put({'other value': 'this is another value'})
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
    // this.gun.get('test').path('node 02').val((data, key) => {console.log(data,key);})
    // Gun().get('app').path('test').val((data, key) => {console.log(data,key);})
    // this.gun.path('node.node1').val((data, key) => {console.log(data,key);})
    // this.gun.path('node').val((data, key) => {console.log(data,key);})
  }

  pathChange (event) {
    let input = event.target.value

    if (input === '') return this.setState({path: 'app', data: this.state.rootCache, nodeColor: 'white'})

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

  render () {
    return ( <SVGCanvas /> )
  }
}

module.exports = Main
