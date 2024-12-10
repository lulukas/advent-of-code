import { getLines } from '../../utils/fileStreamUtils.js'

const getHikingPathCount = (input, unique) => {
  const lines = input.map((l) => l.split('').map((p) => +p))
  const width = lines[0].length
  const height = lines.length

  let result = 0

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      if (lines[y][x] === 0) {
        let inputQueue = []
        inputQueue.push(`${x},${y},0`)
        while (inputQueue.length > 0) {
          const [px, py, h] = inputQueue
            .shift()
            .split(',')
            .map((p) => +p)

          if (h === 9) {
            result++
          } else {
            let possiblePoint = ''
            if (px + 1 < width && lines[py][px + 1] === h + 1) {
              possiblePoint = `${px + 1},${py},${h + 1}`
              if (unique || !inputQueue.includes(possiblePoint)) inputQueue.push(possiblePoint)
            }
            if (py + 1 < height && lines[py + 1][px] === h + 1) {
              possiblePoint = `${px},${py + 1},${h + 1}`
              if (unique || !inputQueue.includes(possiblePoint)) inputQueue.push(possiblePoint)
            }
            if (px - 1 >= 0 && lines[py][px - 1] === h + 1) {
              possiblePoint = `${px - 1},${py},${h + 1}`
              if (unique || !inputQueue.includes(possiblePoint)) inputQueue.push(possiblePoint)
            }
            if (py - 1 >= 0 && lines[py - 1][px] === h + 1) {
              possiblePoint = `${px},${py - 1},${h + 1}`
              if (unique || !inputQueue.includes(possiblePoint)) inputQueue.push(possiblePoint)
            }
          }
        }
      }
    }
  }

  return result
}

export const getPart1 = (filePath) => getHikingPathCount(getLines(filePath), false)
export const getPart2 = (filePath) => getHikingPathCount(getLines(filePath), true)
