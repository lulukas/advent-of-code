import { getLines } from '../../utils/fileStreamUtils.js'

export const getDistances = (filePath) => {
  const sky = getLines(filePath).map((l) => l.split(''))
  let galaxies = []
  sky.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === '#') galaxies.push({ x, y })
    })
  })

  // Expand Galaxy
  let expand = 0
  let expandedGalaxies = []
  for (let x = 0; x < sky[0].length; x++) {
    if (galaxies.some((g) => g.x === x)) {
      galaxies.forEach((g) => {
        if (g.x === x) {
          expandedGalaxies.push({ x: g.x + expand, y: g.y })
        }
      })
    } else {
      expand++
    }
  }
  galaxies = expandedGalaxies
  expand = 0
  expandedGalaxies = []
  for (let y = 0; y < sky.length; y++) {
    if (galaxies.some((g) => g.y === y)) {
      galaxies.forEach((g) => {
        if (g.y === y) {
          expandedGalaxies.push({ x: g.x, y: g.y + expand })
        }
      })
    } else {
      expand++
    }
  }

  // get all distances
  let totalDistance = 0
  for (let i = 0; i < expandedGalaxies.length; i++) {
    for (let j = i + 1; j < expandedGalaxies.length; j++) {
      const distance =
        Math.abs(expandedGalaxies[i].x - expandedGalaxies[j].x) +
        Math.abs(expandedGalaxies[i].y - expandedGalaxies[j].y)
      totalDistance += distance
    }
  }

  return totalDistance
}

export const getFarDistances = (filePath) => {
  const sky = getLines(filePath).map((l) => l.split(''))
  let galaxies = []
  sky.forEach((row, y) => {
    row.forEach((col, x) => {
      if (col === '#') galaxies.push({ x, y })
    })
  })

  // Expand Galaxy
  let expand = 0
  let expandedGalaxies = []
  for (let x = 0; x < sky[0].length; x++) {
    if (galaxies.some((g) => g.x === x)) {
      galaxies.forEach((g) => {
        if (g.x === x) {
          expandedGalaxies.push({ x: g.x + expand, y: g.y })
        }
      })
    } else {
      expand += 999999
    }
  }
  galaxies = expandedGalaxies
  expand = 0
  expandedGalaxies = []
  for (let y = 0; y < sky.length; y++) {
    if (galaxies.some((g) => g.y === y)) {
      galaxies.forEach((g) => {
        if (g.y === y) {
          expandedGalaxies.push({ x: g.x, y: g.y + expand })
        }
      })
    } else {
      expand += 999999
    }
  }
  let totalDistance = 0
  for (let i = 0; i < expandedGalaxies.length; i++) {
    for (let j = i + 1; j < expandedGalaxies.length; j++) {
      const distance =
        Math.abs(expandedGalaxies[i].x - expandedGalaxies[j].x) +
        Math.abs(expandedGalaxies[i].y - expandedGalaxies[j].y)
      totalDistance += distance
    }
  }

  return totalDistance
}
