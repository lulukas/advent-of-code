import { getLines } from '../../utils/fileStreamUtils.js'

const getJunctionsFromLines = (junctions, nl) => {
  const junction = nl.match(/[A-Z\d]+/g)
  junctions[junction[0]] = [junction[1], junction[2]]
  return junctions
}

const ggt = (a, b) => {
  if (b == 0) return a
  return ggt(b, a % b)
}

const KleinstesGemeinsamesVielfaches = (arr) => {
  let ans = arr[0]
  for (let i = 1; i < arr.length; i++) ans = (arr[i] * ans) / ggt(arr[i], ans)
  return ans
}

export const findShortestWay = (filePath) => {
  const lines = getLines(filePath)
  const directions = lines[0].split('').map((d) => (d === 'L' ? 0 : 1))
  lines.splice(0, 2)
  const junctions = lines.reduce(getJunctionsFromLines, {})

  let turns = 0
  let i = 0
  let junction = 'AAA'

  while (junction !== 'ZZZ') {
    const next = junctions[junction]
    junction = next[directions[i]]
    if (i >= directions.length - 1) i = 0
    else i++
    turns++
  }

  return turns
}

export const findShortestWayForGosts = (filePath) => {
  const lines = getLines(filePath)
  const directions = lines[0].split('').map((d) => (d === 'L' ? 0 : 1))
  lines.splice(0, 2)
  const junctions = lines.reduce(getJunctionsFromLines, {})
  let gosts = Object.keys(junctions).filter((key) => key.split('')[2] === 'A')

  const findZ = gosts.map((gost) => {
    let turns = 0
    let i = 0

    while (gost.split('')[2] !== 'Z') {
      const next = junctions[gost]
      gost = next[directions[i]]
      if (i >= directions.length - 1) i = 0
      else i++
      turns++
    }

    return turns
  })

  return KleinstesGemeinsamesVielfaches(findZ)
}
