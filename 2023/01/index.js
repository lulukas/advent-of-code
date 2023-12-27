import { getFileStreamPromise } from '../../utils/fileStreamUtils.js'
/*
Part 1
As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

--- Part Two ---
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

*/

const getDigit = (string) => {
  switch (string) {
    case 'one':
      return '1'
    case 'two':
      return '2'
    case 'three':
      return '3'
    case 'four':
      return '4'
    case 'five':
      return '5'
    case 'six':
      return '6'
    case 'seven':
      return '7'
    case 'eight':
      return '8'
    case 'nine':
      return '9'
    default:
      return string
  }
}

export const getCalibrationCode = (filePath) => {
  let calibrationCode = 0

  const handleLine = (line) => {
    const numbers = line.match(/\d/g)
    const calibrationValue = numbers ? numbers[0] + numbers[numbers.length - 1] : 0
    calibrationCode += +calibrationValue
  }

  const getResult = () => calibrationCode

  return getFileStreamPromise(filePath, handleLine, getResult)
}

export const getRealCalibrationCode = (filePath) => {
  let calibrationCode = 0

  const handleLine = (line) => {
    const numbers = []
    for (let i = 0; i < line.length; i++) {
      const substring = line.substring(i)
      const number1 = substring.match(/\d|one|two|three|four|five|six|seven|eight|nine/)
      number1 && numbers.push(getDigit(number1[0]))
    }
    const calibrationValue = numbers ? numbers[0] + numbers[numbers.length - 1] : 0
    calibrationCode += +calibrationValue
  }

  const getResult = () => calibrationCode

  return getFileStreamPromise(filePath, handleLine, getResult)
}
