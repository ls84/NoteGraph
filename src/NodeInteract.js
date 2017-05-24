class NodeInteract extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  show (targetLink) {
    let NodeInteract = document.querySelector('div#NodeInteract')
    NodeInteract.classList.add('show')
    NodeInteract.querySelector('#PathInput').focus()
    this.props.getGunData('')
    this.setState({nodePath: ''})
  }

  hide () {
    document.querySelector('div#NodeInteract').classList.remove('show')
    let input = document.querySelector('div#NodeInteract #PathInput')
    input.value = ''
    input.blur()
  }

  addInputListener () {
    let input = document.querySelector('div#NodeInteract #PathInput')
    input.addEventListener('keyup', (event) => {
      event.stopPropagation()
      this.props.getGunData(input.value)
      this.setState({nodePath: input.value})
    })
  }

  componentDidMount () {
    this.addInputListener()
  }

  render () {
    return (
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
    )
  }
}

module.exports = NodeInteract
