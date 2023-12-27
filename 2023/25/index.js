import { getLines } from '../../utils/fileStreamUtils.js'

const areEqual = (a, b) => {
  if (a.length !== b.length) {
    return false
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }

  return true
}

// The number of cuts is the difference between the number of edges
// within the groups and the total number of edges in the original graph.
const getCuts = (groups, edges) => {
  const edgesInGroups = groups
    .map((group) => edges.filter((e) => group.some((g) => e.a === g || e.b === g)))
    .map((edges) => edges.length)
    .reduce((total, current) => total + current, 0)

  return edgesInGroups - edges.length
}

// Cut the graph into two groups using Karger's algorithm:
// https://en.wikipedia.org/wiki/Karger%27s_algorithm
const getGroups = (vertices, edges) => {
  // Generate a single group for each vertex
  const groups = []
  vertices.forEach((vertex) => {
    groups.push([vertex])
  })

  while (groups.length > 2) {
    // Get random edge with it's vertices and two groups containing this vertices
    const { a, b } = edges[Math.floor(Math.random() * edges.length)]
    const group1 = groups.filter((g) => g.some((v) => v === a))[0]
    const group2 = groups.filter((g) => g.some((v) => v === b))[0]

    if (areEqual(group1, group2)) {
      continue
    }

    // Remove group 2 from groups
    for (let i = 0; i < groups.length; i++) {
      if (areEqual(groups[i], group2)) {
        groups.splice(i, 1)
        break
      }
    }

    // Add group 2 to group 1
    group1.push(...group2)
  }
  return groups
}

const getNumberOfGroups = (vertices, edges) => {
  while (true) {
    const groups = getGroups(vertices, edges)
    if (getCuts(groups, edges) === 3) {
      return groups.reduce((total, current) => total * current.length, 1)
    }
  }
}

export const getPart1 = (filePath) => {
  const vertices = []
  const edges = []

  const containsEdge = (a, b) => {
    return edges.some((edge) => (edge.a === a && edge.b === b) || (edge.a === b && edge.b === a))
  }

  getLines(filePath).forEach((line) => {
    const [a, components] = line.split(': ')
    components.split(' ').forEach((b) => {
      if (!vertices.includes(a)) vertices.push(a)
      if (!vertices.includes(b)) vertices.push(b)

      if (!containsEdge(a, b)) {
        edges.push({ a, b })
      }
    })
  })

  return getNumberOfGroups(vertices, edges)
}
