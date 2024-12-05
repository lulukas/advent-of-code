import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)
  let i = 0
  let rules = []
  while (lines[i] !== '') {
    const [x, y] = lines[i].split('|')
    const iX = rules.findIndex((rule) => rule.value === x)
    if (iX === -1) rules.push({ value: x, before: [y], after: [] })
    else rules[iX].before.push(y)

    const iY = rules.findIndex((rule) => rule.value === y)
    if (iY === -1) rules.push({ value: y, before: [], after: [x] })
    else rules[iY].after.push(x)

    i++
  }

  i++

  let result = 0

  while (lines[i]) {
    const pages = lines[i].split(',')
    let correct = true
    let j = 0

    while (correct === true && j < pages.length) {
      const before = j === 0 ? [] : pages.slice(0, j)
      const after = j === pages.length - 1 ? [] : pages.slice(j + 1)
      const rule = rules.find((r) => r.value === pages[j])

      if (rule.after.some((p) => after.includes(p)) || rule.before.some((p) => before.includes(p))) {
        correct = false
      }

      j++
    }

    if (correct) {
      result += +pages[(pages.length - 1) / 2]
    }

    i++
  }

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)

  let i = 0
  let rules = []
  let simpleRules = []
  while (lines[i] !== '') {
    simpleRules.push(lines[i])
    const [x, y] = lines[i].split('|')
    const iX = rules.findIndex((rule) => rule.value === x)
    if (iX === -1) rules.push({ value: x, before: [y], after: [] })
    else rules[iX].before.push(y)

    const iY = rules.findIndex((rule) => rule.value === y)
    if (iY === -1) rules.push({ value: y, before: [], after: [x] })
    else rules[iY].after.push(x)

    i++
  }

  i++

  let result = 0

  while (lines[i]) {
    const pages = lines[i].split(',')
    let correct = true
    let j = 0

    while (correct === true && j < pages.length) {
      const before = j === 0 ? [] : pages.slice(0, j)
      const after = j === pages.length - 1 ? [] : pages.slice(j + 1)
      const rule = rules.find((r) => r.value === pages[j])

      if (rule.after.some((p) => after.includes(p)) || rule.before.some((p) => before.includes(p))) {
        correct = false
      }

      j++
    }

    if (!correct) {
      const sortedPages = pages.sort((a, b) => (simpleRules.includes(a + '|' + b) ? 1 : -1))
      result += +sortedPages[(pages.length - 1) / 2]
    }

    i++
  }

  return result
}
