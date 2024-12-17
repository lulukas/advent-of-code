import { getLines } from '../../utils/fileStreamUtils.js'

let a = 0
let b = 0
let c = 0
let ip = 0
let program = []
let output = []

const parseComputer = (lines) => {
  a = +lines[0].replace('Register A: ', '')
  b = +lines[1].replace('Register B: ', '')
  c = +lines[2].replace('Register C: ', '')
  program = lines[4].replace('Program: ', '').split(',').map(Number)
}

const combo = (operand) => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand
    case 4:
      return a
    case 5:
      return b
    case 6:
      return c
    default:
      throw Error('No valid Operand')
  }
}

const xor = (x, y) => {
  x = BigInt(x)
  y = BigInt(y)
  return Number(x ^ y)
}

const adv = (operand) => {
  a = Math.trunc(a / 2 ** combo(operand))
  ip += 2
}
const bxl = (operand) => {
  b = xor(b, operand)
  ip += 2
}
const bst = (operand) => {
  b = combo(operand) % 8
  ip += 2
}
const jnz = (operand) => {
  if (a !== 0) {
    ip = operand
  } else {
    ip += 2
  }
}
const bxc = (operand) => {
  b = xor(b, c)
  ip += 2
}
const out = (operand) => {
  ip += 2
  output.push(combo(operand) % 8)
}
const bdv = (operand) => {
  b = Math.trunc(a / 2 ** combo(operand))
  ip += 2
}
const cdv = (operand) => {
  c = Math.trunc(a / 2 ** combo(operand))
  ip += 2
}

const opcode = [adv, bxl, bst, jnz, bxc, out, bdv, cdv]

export const getPart1 = (filePath) => {
  parseComputer(getLines(filePath))
  while (ip < program.length) {
    opcode[program[ip]](program[ip + 1])
  }
  return output
}

export const getPart2 = (filePath) => {
  parseComputer(getLines(filePath))

  let possibleA = [0]
  let possibleATemp = []
  let pointer = 0
  let result = 0
  while (pointer < program.length) {
    possibleA.forEach((pa) => {
      for (let i = 8 * pa; i < 8 * (pa + 1); i++) {
        a = i
        b = 0
        c = 0
        ip = 0
        output = []
        while (output.length < 1 && ip < program.length) {
          opcode[program[ip]](program[ip + 1])
        }
        if (output[0] === program[program.length - pointer - 1] && possibleA.includes(a)) {
          // console.log('🚀', pointer, output[0], program[program.length - pointer - 1], i, a, possibleA.includes(a))
          possibleATemp.push(i)
        }
      }
    })
    pointer++
    possibleA = [...possibleATemp]
    result = possibleATemp[0]
    possibleATemp = []
  }
  return result
}
