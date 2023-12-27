import fs from 'fs'
import readline from 'readline'

export const getFileStreamPromise = (filePath, handleLine, getResult) =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Treat CRLF (\r\n) as a single line break
    })

    rl.on('line', handleLine)

    rl.on('close', () => {
      resolve(getResult())
    })
  })

export const getLines = (filePath) => fs.readFileSync(filePath, 'utf-8').split('\r\n')
