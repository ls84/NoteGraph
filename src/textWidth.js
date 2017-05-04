function textWidth (text, className) {
  let span = document.createElement('span')
  span.innerText = text
  span.classList.add(className)
  document.querySelector('#PreRender').appendChild(span)
  let width = span.getBoundingClientRect().width
  span.remove()

  return width
}

module.exports = textWidth
