import {M, T} from "../state/MapStateTypes.ts"
import {getHN, mS} from "../queries/MapQueries.ts"

export const mapCalcOrientation = (m: M) => {
  const hn = getHN(m)
  mS(m).forEach(ti => {
    const si1 = hn.get(ti.si1) as T
    const i = ti.path.at(-1)
    ti.isTop = i === 0 && si1.isTop ? 1 : 0
    ti.isBottom = i === si1.so1.length - 1 && si1.isBottom === 1 ? 1 : 0
  })
}
