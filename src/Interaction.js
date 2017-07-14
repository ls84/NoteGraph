class Interaction extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      position: 'absolute'
    }
    
    this.f = undefined
    this.target = undefined
  }

  nodeName (node) {
    this.target = node
    this.f = 'setDisplayName'

    let interaction = {
      display: 'block',
      top: node.data.position[1],
      left: node.data.position[0]
    }
    let pathInput = {
      display: 'block'
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
    this.pathInput.focus()
  }

  nodeValue (node) {
    this.target = node
    this.f = 'addNodeValue'

    let interaction = {
      display: 'block',
      top: node.data.position[1],
      left: node.data.position[0]
    }
    let pathInput = {
      display: 'block'
    }
    let valueInput = {
      display: 'block'
    }
    let state = {
      interaction,
      pathInput,
      valueInput
    }
    this.setState(state)
    this.pathInput.focus()
    
  }

  componentDidMount () {
    this.pathInput = document.querySelector('div#Interaction #pathInput')
    this.pathInput.addEventListener('keyup', (event) => {
      event.stopPropagation()
      if (event.key === 'Enter') {
        if (this.f === 'setDisplayName') {
          let name = this.pathInput.value

          this.target.gun.path('name').put(name)
          this.target.data.displayName = name
          this.target.toggleDisplayLevel(1)
          
          this.setState({interaction:{display: 'none'}})
          this.pathInput.value = ''
        }

        if (this.f === 'addNodeValue') {
          this.valueInput.focus()
        }
      }
    })

    this.valueInput = document.querySelector('div#Interaction #valueInput')
    this.valueInput.addEventListener('keyup', (event) => {
      event.stopPropagation()
      if (event.key === 'Enter') {
        let path = this.pathInput.value
        let value = this.valueInput.value
        this.target.gun.path(path).put(value)
        this.target.getValue()

        this.setState({interaction:{display: 'none'}})
        this.pathInput.value = ''
        this.valueInput.value = ''
      }
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
