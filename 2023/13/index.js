import { getLines } from '../../utils/fileStreamUtils.js'

const swapField = (field) => {
  const swaped = [[]]
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (swaped[j]) swaped[j][i] = field[i][j]
      else swaped[j] = [field[i][j]]
    }
  }
  return swaped.map((l) => l.join(''))
}

export const getMirrors = (filePath) => {
  const isMirrorPos = (field, a, b) => {
    while (field[a] === field[b] && a > 0 && b < field.length - 1) {
      console.log('🚀', field[a], field[b])
      a--
      b++
    }
    return field[a] === field[b]
  }

  const getMirrorPos = (field) => {
    let a = 0
    while (field[a] !== field[a + 1] || !isMirrorPos(field, a, a + 1)) {
      if (a === field.length - 1) return -1
      a++
    }
    return a + 1
  }

  const lines = getLines(filePath)
  const fields = lines.reduce(
    (p, n) => {
      n === '' ? p.push([]) : p[p.length - 1].push(n)
      return p
    },
    [[]]
  )
  let mirrorpositions = 0

  fields.forEach((field) => {
    const hoizontalMirrorPos = getMirrorPos(field, 0, 1)
    if (hoizontalMirrorPos === -1) {
      const verticalMirrorPos = getMirrorPos(swapField(field), 0, 1)
      mirrorpositions += verticalMirrorPos
    } else {
      mirrorpositions += 100 * hoizontalMirrorPos
    }
  })
  return mirrorpositions
}

export const getMirrorsWithSmudge = (filePath) => {
  const getSmudges = (la, lb) => {
    if (!lb) return 3
    let smudges = 0
    la.split('').forEach((a, i) => {
      if (a !== lb[i]) smudges++
    })
    return smudges
  }

  const isMirrorPos = (field, a, b) => {
    let smudg = 0
    while (smudg < 2 && a > 0 && b < field.length - 1) {
      smudg += getSmudges(field[a], field[b])
      a--
      b++
    }
    smudg += getSmudges(field[a], field[b])
    return smudg == 1
  }

  const getMirrorPos = (field) => {
    let a = 0
    while (getSmudges(field[a], field[a + 1]) > 1 || !isMirrorPos(field, a, a + 1)) {
      if (a === field.length - 1) return -1
      a++
    }
    return a + 1
  }

  const lines = getLines(filePath)
  const fields = lines.reduce(
    (p, n) => {
      n === '' ? p.push([]) : p[p.length - 1].push(n)
      return p
    },
    [[]]
  )
  let mirrorpositions = 0

  fields.forEach((field) => {
    const hoizontalMirrorPos = getMirrorPos(field, 0, 1)
    const verticalMirrorPos = getMirrorPos(swapField(field), 0, 1)
    if (hoizontalMirrorPos === -1) {
      mirrorpositions += verticalMirrorPos
    } else {
      mirrorpositions += 100 * hoizontalMirrorPos
    }
  })
  return mirrorpositions
}
