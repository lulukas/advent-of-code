import { getFileStreamPromise } from '../../utils/fileStreamUtils.js'
/*
--- Part One ---

--- Part Two ---

*/

const getNumberFromText = (text) => +text.match(/\d+/)[0]
const getMostAmountOfCubes = (pv, nv) => (pv > nv ? pv : nv)
const getPowOfGame = (game) => game.reds * game.blues * game.greens
const getGameFromLine = (line) => ({
  gameIndex: +line.match(/Game \d+/g)?.map(getNumberFromText)[0],
  reds: line
    .match(/\d+ red/g)
    ?.map(getNumberFromText)
    .reduce(getMostAmountOfCubes, 0),
  greens: line
    .match(/\d+ green/g)
    ?.map(getNumberFromText)
    .reduce(getMostAmountOfCubes, 0),
  blues: line
    .match(/\d+ blue/g)
    ?.map(getNumberFromText)
    .reduce(getMostAmountOfCubes, 0),
})

export const getPossibleGames = (filePath) => {
  const REDS = 12
  const GREENS = 13
  const BLUES = 14

  let countOfPossibleGames = 0

  const handleLine = (line) => {
    const game = getGameFromLine(line)

    if (game.reds <= REDS && game.greens <= GREENS && game.blues <= BLUES) {
      countOfPossibleGames += +game.gameIndex
    }
  }

  const getResult = () => countOfPossibleGames

  return getFileStreamPromise(filePath, handleLine, getResult)
}

export const getGamePower = (filePath) => {
  let totalPower = 0

  const handleLine = (line) => {
    totalPower += getPowOfGame(getGameFromLine(line))
  }

  const getResult = () => totalPower

  return getFileStreamPromise(filePath, handleLine, getResult)
}
