function textOrientation (from, to) {
  let svg = document.querySelector('#ForceGraph')
  let M = svg.createSVGMatrix()
  M = M.flipY()
  M = M.translate(-from[0], -from[1])

  let P = svg.createSVGPoint()
  P.x = to[0]
  P.y = to[1]
  P = P.matrixTransform(M)
  let angle = Math.atan2(P.y, P.x)
  let sign = Math.sign(angle)

  let direction
  if ((sign === 1 && angle <= Math.PI / 2) || (sign === -1 && angle >= -1 * Math.PI / 2)) direction = 'starboard'
  if ((sign === -1 && angle < -1 * Math.PI / 2) || (sign === 1 && angle > Math.PI / 2)) direction = 'port'

  let textRotation = Math.atan2(to[1] - from[1], to[0] - from[0])

  let degree = 180 * textRotation / Math.PI
  if (direction === 'port') degree = (degree < 0) ? 180 + degree : degree - 180

  return {direction, degree}
}

module.exports = textOrientation
