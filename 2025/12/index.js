import { getPossibleWinsShort } from '../../2023/06/index.js'
import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  let graph = {}
  for (let line of lines) {
    const [node, edgesStr] = line.split(': ')
    const edges = edgesStr.split(' ').map((e) => e.trim())
    graph[node] = edges
  }
  console.log('🚀 ~ getPart1 ~ graph:', graph)

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)
  let result = 0

  return result
}
