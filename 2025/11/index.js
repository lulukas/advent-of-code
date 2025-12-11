import { log } from 'mathjs'
import { getLines } from '../../utils/fileStreamUtils.js'
import { memoize } from '../../utils/utils.js'

export const getPart1 = (filePath) => {
  let lines = getLines(filePath)

  if (lines.length === 1) {
    console.log('🚀 ~ getPart1 ~ lines:', lines)
    lines = [
      'aaa: you hhh',
      'you: bbb ccc',
      'bbb: ddd eee',
      'ccc: ddd eee fff',
      'ddd: ggg',
      'eee: out',
      'fff: out',
      'ggg: out',
      'hhh: ccc fff iii',
      'iii: out',
    ]
  }

  let graph = {}
  for (let line of lines) {
    console.log('🚀 ~ getPart1 ~ line:', line)
    const [node, edgesStr] = line.split(': ')
    console.log('🚀 ~ getPart1 ~ edgesStr:', edgesStr)
    const edges = edgesStr.split(' ').map((e) => e.trim())
    graph[node] = edges
  }

  const recurse = memoize((node, visited) => {
    if (node === 'out') {
      return 1
    }
    if (visited.has(node)) {
      return 0
    }
    visited.add(node)
    let count = 0
    for (let edge of graph[node]) {
      count += recurse(edge, visited)
    }
    visited.delete(node)
    return count
  })

  return recurse('you', new Set())
}

export const getPart2 = (filePath) => {
  let lines = getLines(filePath)
  if (lines.length === 1) {
    lines = [
      'svr: aaa bbb',
      'aaa: fft',
      'fft: ccc',
      'bbb: tty',
      'tty: ccc',
      'ccc: ddd eee',
      'ddd: hub',
      'hub: fff',
      'eee: dac',
      'dac: fff',
      'fff: ggg hhh',
      'ggg: out',
      'hhh: out',
    ]
  }

  let graph = {}
  for (let line of lines) {
    const [node, edgesStr] = line.split(': ')
    const edges = edgesStr.split(' ').map((e) => e.trim())
    graph[node] = edges
  }

  const recurse = memoize((node, visited, fft, dac) => {
    if (node === 'out') {
      if (fft && dac) {
        return 1
      }
      return 0
    }
    if (visited.has(node)) {
      return 0
    }
    visited.add(node)
    let count = 0
    for (let edge of graph[node]) {
      count += recurse(edge, visited, fft || edge === 'fft', dac || edge === 'dac')
    }
    visited.delete(node)
    return count
  })

  return recurse('svr', new Set(), false, false)
}
