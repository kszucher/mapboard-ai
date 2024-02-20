import {getG, isC, isCS, isR, isRS, isRSC, isS, isSS, isSSC, mT} from "../queries/MapQueries.ts"
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
        const si1 = mHash.get(ti.si1)!
        const su = ti.su.map(nid => mHash.get(nid)) as T[]
        const elapsed = su.map(ti => ti.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.so2.length || si1.co2.length)
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
        const si1 = mHash.get(ti.si1) as T
        const si2 = mHash.get(ti.si2) as T
        const cl = ti.cl.map(nid => mHash.get(nid)) as T[]
        const cu = ti.cu.map(nid => mHash.get(nid)) as T[]
        const calcOffsetX = cl.reduce((a, b) => a + b.selfW, 0)
        const calcOffsetY = cu.reduce((a, b) => a + b.selfH, 0)
        if (isRSC(ti.path)) {
          ti.nodeStartX = MARGIN_X + si2.nodeStartX + calcOffsetX
          ti.nodeStartY = si1.nodeStartY + calcOffsetY
        } else if (isSSC(ti.path)) {
          ti.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + calcOffsetX
          ti.nodeStartY = si1.nodeStartY + calcOffsetY
        }
        break
      }
    }
  })
}
