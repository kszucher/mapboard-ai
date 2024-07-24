import {M, S} from "../state/MapStateTypes.ts"
import {getHN, mS} from "../mapQueries/MapQueries.ts"

export const mapCalcOrientation = (m: M) => {
  const hn = getHN(m)
  mS(m).forEach(si => {
    const si1 = hn.get(si.si1) as S
    if (si1) {
      const i = si.path.at(-1)
      si.isTop = i === 0 && si1.isTop ? 1 : 0
      si.isBottom = i === si1.so1.length - 1 && si1.isBottom === 1 ? 1 : 0
    }
  })
}
