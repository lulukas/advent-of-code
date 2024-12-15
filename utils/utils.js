export const memoize = (func) => {
  const cache = new Map()

  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }
}

export const rotateRight = (field) => {
  const swaped = [[]]
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (swaped[j]) swaped[j] = field[i][j] + swaped[j]
      else swaped[j] = field[i][j]
    }
  }
  return swaped
}

export const rotateLeft = (field) => {
  const swaped = [[]]
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (swaped[field.length - i - 1]) swaped[field.length - i - 1] = swaped[field.length - i - 1] + field[j][i]
      else swaped[field.length - i - 1] = field[j][i]
    }
  }
  return swaped
}

export const printField = (string, field) => {
  console.log('🚀 ~ file: utils.js:39 ~ printField ~ string:', string)
  field.forEach((element) => {
    console.log(element)
  })
}
export const printFieldArray = (string, field) => {
  console.log(string)
  field.forEach((element) => {
    console.log(element.join(' '))
  })
}
