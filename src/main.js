const SVGCanvas = require('./SVGCanvas.js') // eslint-disable-line no-unused-vars

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.gun = Gun()
    window.gun = this.gun

    this.getGunData = this.getGunData.bind(this)
    this.putNewNode = this.putNewNode.bind(this)
    this.removeNode = this.removeNode.bind(this)
  }

  componentDidMount () {
   // this.gun.val((data, key) => {
   //   let graphData = {}
   //   for (let key in data) {
   //     if (key !== '_' && data[key] !== null) graphData[key] = data[key]
   //   }
   //   this.setState({path: 'app', data: graphData, rootCache: graphData})
   // })

   // // keeping this data injection for now
   // const test = this.gun.get('test')
   // test.put({history: 'This is of course correct, but I\'d like to add the reason for having to do this: the JSON spec at ietf.org/rfc/rfc4627.txt contains this sentence in section 2.5: "All Unicode characters may be placed within the quotation marks except for the characters that must be escaped: quotation mark, reverse solidus, and the control characters (U+0000 through U+001F)." Since a newline is a control character, it must be escaped.\\nAccording to www.json.org JSON does accept the control sequence "\n" in strings - and if you try JSON.parse([\'"a\\na"\'])[1].charCodeAt(); that will show 10 - which was "Linefeed" the last time I checked. --- BTW: Stop screaming!'})
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

  getGunData (path) {
    let data = this.gun.get('app').path(path)
    if (path === '') data = this.gun

    this.setState({data: data})
  }

  putNewNode (path) {
   this.gun.get('app').path(path).put({})
  }

  removeNode (path) {
   this.gun.get('app').path(path).put(null)
  }

  render () {
    return (<SVGCanvas getGunData={this.getGunData} gunData={this.state.data} putNewNode={this.putNewNode} removeNode={this.removeNode} />)
  }
}

module.exports = Main
