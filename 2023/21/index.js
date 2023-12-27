import { getLines } from '../../utils/fileStreamUtils.js'

const getReachableSteps = (filePath, inSteps) => {
  const field = getLines(filePath).map((l) => l.split(''))
  const fieldWidth = field[0].length
  const fieldHeight = field.length

  let coordinates = []
  let visited = {}

  const isPlot = (x, y) =>
    field[y < 0 ? (fieldHeight + (y % fieldHeight)) % fieldHeight : y % fieldHeight][
      x < 0 ? (fieldWidth + (x % fieldWidth)) % fieldWidth : x % fieldWidth
    ] !== '#'

  // get starting coordinates
  field.some((l, y) =>
    l.some((t, x) => {
      if (t === 'S') {
        coordinates.push([x, y, 0])
        return true
      }
      return false
    })
  )

  while (coordinates.length > 0) {
    const [x, y, step] = coordinates.shift()
    if (step > inSteps) return Object.values(visited).reduce((p, n) => (n === inSteps % 2 ? p + 1 : p), 0)

    visited[`${x},${y}`] = step % 2

    if (!(`${x + 1},${y}` in visited) && isPlot(y, x + 1)) {
      visited[`${x + 1},${y}`] = (step + 1) % 2
      coordinates.push([x + 1, y, step + 1])
    }
    if (!(`${x},${y + 1}` in visited) && isPlot(y + 1, x)) {
      visited[`${x},${y + 1}`] = (step + 1) % 2
      coordinates.push([x, y + 1, step + 1])
    }
    if (!(`${x - 1},${y}` in visited) && isPlot(y, x - 1)) {
      visited[`${x - 1},${y}`] = (step + 1) % 2
      coordinates.push([x - 1, y, step + 1])
    }
    if (!(`${x},${y - 1}` in visited) && isPlot(y - 1, x)) {
      visited[`${x},${y - 1}`] = (step + 1) % 2
      coordinates.push([x, y - 1, step + 1])
    }
  }

  return 'error'
}

export const get64steps = (filePath) => {
  return getReachableSteps(filePath, 64)
}

export const get26501365steps = (filePath) => {
  // this solution is from https://pastebin.com/u/scibuff

  /**
   * Lagrange's Interpolation formula for ax^2 + bx + c with x=[0,1,2] and y=[y0,y1,y2] we have
   *   f(x) = (x^2-3x+2) * y0/2 - (x^2-2x)*y1 + (x^2-x) * y2/2
   * so the coefficients are:
   * a = y0/2 - y1 + y2/2
   * b = -3*y0/2 + 2*y1 - y2/2
   * c = y0
   */
  const simplifiedLagrange = (values) => {
    return {
      a: values[0] / 2 - values[1] + values[2] / 2,
      b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
      c: values[0],
    }
  }

  const values = [
    getReachableSteps(filePath, 65),
    getReachableSteps(filePath, 65 + 131),
    getReachableSteps(filePath, 65 + 131 * 2),
  ]
  const poly = simplifiedLagrange(values)
  const target = (26501365 - 65) / 131
  return poly.a * target * target + poly.b * target + poly.c
}
