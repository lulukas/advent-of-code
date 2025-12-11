import { count, min, re } from 'mathjs'
import { getLines } from '../../utils/fileStreamUtils.js'
import { memoize } from '../../utils/utils.js'

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
  let buttons = [...line.matchAll(/\(([^)]*)\)/g)]
    .map((m) => m[1].split(',').map(Number))
    .sort((a, b) => b.length - a.length)

  const buttonsAffectingIndex = []

  for (let i = 0; i < target.length; i++) {
    buttonsAffectingIndex[i] = buttons.filter((b) => b.includes(i))
    buttons = buttons.filter((b) => !b.includes(i))
  }

  const table = Array(target.length + 1)
    .fill(0)
    .map(() => [])
  table[0] = ['0:' + target.join(',')]

  for (let i = 0; i < target.length; i++) {
    for (let state of table[i]) {
      const [pressesStr, ...joltageStrs] = state.split(':')
      const presses = Number(pressesStr)
      const joltage = joltageStrs[0].split(',').map(Number)
      const newCombinations = findAllCombinations(presses, joltage, i, buttonsAffectingIndex[i])
      for (let combo of newCombinations) {
        let tableIndex = combo.joltage.findIndex((t) => t > 0)
        const comboStr = combo.presses + ':' + combo.joltage.join(',')
        if (tableIndex === -1) {
          tableIndex = table.length - 1
        }
        if (!table[tableIndex].includes(comboStr)) {
          table[tableIndex].push(comboStr)
        }
      }
      console.log('🚀 ~ getButtonPressesForJoltage ~ table:', table)
    }
  }

  return table[table.length - 1].map((s) => Number(s.split(':')[0])).sort((a, b) => a - b)[0]
}

const findAllCombinations = (presses, joltage, index, buttons) => {
  const newPresses = joltage[index]
  const results = []
  let queue = [joltage]

  for (let i = 0; i < buttons.length; i++) {
    let newQueue = []
    for (let jol of queue) {
      const button = buttons[i]
      const maxPresses = Math.min(...jol.filter((t, idx) => button.includes(idx)))
      for (let pressesCount = maxPresses; pressesCount >= 0; pressesCount--) {
        const newJoltage = jol.map((t, idx) => (button.includes(idx) ? t - pressesCount : t))
        if (newJoltage[index] === 0) {
          results.push({ presses: presses + newPresses, joltage: newJoltage })
        } else {
          newQueue.push(newJoltage)
        }
      }
    }
    queue = [...newQueue]
  }

  return results
}

const getButtonPressesForJoltage2 = (line) => {
  const target = [...line.matchAll(/\{([^}]*)\}/g)]
    .map((m) => m[1])[0]
    .split(',')
    .map(Number)
  const buttons = [...line.matchAll(/\(([^)]*)\)/g)]
    .map((m) => m[1].split(',').map(Number))
    .sort((a, b) => b.length - a.length)

  let count = 0
  const queue = [{ joltage: target, presses: [] }]
  while (queue.length > 0) {
    const { joltage, presses } = queue.shift()

    const minTargetSize = Math.min(...joltage.filter((t) => t > 0))
    count++
    const minTargetIndexs = joltage.map((t, idx) => (t === minTargetSize ? idx : -1)).filter((idx) => idx >= 0)

    const filteredButtons = buttons.filter((b) => b.some((idx) => minTargetIndexs.includes(idx)))

    for (let button of filteredButtons) {
      const newJoltage = joltage.map((t, idx) => (button.includes(idx) ? t - minTargetSize : t))
      if (newJoltage.every((t) => t === 0)) {
        console.log('🚀 ~ getButtonPressesForJoltage ~ count:', count)
        const newPresses = [...presses, ...Array(minTargetSize).fill(button)]
        return newPresses.length
      }
      if (newJoltage.some((t) => t < 0)) {
        const newPresses = [...presses]
        newPresses.shift()
        queue.push({ joltage: newJoltage, presses: newPresses })
      } else {
        const newPresses = [...presses, ...Array(minTargetSize).fill(button)]
        queue.push({ joltage: newJoltage, presses: newPresses })
      }
    }
    queue.sort((a, b) => a.presses.length - b.presses.length)
  }
  console.log('🚀 ~ getButtonPressesForJoltage ~ filteredButtons.length === 0')

  return -1
}

const getButtonPressesForJoltage3 = (line) => {
  const target = [...line.matchAll(/\{([^}]*)\}/g)]
    .map((m) => m[1])[0]
    .split(',')
    .map(Number)
  const initButtons = [...line.matchAll(/\(([^)]*)\)/g)]
    .map((m) => m[1].split(',').map(Number))
    .sort((a, b) => b.length - a.length)

  let count = 0

  const recurse = (target, buttons) => {
    count++
    if (target.every((t) => t === 0)) {
      return 0
    }

    if (buttons.length < 1) {
      return -1
    }

    if (
      buttons.some(
        (b, i) =>
          b.every((idx) => !buttons.some((nb, ni) => ni !== i && nb.includes(idx))) &&
          target.some((t, ti) => b.includes(ti) && t !== target[b[0]])
      )
    ) {
      return -1
    }

    for (let i = 0; i < target.length - 1; i++) {
      if (target[i] === 0) continue
      for (let j = i + 1; j < target.length; j++) {
        if (target[i] !== target[j]) {
          if (buttons.every((b) => b.includes(i) === b.includes(j))) {
            return -1
          }
        }
      }
    }

    const minTargetSize = Math.min(...target.filter((t) => t > 0))
    const minTargetIndexs = target.map((t, idx) => (t === minTargetSize ? idx : -1)).filter((idx) => idx >= 0)
    const minTargetIndex = minTargetIndexs[0]

    const buttonIndexsAffectingMinTarget = buttons
      .map((b, i) => (b.includes(minTargetIndex) ? i : -1))
      .filter((i) => i >= 0)

    if (buttonIndexsAffectingMinTarget.length === 0) {
      return -1
    }

    return buttonIndexsAffectingMinTarget
      .map((buttonIndexAffectingMinTarget) =>
        getMinButtonPresses(target, minTargetSize, buttons, buttonIndexAffectingMinTarget)
      )
      .reduce((a, b) => (a >= 0 && b >= 0 ? Math.min(a, b) : a >= 0 ? a : b), -1)
  }

  const getMinButtonPresses = (target, minTargetSize, buttons, buttonIndexAffectingMinTarget) => {
    const button = buttons[buttonIndexAffectingMinTarget]
    buttons = buttons.filter((b, i) => i !== buttonIndexAffectingMinTarget)

    for (let i = minTargetSize; i >= 0; i--) {
      const newTarget = target.map((t, idx) => (button.includes(idx) ? t - i : t))
      const newButtons = buttons.filter((b) => b.every((idx) => newTarget[idx] > 0))

      const res = recurse(newTarget, newButtons)
      if (res >= 0) {
        return res + i
      }

      if (newTarget.some((t) => t > 0 && !buttons.some((b) => b.includes(newTarget.indexOf(t))))) {
        return -1
      }
    }
    return -1
  }

  let result = recurse(target, initButtons)
  return result
}
