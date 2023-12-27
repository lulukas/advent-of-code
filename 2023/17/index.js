import { getLines } from '../../utils/fileStreamUtils.js'
// directions
// 0 > right
// 1 v down
// 2 < left
// 3 ^ up

export const getHeatLoss = (filePath) => {
  const field = getLines(filePath).map((l) => l.split('').map((v) => +v))
  let visited = { '0,0,-1,-1': ['0,0,-1,-1'] }
  let possiblePoints = [[0, 0, -1, -1, 0]]

  while (possiblePoints.length > 0) {
    possiblePoints.sort((a, b) => b[4] - a[4])
    const [y, x, dir, speed, loss] = possiblePoints.pop()

    if (x === field[0].length - 1 && y === field.length - 1) {
      return loss
    }

    if (speed > 2) {
      console.log('speed to high')
      return
    }

    // add right
    if (dir !== 2 && (dir !== 0 || speed < 2)) {
      let nextX = x + 1
      let nextDir = 0
      let nextSpeed = dir === 0 ? speed + 1 : 0
      if (!(`${nextX},${y},${nextDir},${nextSpeed}` in visited) && nextX < field[0].length) {
        visited[`${nextX},${y},${nextDir},${nextSpeed}`] = [
          ...visited[`${x},${y},${dir},${speed}`],
          `${nextX},${y},${nextDir},${nextSpeed}`,
        ]
        possiblePoints.push([y, nextX, nextDir, nextSpeed, loss + field[y][nextX]])
      }
    }

    // add down
    if (dir !== 3 && (dir !== 1 || speed < 2)) {
      let nextY = y + 1
      let nextDir = 1
      let nextSpeed = dir === 1 ? speed + 1 : 0
      if (!(`${x},${nextY},${nextDir},${nextSpeed}` in visited) && nextY < field.length) {
        visited[`${x},${nextY},${nextDir},${nextSpeed}`] = [
          ...visited[`${x},${y},${dir},${speed}`],
          `${x},${nextY},${nextDir},${nextSpeed}`,
        ]
        possiblePoints.push([nextY, x, nextDir, nextSpeed, loss + field[nextY][x]])
      }
    }

    // add left
    if (dir !== 0 && (dir !== 2 || speed < 2)) {
      let nextX = x - 1
      let nextDir = 2
      let nextSpeed = dir === 2 ? speed + 1 : 0
      if (!(`${nextX},${y},${nextDir},${nextSpeed}` in visited) && 0 <= nextX) {
        visited[`${nextX},${y},${nextDir},${nextSpeed}`] = [
          ...visited[`${x},${y},${dir},${speed}`],
          `${nextX},${y},${nextDir},${nextSpeed}`,
        ]
        possiblePoints.push([y, nextX, nextDir, nextSpeed, loss + field[y][nextX]])
      }
    }

    // add up
    if (dir !== 1 && (dir !== 3 || speed < 2)) {
      let nextY = y - 1
      let nextDir = 3
      let nextSpeed = dir === 3 ? speed + 1 : 0
      if (!(`${x},${nextY},${nextDir},${nextSpeed}` in visited) && 0 <= nextY) {
        visited[`${x},${nextY},${nextDir},${nextSpeed}`] = [
          ...visited[`${x},${y},${dir},${speed}`],
          `${x},${nextY},${nextDir},${nextSpeed}`,
        ]
        possiblePoints.push([nextY, x, nextDir, nextSpeed, loss + field[nextY][x]])
      }
    }
  }

  return 'ooops'
}

