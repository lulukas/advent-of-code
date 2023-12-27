import { getCalibrationCode, getRealCalibrationCode } from './01/index.js'
import { getPossibleGames, getGamePower } from './02/index.js'
import { getGearRatio, getPartNumbers } from './03/index.js'
import { getTotalScratchcardCount, getTotalScratchcardPoints } from './04/index.js'
import { getLocation, getLocations } from './05/index.js'
import { getPossibleWinsLong, getPossibleWinsShort } from './06/index.js'
import { getTotalWins, getTotalWinsWithJoker } from './07/index.js'
import { findShortestWay, findShortestWayForGosts } from './08/index.js'
import { getNextExtrapolation, getPreviousExtrapolation } from './09/index.js'
import { getEnclosed, getFurdest } from './10/index.js'
import { getDistances, getFarDistances } from './11/index.js'
import { getTotalPossibilities, getTotalPossibilitiesTimesfive } from './12/index.js'
import { getMirrors, getMirrorsWithSmudge } from './13/index.js'
import { getWeightAfterManyTilt, getWeightAfterTilt } from './14/index.js'
import { getFocalPower, getTotalHashes } from './15/index.js'
import { getBestEnergizingPath, getEnergizingPath } from './16/index.js'
import { getHeatLoss, getHeatLossFast } from './17/index.js'
import { getCorrectHoleSize, getHoleSize } from './18/index.js'
import { getSortableParts, getSortedParts } from './19/index.js'
import { getButtonClicks, getPulseCount } from './20/index.js'
import { get26501365steps, get64steps } from './21/index.js'
import { getCollabsingBricks, getRemovableBricks } from './22/index.js'
import { getLongestHike, getLongestHikeIcy } from './23/index.js'
import { getIntersectingLines, getIntersectionPoints } from './24/index.js'
import { getPart1 } from './25/index.js'

export const solutions = {
  '01': [getCalibrationCode, getRealCalibrationCode],
  '02': [getPossibleGames, getGamePower],
  '03': [getPartNumbers, getGearRatio],
  '04': [getTotalScratchcardPoints, getTotalScratchcardCount],
  '05': [getLocation, getLocations],
  '06': [getPossibleWinsShort, getPossibleWinsLong],
  '07': [getTotalWins, getTotalWinsWithJoker],
  '08': [findShortestWay, findShortestWayForGosts],
  '09': [getNextExtrapolation, getPreviousExtrapolation],
  10: [getFurdest, getEnclosed],
  11: [getDistances, getFarDistances],
  12: [getTotalPossibilities, getTotalPossibilitiesTimesfive],
  13: [getMirrors, getMirrorsWithSmudge],
  14: [getWeightAfterTilt, getWeightAfterManyTilt],
  15: [getTotalHashes, getFocalPower],
  16: [getEnergizingPath, getBestEnergizingPath],
  17: [getHeatLoss, getHeatLossFast],
  18: [getHoleSize, getCorrectHoleSize],
  19: [getSortedParts, getSortableParts],
  20: [getPulseCount, getButtonClicks],
  21: [get64steps, get26501365steps],
  22: [getRemovableBricks, getCollabsingBricks],
  23: [getLongestHikeIcy, getLongestHike],
  24: [getIntersectionPoints, getIntersectingLines],
  25: [getPart1],
}
