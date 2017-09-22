const SVGCanvas = require('./SVGCanvas.js') // eslint-disable-line no-unused-vars

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    let root = Gun()
    this.gun = root.get('data').on((d, k) => {
      console.log('change on data:', d)
    }, true)

    window.gun = this.gun

    this.getGunData = this.getGunData.bind(this)
    this.putNewNode = this.putNewNode.bind(this)
    this.removeNode = this.removeNode.bind(this)
    this.removeLink = this.removeLink.bind(this)
    this.connectNode = this.connectNode.bind(this)
  }

  componentDidMount () {
  }

  getGunData (path) {
    let data = this.gun.path(path)
    if (path === '') data = this.gun

    this.setState({data: data})
  }

  putNewNode (path) {
    this.gun.path(path).put({})
  }

  removeNode (node, reset) {
    if (reset) node.gun.put(null)
    if (node.links.from) node.links.from.forEach((l) => l.DOM.remove())
    if (node.links.to) node.links.to.forEach((l) => l.DOM.remove())
    node.DOM.remove()
  }

  removeLink (link, reset) {
    if (reset) link.fromNode.gun.path(`${link.data.predicate}`).put(null)
    link.DOM.remove()
  }

  connectNode (fromPath, predicate, toPath) {
    let toNode = this.gun.path(toPath)
    this.gun.path(`${fromPath}.${predicate}`).put(toNode)
  }

  render () {
    return (<SVGCanvas getGunData={this.getGunData} gunData={this.state.data} putNewNode={this.putNewNode} removeNode={this.removeNode} removeLink={this.removeLink} connectNode={this.connectNode} />)
  }
}

let container = document.querySelector('div#main')
ReactDOM.render(<Main />, container)

module.exports = Main