export const getHeatLossFast = (filePath) => {
  const field = getLines(filePath).map((l) => l.split('').map((v) => +v))
  let visited = { '0,0,-1,-1': ['0,0,-1,-1'] }
  let possiblePoints = [[0, 0, -1, -1, 0]]

  while (possiblePoints.length > 0) {
    possiblePoints.sort((a, b) => b[4] - a[4])
    const [y, x, dir, speed, loss] = possiblePoints.pop()

    if (x === field[0].length - 1 && y === field.length - 1) {
      return loss
    }

    // add right
    if (dir !== 2) {
      if (dir === 0 && speed < 9) {
        let nextX = x + 1
        let nextDir = 0
        let nextSpeed = dir === 0 ? speed + 1 : 0
        if (!(`${nextX},${y},${nextDir},${nextSpeed}` in visited) && nextX < field[0].length) {
          visited[`${nextX},${y},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${nextX},${y},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([y, nextX, nextDir, nextSpeed, loss + field[y][nextX]])
        }
      }
      if (dir !== 0) {
        let nextX = x + 4
        let nextDir = 0
        let nextSpeed = 3
        if (!(`${nextX},${y},${nextDir},${nextSpeed}` in visited) && nextX < field[0].length) {
          visited[`${nextX},${y},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${nextX},${y},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([
            y,
            nextX,
            nextDir,
            nextSpeed,
            loss + field[y][x + 1] + field[y][x + 2] + field[y][x + 3] + field[y][x + 4],
          ])
        }
      }
    }

    // add down
    if (dir !== 3) {
      if (dir === 1 && speed < 9) {
        let nextY = y + 1
        let nextDir = 1
        let nextSpeed = dir === 1 ? speed + 1 : 0
        if (!(`${x},${nextY},${nextDir},${nextSpeed}` in visited) && nextY < field.length) {
          visited[`${x},${nextY},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${x},${nextY},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([nextY, x, nextDir, nextSpeed, loss + field[nextY][x]])
        }
      }
      if (dir !== 1) {
        let nextY = y + 4
        let nextDir = 1
        let nextSpeed = 3
        if (!(`${x},${nextY},${nextDir},${nextSpeed}` in visited) && nextY < field.length) {
          visited[`${x},${nextY},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${x},${nextY},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([
            nextY,
            x,
            nextDir,
            nextSpeed,
            loss + field[y + 1][x] + field[y + 2][x] + field[y + 3][x] + field[y + 4][x],
          ])
        }
      }
    }

    // add left
    if (dir !== 0) {
      if (dir === 2 && speed < 9) {
        let nextX = x - 1
        let nextDir = 2
        let nextSpeed = dir === 2 ? speed + 1 : 0
        if (!(`${nextX},${y},${nextDir},${nextSpeed}` in visited) && 0 <= nextX) {
          visited[`${nextX},${y},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${nextX},${y},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([y, nextX, nextDir, nextSpeed, loss + field[y][nextX]])
        }
      }
      if (dir !== 2) {
        let nextX = x - 4
        let nextDir = 2
        let nextSpeed = 3
        if (!(`${nextX},${y},${nextDir},${nextSpeed}` in visited) && 0 <= nextX) {
          visited[`${nextX},${y},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${nextX},${y},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([
            y,
            nextX,
            nextDir,
            nextSpeed,
            loss + field[y][x - 1] + field[y][x - 2] + field[y][x - 3] + field[y][x - 4],
          ])
        }
      }
    }

    // add up
    if (dir !== 1) {
      if (dir === 3 && speed < 9) {
        let nextY = y - 1
        let nextDir = 3
        let nextSpeed = dir === 3 ? speed + 1 : 0
        if (!(`${x},${nextY},${nextDir},${nextSpeed}` in visited) && 0 <= nextY) {
          visited[`${x},${nextY},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${x},${nextY},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([nextY, x, nextDir, nextSpeed, loss + field[nextY][x]])
        }
      }
      if (dir !== 3) {
        let nextY = y - 4
        let nextDir = 3
        let nextSpeed = 3
        if (!(`${x},${nextY},${nextDir},${nextSpeed}` in visited) && 0 <= nextY) {
          visited[`${x},${nextY},${nextDir},${nextSpeed}`] = [
            ...visited[`${x},${y},${dir},${speed}`],
            `${x},${nextY},${nextDir},${nextSpeed}`,
          ]
          possiblePoints.push([
            nextY,
            x,
            nextDir,
            nextSpeed,
            loss + field[y - 1][x] + field[y - 2][x] + field[y - 3][x] + field[y - 4][x],
          ])
        }
      }
    }
  }

  return 'oops'
}
