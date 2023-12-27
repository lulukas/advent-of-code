import { solutions as solutions2022 } from './2022/solutions.js'
import { solutions as solutions2023 } from './2023/solutions.js'
import { formatDuration, printPart1, printPart2, printResult, printTitle } from './utils/consoleUtils.js'

const [, , fileName, day, year = 2023] = process.argv

const solutions = {
  2022: solutions2022,
  2023: solutions2023,
}

const [solutionPart1, solutionPart2] = solutions[year][day]

const filePath = `./${year}/${day}/${fileName}`

printTitle()

console.log(`
  🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄  Day ${day} 🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄🎄
`)

if (solutionPart1) {
  const start = new Date()

  const result = await solutionPart1(filePath)

  const end = new Date()
  const duration = formatDuration(start, end)

  printResult(`Part 1: ${result}, took ${duration}`)
}

if (solutionPart2) {
  const start = new Date()

  const result = await solutionPart2(filePath)

  const end = new Date()
  const duration = formatDuration(start, end)

  printResult(`Part 2: ${result}, took ${duration}`)
}
