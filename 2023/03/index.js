import { getLines } from '../../utils/fileStreamUtils.js'

const hasSymbol = (string) => string.match(/[^\d.]/g)

export const getPartNumbers = (filePath) => {
  let totalCount = 0

  const lines = getLines(filePath)

  lines.forEach((line, lineIndex) => {
    const numbers = line.match(/\d+/g)
    let nextIndex = 0
    numbers?.forEach((number) => {
      const numberIndex = line.indexOf(number, nextIndex)
      const upperLine = lineIndex > 0 ? lines[lineIndex - 1] : undefined
      const lowerLine = lineIndex < lines.length ? lines[lineIndex + 1] : undefined

      const searchRange = {
        start: numberIndex > 0 ? numberIndex - 1 : 0,
        end: numberIndex + number.length < line.length ? numberIndex + number.length + 1 : line.length,
      }
      if (
        (upperLine && hasSymbol(upperLine.substring(searchRange.start, searchRange.end))) ||
        (line && hasSymbol(line.substring(searchRange.start, searchRange.end))) ||
        (lowerLine && hasSymbol(lowerLine.substring(searchRange.start, searchRange.end)))
      ) {
        totalCount += +number
      }
      nextIndex = numberIndex + number.length
    })
  })

  return totalCount
}

const hasGear = (string) => string.match(/\*/)

export const getGearRatio = (filePath) => {
  const lines = getLines(filePath)

  const gears = {}

  let totalGearCount = 0

  lines.forEach((line, lineIndex) => {
    const numbers = line.match(/\d+/g)
    let nextIndex = 0
    numbers?.forEach((number) => {
      const numberIndex = line.indexOf(number, nextIndex)
      const upperLine = lineIndex > 0 ? lines[lineIndex - 1] : undefined
      const lowerLine = lineIndex < lines.length ? lines[lineIndex + 1] : undefined

      const searchRange = {
        start: numberIndex > 0 ? numberIndex - 1 : 0,
        end: numberIndex + number.length < line.length ? numberIndex + number.length + 1 : line.length,
      }
      if (upperLine && hasGear(upperLine.substring(searchRange.start, searchRange.end))) {
        const gearIndex = hasGear(upperLine.substring(searchRange.start, searchRange.end)).index + searchRange.start
        gears[`${lineIndex - 1}_${gearIndex}`]
          ? gears[`${lineIndex - 1}_${gearIndex}`].push(+number)
          : (gears[`${lineIndex - 1}_${gearIndex}`] = [+number])
      }
      if (line && hasGear(line.substring(searchRange.start, searchRange.end))) {
        const gearIndex = hasGear(line.substring(searchRange.start, searchRange.end)).index + searchRange.start
        gears[`${lineIndex}_${gearIndex}`]
          ? gears[`${lineIndex}_${gearIndex}`].push(+number)
          : (gears[`${lineIndex}_${gearIndex}`] = [+number])
      }
      if (lowerLine && hasGear(lowerLine.substring(searchRange.start, searchRange.end))) {
        const gearIndex = hasGear(lowerLine.substring(searchRange.start, searchRange.end)).index + searchRange.start
        gears[`${lineIndex + 1}_${gearIndex}`]
          ? gears[`${lineIndex + 1}_${gearIndex}`].push(+number)
          : (gears[`${lineIndex + 1}_${gearIndex}`] = [+number])
      }

      nextIndex = numberIndex + number.length
    })
  })

  Object.values(gears).forEach((values) => {
    if (values.length === 2) {
      totalGearCount += values[0] * values[1]
    }
  })

  return totalGearCount
}
