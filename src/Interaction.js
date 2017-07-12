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
    let interaction = {
      display: 'block',
      top: node.data.position[1],
      left: node.data.position[0]
    }
    let pathInput = {
      // display: 'block'
    }
    let valueInput = {
      display: 'none'
    }
    let state = {
      interaction,
      pathInput,
      valueInput
    }
    this.setState(state)
    this.f = 'setDisplayName'
    let input = document.querySelector('div#Interaction #pathInput')
    input.focus()
  }

  componentDidMount () {
    let pathInput = document.querySelector('div#Interaction #pathInput')
    pathInput.addEventListener('keyup', (event) => {
      event.stopPropagation()
      if (event.key === 'Enter') {
        this[this.f](event.target.value)

        this.setState({interaction:{display: 'none'}})
        event.target.value = ''
      }
    })

    let valueInput = document.querySelector('div#Interaction #valueInput')
    valueInput.addEventListener('keyup', (event) => {
      event.stopPropagation()
    })
  }

  render () {
    return (
      <div id="Interaction" style={this.state.interaction} >
        <input type='text' id="pathInput" style={this.state.pathInput} />
        <textArea id="valueInput" style={this.state.valueInput} />
      </div>
    )
  }
}

module.exports = Interaction
