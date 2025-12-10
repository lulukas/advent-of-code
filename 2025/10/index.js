import { i, min, re } from 'mathjs'
import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  return lines.map((line) => getButtonPressesForLights(line)).reduce((a, b) => a + b, 0)
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)
  return lines
    .map((line) => {
      console.log('🚀 ~ getPart2 ~ line:', line)
      const result = getButtonPressesForJoltage(line)
      console.log('🚀 ~ getPart2 ~ result:', result)
      return result
    })
    .reduce((a, b) => a + b, 0)
}

const getButtonPressesForLights = (line) => {
  const target = [...line.matchAll(/\[([^}]*)\]/g)].map((m) => m[1])[0]
  const buttons = [...line.matchAll(/\(([^)]*)\)/g)].map((m) => m[1])
  let toCheck = [{ lights: '.'.repeat(target.length), presses: 0 }]
  const visited = new Set()

  while (toCheck.length > 0) {
    const newToCheck = []
    for (let panel of toCheck) {
      for (let button of buttons) {
        button = button.split(',').map(Number)
        let newLights = panel.lights
          .split('')
          .map((l, idx) => (button.includes(idx) ? (l === '.' ? '#' : '.') : l))
          .join('')
        if (newLights === target) {
          return panel.presses + 1
        }
        if (visited.has(newLights)) {
          continue
        }
        visited.add(newLights)
        newToCheck.push({ lights: newLights, presses: panel.presses + 1 })
      }
    }
    toCheck = [...newToCheck]
  }
}

const getButtonPressesForJoltage = (line) => {
  const target = [...line.matchAll(/\{([^}]*)\}/g)]
    .map((m) => m[1])[0]
    .split(',')
    .map(Number)
  const buttons = [...line.matchAll(/\(([^)]*)\)/g)].map((m) => m[1].split(',').map(Number))

  let result = 0

  const recurse = (target, buttons, presses) => {
    if (target.every((t) => t === 0)) {
      result = presses
      return presses
    }

    const minTargetSize = Math.min(...target.filter((t) => t > 0))
    const minTargetIndex = target.findIndex((t) => t === minTargetSize)
    const buttonIndex = buttons.findIndex((b) => b.includes(minTargetIndex))

    const button = buttons[buttonIndex]
    const remainingButtons = buttons.filter((_, idx) => idx !== buttonIndex)

    if (buttonIndex === -1) {
      return 0
    }

    for (let i = minTargetSize; i >= 0; i--) {
      if (
        recurse(
          target.map((t, idx) => (button.includes(idx) ? t - i : t)),
          remainingButtons,
          presses + i
        ) > 0
      ) {
        return presses + i
      }
    }

    return 0
  }

  recurse(target, buttons, 0)
  return result
}

const getButtonPressesForJoltage2 = (line) => {
  const target = [...line.matchAll(/\{([^}]*)\}/g)]
    .map((m) => m[1])[0]
    .split(',')
    .map(Number)
  const buttons = [...line.matchAll(/\(([^)]*)\)/g)].map((m) => m[1].split(',').map(Number))
  const visited = new Set()
  let toCheck = [
    {
      joltage: Array(target.length).fill(0),
      presses: 0,
      buttons: [...buttons],
    },
  ]

  while (toCheck.length > 0) {
    const newToCheck = []
    for (let panel of toCheck) {
      for (let i = 0; i < panel.buttons.length; i++) {
        let button = [...panel.buttons[i]]
        button.pressed += 1
        let newJoltage = panel.joltage.map((l, idx) => (button.includes(idx) ? l + 1 : l))
        let incorrectJoltageIndexes = []
        for (let j = 0; j < newJoltage.length; j++) {
          if (newJoltage[j] !== target[j]) {
            incorrectJoltageIndexes.push(j)
          }
        }

        if (incorrectJoltageIndexes.length === 0) {
          return panel.presses + 1
        }

        if (visited.has(newJoltage.join(','))) {
          continue
        }
        visited.add(newJoltage.join(','))

        let newButtons = [...panel.buttons.filter((b) => b.every((idx) => incorrectJoltageIndexes.includes(idx)))]

        newToCheck.push({
          joltage: newJoltage,
          presses: panel.presses + 1,
          buttons: newButtons,
        })
      }
    }
    toCheck = [...newToCheck]
  }

  return 0
}
