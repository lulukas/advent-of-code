import { getLines } from '../../utils/fileStreamUtils.js'
import { printField } from '../../utils/utils.js'

export const getHoleSize = (filePath) => {
  const diggingPattern = getLines(filePath).map((l) => l.split(' '))
  const holes = []
  const digger = { x: 0, y: 0 }

  // Dig Edge
  for (const i in diggingPattern) {
    const [dir, steps, color] = diggingPattern[i]
    for (let step = 0; step < steps; step++) {
      if (dir === 'U') digger.y--
      else if (dir === 'D') digger.y++
      else if (dir === 'L') digger.x--
      else if (dir === 'R') digger.x++
      holes.push({ x: digger.x, y: digger.y, color })
    }
  }

  const sortedAllHolesX = holes.sort((a, b) => a.x - b.x)
  const smallestX = sortedAllHolesX[0].x
  const highestX = sortedAllHolesX[sortedAllHolesX.length - 1].x
  const cols = highestX - smallestX + 1
  const sortedAllHolesY = holes.sort((a, b) => a.y - b.y)
  const smallestY = sortedAllHolesY[0].y
  const highestY = sortedAllHolesY[sortedAllHolesY.length - 1].y
  const rows = highestY - smallestY + 1
  const field = Array.from({ length: rows }, () => Array.from({ length: cols }, () => '.'))

  holes.forEach((h) => {
    const y = h.y - smallestY
    const x = h.x - smallestX
    field[y][x] = '#'
  })

  printField(
    '',
    field.map((l) => l.join(''))
  )

  // Fill
  let y = smallestY
  let holesY = holes.filter((h) => h.y === y)
  while (holesY.length > 0) {
    const sortedHoles = holesY.sort((a, b) => a.x - b.x)
    let isDigging = false
    let fromUp = false
    let fromDown = false
    for (let i = 0; i < sortedHoles.length; i++) {
      const h = sortedHoles[i]
      if (i !== 0) {
        let ph = sortedHoles[i - 1]
        if (h.x - ph.x > 1) {
          if (isDigging) {
            for (let x = ph.x + 1; x < h.x; x++) {
              holes.push({ x, y: ph.y, color: ph.color })
            }
          }
        }
      }
      fromUp = fromUp || holes.some((hole) => hole.y - 1 === h.y && hole.x === h.x)
      fromDown = fromDown || holes.some((hole) => hole.y + 1 === h.y && hole.x === h.x)
      if (fromUp && fromDown) {
        isDigging = !isDigging
        fromUp = false
        fromDown = false
      }
    }
    y++
    holesY = holes.filter((h) => h.y === y)
  }

  holes.forEach((h) => {
    const y = h.y - smallestY
    const x = h.x - smallestX
    field[y][x] = '#'
  })

  printField(
    '',
    field.map((l) => l.join(''))
  )

  return holes.length
}

export const getCorrectHoleSize = (filePath) => {
  const diggingPattern = getLines(filePath).map((l) => l.split(' '))
  const corners = []
  const digger = { x: 0, y: 0 }

  let totalhole = 0

  for (const i in diggingPattern) {
    const color = diggingPattern[i][2]
    const dir = color[7]
    const steps = parseInt(color.substring(2, 7), 16)
    if (dir === '0' || dir === 'R') digger.x = digger.x + steps
    else if (dir === '1' || dir === 'D') digger.y = digger.y + steps
    else if (dir === '2' || dir === 'L') digger.x = digger.x - steps
    else if (dir === '3' || dir === 'U') digger.y = digger.y - steps
    const xIndex = corners.findIndex((c) => c.x === digger.x)
    if (xIndex > -1) {
      corners[xIndex].y.push(digger.y)
    } else {
      corners.push({ x: digger.x, y: [digger.y] })
    }
  }

  let lastX = 0
  let lastRanges = []
  let rangesToRemove = []
  corners
    .sort((a, b) => a.x - b.x)
    .forEach((line, lineIndex) => {
      if (lineIndex === 0) {
        lastX = line.x - 1
      }

      const sortedY = line.y.sort((a, b) => a - b)
      const ranges = []
      for (let i = 0; i < sortedY.length; i += 2) {
        ranges.push([sortedY[i], sortedY[i + 1]])
      }

      while (rangesToRemove.length > 0) {
        let range = rangesToRemove.splice(0, 1)[0]
        let isStartI = lastRanges.findIndex((r) => range[0] === r[0] && range[1] < r[1])
        let isEndI = lastRanges.findIndex((r) => r[0] < range[0] && range[1] === r[1])
        let isBetweenI = lastRanges.findIndex((r) => r[0] < range[0] && range[1] < r[1])
        let isSameI = lastRanges.findIndex((r) => r[0] === range[0] && range[1] === r[1])
        if (isStartI > -1) {
          const lastRange = lastRanges.splice(isStartI, 1)[0]
          lastRanges.push([range[1], lastRange[1]])
        } else if (isEndI > -1) {
          const lastRange = lastRanges.splice(isEndI, 1)[0]
          lastRanges.push([lastRange[0], range[0]])
        } else if (isBetweenI > -1) {
          const lastRange = lastRanges.splice(isBetweenI, 1)[0]
          lastRanges.push([lastRange[0], range[0]])
          lastRanges.push([range[1], lastRange[1]])
        } else if (isSameI > -1) {
          lastRanges.splice(isSameI, 1)[0]
        }
      }

      // count totalholes between Lines
      lastRanges
        .sort((a, b) => a[0] - b[0])
        .forEach((r) => {
          totalhole += (line.x - 1 - lastX) * (r[1] - r[0] + 1)
        })

      lastX = line.x
      let newRanges = []
      lastRanges = [...ranges, ...lastRanges].sort((a, b) => b[0] - a[0])
      while (lastRanges.length > 0) {
        let range = lastRanges.splice(0, 1)[0]
        let isBeforeI = lastRanges.findIndex((r) => range[1] === r[0])
        let isAfterI = lastRanges.findIndex((r) => range[0] === r[1])
        let isBetweenI = lastRanges.findIndex((r) => r[0] <= range[0] && range[1] <= r[1])
        if (isBeforeI > -1) {
          const lastRange = lastRanges.splice(isBeforeI, 1)[0]
          lastRanges.push([range[0], lastRange[1]])
        } else if (isAfterI > -1) {
          const lastRange = lastRanges.splice(isAfterI, 1)[0]
          lastRanges.push([lastRange[0], range[1]])
        } else if (isBetweenI > -1) {
          rangesToRemove.push(range)
        } else {
          newRanges.push(range)
        }
      }

      lastRanges = [...lastRanges, ...newRanges]

      // count totalholes for changing line
      lastRanges
        .sort((a, b) => a[0] - b[0])
        .forEach((r) => {
          totalhole += r[1] - r[0] + 1
        })

      newRanges = []
    })

  return totalhole
}
