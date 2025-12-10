import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const tiles = getLines(filePath)
  return getPossibleSquares(tiles)[0].size
}

export const getPart2 = (filePath) => {
  const tiles = getLines(filePath)
  const squares = getPossibleSquares(tiles)
  let x = 0
  let containsRedAndGreen = false

  do {
    const { tile1, tile2 } = squares[x]
    if (hasNoRedTilesBetween(tile1, tile2, tiles) && hasNoLineGoingThrough(tile1, tile2, tiles)) {
      containsRedAndGreen = true
    } else {
      x++
    }
  } while (!containsRedAndGreen && x < squares.length)

  return squares[x].size
}

const getPossibleSquares = (tiles) =>
  tiles
    .reduce((squares, tile, index) => {
      const [x, y] = tile.split(',').map(Number)
      for (let i = index + 1; i < tiles.length; i++) {
        const [x2, y2] = tiles[i].split(',').map(Number)
        const size = (Math.abs(x - x2) + 1) * (Math.abs(y - y2) + 1)
        squares.push({ size, tile1: tiles[index], tile2: tiles[i] })
      }
      return squares
    }, [])
    .sort((a, b) => b.size - a.size)

const hasNoLineGoingThrough = (tile1, tile2, tiles) => {
  const [x1, y1] = tile1.split(',').map(Number)
  const [x2, y2] = tile2.split(',').map(Number)
  for (let i = 0; i < tiles.length; i++) {
    const [x3, y3] = tiles[i].split(',').map(Number)
    const [x4, y4] = tiles[(i + 1) % tiles.length].split(',').map(Number)
    if (isLineIntersecting(x1, y1, x2, y2, x3, y3, x4, y4)) {
      return false
    }
  }
  return true
}

const isLineIntersecting = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  if (x3 === x4) {
    return (
      Math.min(y1, y2) >= Math.min(y3, y4) &&
      Math.max(y1, y2) <= Math.max(y3, y4) &&
      Math.min(x1, x2) < Math.min(x3, x4) &&
      Math.max(x1, x2) > Math.max(x3, x4)
    )
  }
  if (y3 === y4) {
    return (
      Math.min(x1, x2) >= Math.min(x3, x4) &&
      Math.max(x1, x2) <= Math.max(x3, x4) &&
      Math.min(y1, y2) < Math.min(y3, y4) &&
      Math.max(y1, y2) > Math.max(y3, y4)
    )
  }
}

const hasNoRedTilesBetween = (tile1, tile2, tiles) => {
  const [x1, y1] = tile1.split(',').map(Number)
  const [x2, y2] = tile2.split(',').map(Number)
  const redTiles = tiles.filter((tile) => {
    const [x, y] = tile.split(',').map(Number)
    return x > Math.min(x1, x2) && x < Math.max(x1, x2) && y > Math.min(y1, y2) && y < Math.max(y1, y2)
  })
  return redTiles.length === 0
}
