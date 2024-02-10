import {getG, isC, isCS, isCSC, isR, isRS, isRSC, isS, isSS, isSSC, mT} from "../queries/MapQueries.ts"
import {MARGIN_X, S_SPACING} from "../state/Consts.ts"
import {M, T} from "../state/MapStateTypes"

export const mapPlaceExploded = (m: M) => {
  const g = getG(m)
  const mHash = new Map<string, T>(m.map(ti => [ti.nodeId, ti as T]))
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        ti.nodeStartX = ti.offsetW
        ti.nodeStartY = ti.offsetH
        break
      }
      case isS(ti.path): {
        const i = ti.path.at(-1)
        const si1 = mHash.get(ti.tsi1)!
        const tsu = ti.tsu.map(nid => mHash.get(nid)) as T[]
        const elapsed = tsu.map(ti => ti.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.tso2.length || si1.tco2.length)
        if (isRS(ti.path)) {
          ti.nodeStartX = MARGIN_X + si1.nodeStartX
          ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
        } else if (isSS(ti.path)) {
          ti.nodeStartX = si1.nodeStartX + si1.selfW + g.sLineDeltaXDefault
          ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
        } else if (isCS(ti.path)) {
          ti.nodeStartX = si1.nodeStartX + 2
          ti.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + ti.maxH / 2 - ti.selfH / 2 + elapsed
        }
        break
      }
      case isC(ti.path): {
        const si1 = mHash.get(ti.tsi1)!
        const si2 = mHash.get(ti.tsi2)!
        if (isRSC(ti.path)) {
          ti.nodeStartX = MARGIN_X + si2.nodeStartX + ti.calcOffsetX
          ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
        } else if (isSSC(ti.path)) {
          ti.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + ti.calcOffsetX
          ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
        } else if (isCSC(ti.path)) {
          ti.nodeStartX = si2.nodeStartX + 2
          ti.nodeStartY = si1.nodeStartY + ti.calcOffsetY
        }
        break
      }
    }
  })
}
