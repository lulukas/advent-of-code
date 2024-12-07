import { getLines } from '../../utils/fileStreamUtils.js'

export const getPart1 = (filePath) => {
  const lines = getLines(filePath)

  let result = 0

  lines.forEach((line) => {
    let [testvalue, operators] = line.split(': ')
    testvalue = +testvalue
    operators = operators.split(' ').map((x) => +x)
    let possibleresults = [operators[0]]
    for (let i = 1; i < operators.length; i++) {
      possibleresults = possibleresults.reduce((pv, nv) => {
        if (nv + operators[i] <= testvalue) pv.push(nv + operators[i])
        if (nv * operators[i] <= testvalue) pv.push(nv * operators[i])
        return pv
      }, [])
    }
    if (possibleresults.includes(testvalue)) {
      result += testvalue
    }
  })

  return result
}

export const getPart2 = (filePath) => {
  const lines = getLines(filePath)

  let result = 0

  lines.forEach((line) => {
    let [testvalue, operators] = line.split(': ')
    testvalue = +testvalue
    operators = operators.split(' ').map((x) => +x)
    let possibleresults = [operators[0]]
    for (let i = 1; i < operators.length; i++) {
      possibleresults = possibleresults.reduce((pv, nv) => {
        if (nv + operators[i] <= testvalue) pv.push(nv + operators[i])
        if (nv * operators[i] <= testvalue) pv.push(nv * operators[i])
        if (+`${nv}${operators[i]}` <= testvalue) pv.push(+`${nv}${operators[i]}`)
        return pv
      }, [])
    }
    if (possibleresults.includes(testvalue)) {
      result += testvalue
    }
  })

  return result
}
