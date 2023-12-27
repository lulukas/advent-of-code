import { getLines } from '../../utils/fileStreamUtils.js'
import { lusolve, matrix, transpose } from 'mathjs'

const isInPast = (b, col, m) => {
  if (m.x > 0) {
    return b.x > col.x
  }
  if (m.x < 0) {
    return b.x < col.x
  }
  if (m.x === 0) {
    if (m.y > 0) {
      return b.y > col.y
    }
    if (m.y < 0) {
      return b.y < col.y
    }
  } else {
    return false
  }
}

const getPointOfIntersection = (p1, p2, n1, n2) => {
  const p1End = { x: p1.x + n1.x, y: p1.y + n1.y } // another point in line p1->n1
  const p2End = { x: p2.x + n2.x, y: p2.y + n2.y } // another point in line p2->n2

  const m1 = (p1End.y - p1.y) / (p1End.x - p1.x) // slope of line p1->n1
  const m2 = (p2End.y - p2.y) / (p2End.x - p2.x) // slope of line p2->n2

  const b1 = p1.y - m1 * p1.x // y-intercept of line p1->n1
  const b2 = p2.y - m2 * p2.x // y-intercept of line p2->n2

  const px = (b2 - b1) / (m1 - m2) // collision x
  const py = m1 * px + b1 // collision y

  return { x: px, y: py } // return statement
}

export const getIntersectionPoints = (filePath) => {
  const lines = getLines(filePath)
  const [min, max] = lines.shift().split(',')
  const hail = lines.map((l) =>
    l
      .replaceAll(' ', '')
      .split('@')
      .map((h) => h.split(','))
      .map((h) => {
        return { x: +h[0], y: +h[1] }
      })
  )

  let colidingPairs = 0
  for (let i = 0; i < hail.length; i++) {
    for (let j = i + 1; j < hail.length; j++) {
      const colision = getPointOfIntersection(hail[i][0], hail[j][0], hail[i][1], hail[j][1])
      if (
        !isInPast(hail[i][0], colision, hail[i][1]) &&
        !isInPast(hail[j][0], colision, hail[j][1]) &&
        !Object.values(colision).some((x) => +min > x || x > +max)
      ) {
        colidingPairs++
      }
    }
  }
  return colidingPairs
}

const getIntersection = (a, b, offset) => {
  // Prepare input
  const x1 = a[0].x
  const y1 = a[0].y
  const x2 = a[0].x + a[1].x + offset.x
  const y2 = a[0].y + a[1].y + offset.y
  const x3 = b[0].x
  const y3 = b[0].y
  const x4 = b[0].x + b[1].x + offset.x
  const y4 = b[0].y + b[1].y + offset.y

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator

  // Return an object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return { x, y, time: ua }
}

const isSamePoint = (a, b) => {
  return a.x === b.x && a.y === b.y
}

export const getIntersectingLines = (filePath) => {
  const lines = getLines(filePath)
  lines.shift()
  const hail = lines.map((l) =>
    l
      .replaceAll(' ', '')
      .split('@')
      .map((h) => h.split(','))
      .map((h) => {
        return { x: +h[0], y: +h[1], z: +h[2] }
      })
  )

  // A range for 1000 is enough, at least for my input
  const range = 1000

  for (let x = -range; x < range; x++) {
    for (let y = -range; y < range; y++) {
      const offset = { x, y }

      // Try to intersect the first four hailstones
      const intersect1 = getIntersection(hail[1], hail[0], offset)
      const intersect2 = getIntersection(hail[2], hail[0], offset)
      const intersect3 = getIntersection(hail[3], hail[0], offset)

      // Not valid if not all of them are intersecting
      if (!intersect1 || !intersect2 || !intersect3) {
        continue
      }

      // Not valid if intersection positions are not the same
      if (
        !isSamePoint(intersect1, intersect2) ||
        !isSamePoint(intersect1, intersect3) ||
        !isSamePoint(intersect2, intersect3)
      ) {
        continue
      }

      // Go ahead and check velocity of the z-dimension as well.
      // We know at what time we would intersect the rock's initial position,
      // so we can just check where the Z would end up at
      for (let z = -range; z < range; z++) {
        const intersectZ1 = hail[1][0].z + intersect1.time * (hail[1][1].z + z)
        const intersectZ2 = hail[2][0].z + intersect2.time * (hail[2][1].z + z)
        const intersectZ3 = hail[3][0].z + intersect3.time * (hail[3][1].z + z)

        // Not valid if intersections are not the same
        if (intersectZ1 !== intersectZ2 || intersectZ1 !== intersectZ3 || intersectZ2 !== intersectZ3) {
          continue
        }

        // If four hailstones happen to intersect, just assume we found the answer and exit.
        return intersect1.x + intersect1.y + intersectZ1
      }
    }
  }

  return -1
}
