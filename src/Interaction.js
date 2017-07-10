class Interaction extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      position: 'absolute'
    }
    
    this.f = undefined
    this.target = undefined
  }

  setDisplayName (name) {
    this.target.gun.path('name').put(name)
    this.target.data.displayName = name
    this.target.toggleDisplayLevel(1)
  }

  nodeName (node) {
    this.target = node
    let position = {
      display: 'block',
      top: node.data.position[1],
      left: node.data.position[0]
    }
    this.setState(position)
    this.f = 'setDisplayName'
    let input = document.querySelector('div#Interaction input')
    input.focus()
  }

  componentDidMount () {
    let input = document.querySelector('div#Interaction input')
    input.addEventListener('keyup', (event) => {
      event.stopPropagation()
      if (event.key === 'Enter') {
        this[this.f](event.target.value)

        this.setState({display: 'none'})
        event.target.value = ''
      }
    })
  }

  render () {
    return (
      <div id="Interaction" style={this.state} >
        <input type='text' id="PathInput" />
      </div>
    )
  }
}

module.exports = Interaction
