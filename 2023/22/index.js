import { getLines } from '../../utils/fileStreamUtils.js'

export const getLyingBricks = (filePath) => {
  // get Bricks
  const bricksFlying = getLines(filePath)
    .map((l) => l.split('~').map((s) => s.split(',').map((c) => +c)))
    .sort((a, b) => a[0][2] - b[0][2])

  const cubeWidth = bricksFlying.reduce((p, n) => (p < n[1][0] ? n[1][0] : p), 0) + 1
  const cubeLength = bricksFlying.reduce((p, n) => (p < n[1][1] ? n[1][1] : p), 0) + 1
  const floorGrid = []
  for (let x = 0; x < cubeWidth; x++) {
    floorGrid[x] = []
    for (let y = 0; y < cubeLength; y++) {
      floorGrid[x][y] = { z: 0, cube: 0 }
    }
  }

  const bricksLying = {}

  for (let key = 1; key <= bricksFlying.length; key++) {
    const brick = bricksFlying[key - 1]
    let highestPoint = 0
    for (let x = brick[0][0]; x <= brick[1][0]; x++) {
      for (let y = brick[0][1]; y <= brick[1][1]; y++) {
        highestPoint = floorGrid[x][y].z > highestPoint ? floorGrid[x][y].z : highestPoint
      }
    }
    const brickHeight = brick[1][2] - brick[0][2] + 1
    const lyingBrick = {
      key,
      supportBy: [],
      isSupportBying: false,
      isOnlySupportBying: false,
    }
    for (let x = brick[0][0]; x <= brick[1][0]; x++) {
      for (let y = brick[0][1]; y <= brick[1][1]; y++) {
        if (floorGrid[x][y].z === highestPoint && !lyingBrick.supportBy.includes(floorGrid[x][y].cube)) {
          lyingBrick.supportBy.push(floorGrid[x][y].cube)
        }
        floorGrid[x][y].z = highestPoint + brickHeight
        floorGrid[x][y].cube = key
      }
    }
    bricksLying[key] = lyingBrick
  }

  Object.values(bricksLying).forEach((b) => {
    if (b.supportBy.length === 1 && b.supportBy[0] !== 0) {
      bricksLying[b.supportBy[0]].isOnlySupportBying = true
    }
    if (b.supportBy.length > 0 && b.supportBy[0] !== 0) {
      b.supportBy.forEach((s) => (bricksLying[s].isSupportBying = true))
    }
  })

  return bricksLying
}
export const getRemovableBricks = (filePath) => {
  return Object.values(getLyingBricks(filePath)).filter((b) => !b.isOnlySupportBying).length
}

export const getCollabsingBricks = (filePath) => {
  const bricksLying = getLyingBricks(filePath)

  const getSupportByedBricks = (removedBricks) => {
    let removed = [...removedBricks]
    while (removedBricks.length > 0) {
      const removedBrick = removedBricks.shift()
      Object.values(bricksLying)
        .filter((b) => b.supportBy.includes(removedBrick))
        .forEach((b) => {
          if (!b.supportBy.some((s) => !removed.includes(s)) && !removed.includes(b.key)) {
            removed.push(b.key)
            removedBricks.push(b.key)
          }
        })
    }
    return removed.length - 1
  }

  return Object.values(bricksLying)
    .filter((b) => b.isOnlySupportBying)
    .reduce((p, n) => p + getSupportByedBricks([n.key]), 0)
}
