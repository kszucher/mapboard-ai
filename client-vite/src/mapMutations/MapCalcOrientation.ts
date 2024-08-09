import {M} from "../state/MapStateTypes.ts"
import {mS} from "../mapQueries/MapQueries.ts"

export const mapCalcOrientation = (m: M) => {
  mS(m).forEach(si => {
    if (Object.keys(si.si1).length) {
      const i = si.path.at(-1)
      si.isTop = i === 0 && si.si1.isTop ? 1 : 0
      si.isBottom = i === si.si1.so1.length - 1 && si.si1.isBottom === 1 ? 1 : 0
    }
  })
}
