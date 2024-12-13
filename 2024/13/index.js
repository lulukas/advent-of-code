import { getLines } from '../../utils/fileStreamUtils.js'

const parseInput = (part2) => (lines) => {
  let i = 0
  const machines = []
  while (i < lines.length) {
    const [xa, ya] = lines[i + 0].replace('Button A: X+', '').replace(' Y+', '').split(',')
    const buttonA = { x: +xa, y: +ya }
    const [xb, yb] = lines[i + 1].replace('Button B: X+', '').replace(' Y+', '').split(',')
    const buttonB = { x: +xb, y: +yb }
    const [xp, yp] = lines[i + 2].replace('Prize: X=', '').replace(' Y=', '').split(',')
    const price = { x: +xp, y: +yp }
    machines.push([
      buttonA.x,
      buttonA.y,
      buttonB.x,
      buttonB.y,
      part2 ? price.x + 10000000000000 : price.x,
      part2 ? price.y + 10000000000000 : price.y,
    ])
    i += 4
  }
  return machines
}

const getCheapestClicks = ([ax, ay, bx, by, px, py]) => {
  const queue = [`3|${ax},${ay}`, `1|${bx},${by}`]
  while (queue.length > 0) {
    const [value, position] = queue.shift().split('|')
    if (position === `${px},${py}`) {
      return +value
    }
    const [x, y] = position.split(',').map(Number)
    const nax = x + ax
    const nay = y + ay
    if (nax <= px && nay <= py) {
      const newValue = +value + 3
      const newPosition = `${nax},${nay}`
      const i = queue.findIndex((q) => q.split('|')[1] === newPosition)
      if (i > -1) {
        const oldValue = +queue[i].split('|')[0]
        if (newValue < oldValue) {
          queue[i] = `${newValue}|${newPosition}`
        }
      } else {
        queue.push(`${newValue}|${newPosition}`)
      }
    }
    const nbx = x + bx
    const nby = y + by
    if (nbx <= px && nby <= py) {
      const newValue = +value + 1
      const newPosition = `${nbx},${nby}`
      const i = queue.findIndex((q) => q.split('|')[1] === newPosition)
      if (i > -1) {
        const oldValue = +queue[i].split('|')[0]
        if (newValue < oldValue) {
          queue[i] = `${newValue}|${newPosition}`
        }
      } else {
        queue.push(`${newValue}|${newPosition}`)
      }
    }
  }
  return 0
}

const getCheapestClicksV2 = ([ax, ay, bx, by, px, py]) => {
  let cheapestClicks = 0

  let a = 0

  while (a * ax < px && a * ay < py) {
    if ((px - a * ax) % bx === 0 && (py - a * ay) % by === 0 && (px - a * ax) / bx === (py - a * ay) / by) {
      const clicks = 3 * a + (px - a * ax) / bx
      if (cheapestClicks === 0 || clicks < cheapestClicks) {
        cheapestClicks = clicks
      }
    }
    a++
  }

  return cheapestClicks
}

const getCheapestClicksV3 = ([ax, ay, bx, by, px, py]) => {
  const a = Math.round((px / bx - py / by) / (ax / bx - ay / by))
  const b = Math.round((px / ax - py / ay) / (bx / ax - by / ay))
  return a * ax + b * bx === px && a * ay + b * by === py ? 3 * a + b : 0
}

export const getPart1 = (filePath) =>
  parseInput(false)(getLines(filePath))
    .map(getCheapestClicksV3)
    .reduce((sum, nv) => sum + nv, 0)

export const getPart2 = (filePath) =>
  parseInput(true)(getLines(filePath))
    .map(getCheapestClicksV3)
    .reduce((sum, nv) => sum + nv, 0)
