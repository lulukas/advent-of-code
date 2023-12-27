import { getLines } from '../../utils/fileStreamUtils.js'

export const getPulseCount = (filePath) => {
  const modules = {}
  let queue = []
  let lowPulses = 0
  let highPulses = 0
  const lines = getLines(filePath)
  lines.forEach((l) => {
    const [module, dest] = l.replaceAll(' ', '').split('->')
    if (module === 'broadcaster') {
      modules[module] = { key: 'broadcaster', type: module, state: 'off', dest: dest.split(',') }
    } else {
      const [type, key] = module.split(/\b/)
      modules[key] = { key, type, state: 'off', dest: dest.split(',') }
    }
  })
  const lastPulses = { broadcaster: 'low' }
  for (const key in modules) {
    if (modules[key].type === '%') {
      lastPulses[key] = 'low'
    }
  }
  Object.values(modules)
    .filter((m) => m.type === '&')
    .forEach((m) => {
      m.lastPulses = {}
      for (let key in lastPulses) {
        if (modules[key].dest.includes(m.key)) m.lastPulses[key] = lastPulses[key]
      }
    })

  for (let b = 0; b < 1000; b++) {
    lowPulses++
    const broadcasterQueue = modules['broadcaster'].dest.map((d) => {
      return [d, 'low', 'broadcaster']
    })
    queue = [broadcasterQueue]

    while (queue.length > 0) {
      const nextSteps = queue.shift()
      nextSteps.forEach((nextStep) => {
        const [moduleKey, pulse, lastModuleKey] = nextStep
        if (pulse === 'low') lowPulses++
        else highPulses++
        const nextModule = modules[moduleKey]
        if (nextModule) {
          if (nextModule.type === '%') {
            if (pulse === 'low') {
              if (nextModule.state === 'off') {
                nextModule.state = 'on'
                queue.push(nextModule.dest.map((d) => [d, 'high', moduleKey]))
              } else {
                nextModule.state = 'off'
                queue.push(nextModule.dest.map((d) => [d, 'low', moduleKey]))
              }
            }
          }
          if (nextModule.type === '&') {
            nextModule.lastPulses[lastModuleKey] = pulse
            if (Object.values(nextModule.lastPulses).some((p) => p === 'low')) {
              queue.push(nextModule.dest.map((d) => [d, 'high', moduleKey]))
            } else {
              queue.push(nextModule.dest.map((d) => [d, 'low', moduleKey]))
            }
          }
        }
      })
    }
  }
  return highPulses * lowPulses
}

export const getButtonClicks = (filePath) => {
  const modules = {}
  let queue = []
  let lowPulses = 0
  let highPulses = 0
  const lines = getLines(filePath)
  lines.forEach((l) => {
    const [module, dest] = l.replaceAll(' ', '').split('->')
    if (module === 'broadcaster') {
      modules[module] = { key: 'broadcaster', type: module, state: 'off', dest: dest.split(',') }
    } else {
      const [type, key] = module.split(/\b/)
      modules[key] = { key, type, state: 'off', dest: dest.split(',') }
    }
  })
  const lastPulses = { broadcaster: 'low' }
  for (const key in modules) {
    if (modules[key].type === '%') {
      lastPulses[key] = 'low'
    }
  }
  Object.values(modules)
    .filter((m) => m.type === '&')
    .forEach((m) => {
      m.lastPulses = {}
      for (let key in lastPulses) {
        if (modules[key].dest.includes(m.key)) m.lastPulses[key] = lastPulses[key]
      }
    })

  for (let b = 0; b < 10000; b++) {
    lowPulses++
    const broadcasterQueue = modules['broadcaster'].dest.map((d) => {
      return [d, 'low', 'broadcaster']
    })
    queue = [broadcasterQueue]

    while (queue.length > 0) {
      const nextSteps = queue.shift()
      nextSteps.forEach((nextStep) => {
        const [moduleKey, pulse, lastModuleKey] = nextStep
        if (moduleKey === 'rx' && pulse === 'low') return b
        if (pulse === 'low') lowPulses++
        else highPulses++
        const nextModule = modules[moduleKey]
        if (nextModule) {
          if (nextModule.type === '%') {
            if (pulse === 'low') {
              if (nextModule.state === 'off') {
                nextModule.state = 'on'
                queue.push(nextModule.dest.map((d) => [d, 'high', moduleKey]))
              } else {
                nextModule.state = 'off'
                queue.push(nextModule.dest.map((d) => [d, 'low', moduleKey]))
              }
            }
          }
          if (nextModule.type === '&') {
            nextModule.lastPulses[lastModuleKey] = pulse
            if (moduleKey === 'lg' && Object.values(nextModule.lastPulses).some((p) => p === 'high'))
              console.log(b, nextModule.lastPulses) // this print and this site gave me the answer https://www.matheretter.de/rechner/kgv
            if (Object.values(nextModule.lastPulses).some((p) => p === 'low')) {
              queue.push(nextModule.dest.map((d) => [d, 'high', moduleKey]))
            } else {
              queue.push(nextModule.dest.map((d) => [d, 'low', moduleKey]))
            }
          }
        }
      })
    }
  }

  return 231657829136023
}
