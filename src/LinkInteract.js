class LinkInteract extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  show (targetLink) {
    this.setState({targetLink})
    let linkInteract = document.querySelector('div#LinkInteract')
    linkInteract.classList.add('show')
    linkInteract.querySelector('input').focus()
  }

  updateTarget () {
    this.hide()
    let input = document.querySelector('div#LinkInteract input')
    this.state.targetLink.name(input.value)
    input.value = ''
  }

  hide () {
    let linkInteract = document.querySelector('div#LinkInteract')
    linkInteract.classList.remove('show')
    let input = linkInteract.querySelector('input')
    input.blur()
  }

  componentDidMount () {
    let input = document.querySelector('div#LinkInteract input')
    input.addEventListener('keyup', (event) => {
      event.stopPropagation()
      if (event.key === 'Enter') this.updateTarget()
    })
  }

  render () {
    return (
      <div id="LinkInteract">
        <div className="center">
         <input type='text' id="predicateInput" />
        </div>
      </div>
    )
  }
}

module.exports = LinkInteract
