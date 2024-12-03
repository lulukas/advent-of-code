import { getLines } from '../../utils/fileStreamUtils.js'

export const getPrioritiesOfSameItems = (filePath) => {
  const lines = getLines(filePath)

  let totalPriority = 0
  lines.forEach((line) => {
    const secondCompartment = line.slice(line.length / 2, line.length)
    let x = 0
    while (!secondCompartment.includes(line[x])) x++
    const charCode = line.charCodeAt(x)
    const priority = charCode > 96 ? charCode - 96 : charCode - 64 + 26
    totalPriority = totalPriority + priority
  })

  return totalPriority
}

export const getPrioritiesOfSameItems2 = (filePath) => {
  const lines = getLines(filePath)

  let groupindex = 0
  let totalPriority = 0
  while (groupindex < lines.length) {
    let x = 0
    const line = lines[groupindex]
    while (!lines[groupindex + 1].includes(line[x]) || !lines[groupindex + 2].includes(line[x])) x++
    const charCode = line.charCodeAt(x)
    const priority = charCode > 96 ? charCode - 96 : charCode - 64 + 26
    totalPriority = totalPriority + priority
    groupindex += 3
  }

  return totalPriority
}
