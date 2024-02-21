import {getG, getHN, isC, isCS, isR, isRS, isRSC, isS, isSS, isSSC} from "../queries/MapQueries.ts"
import {MARGIN_X, S_SPACING} from "../state/Consts.ts"
import {M, R, S, C} from "../state/MapStateTypes"

export const mapPlaceExploded = (m: M) => {
  const g = getG(m)
  const hn = getHN(m)
  m.forEach(ni => {
    switch (true) {
      case isR(ni.path): {
        const ri = ni as R
        ri.nodeStartX = ri.offsetW
        ri.nodeStartY = ri.offsetH
        break
      }
      case isS(ni.path): {
        const si = ni as S
        const i = si.path.at(-1)
        const si1 = hn.get(si.si1)!
        const su = si.su.map(nid => hn.get(nid)) as S[]
        const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.so2.length || si1.co2.length)
        if (isRS(si.path)) {
          si.nodeStartX = MARGIN_X + si1.nodeStartX
          si.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
        } else if (isSS(si.path)) {
          si.nodeStartX = si1.nodeStartX + si1.selfW + g.sLineDeltaXDefault
          si.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
        } else if (isCS(si.path)) {
          si.nodeStartX = si1.nodeStartX + 2
          si.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        const si1 = hn.get(ci.si1) as S
        const si2 = hn.get(ci.si2) as S
        const cl = ci.cl.map(nid => hn.get(nid)) as C[]
        const cu = ci.cu.map(nid => hn.get(nid)) as C[]
        const calcOffsetX = cl.reduce((a, b) => a + b.selfW, 0)
        const calcOffsetY = cu.reduce((a, b) => a + b.selfH, 0)
        if (isRSC(ci.path)) {
          ci.nodeStartX = MARGIN_X + si2.nodeStartX + calcOffsetX
          ci.nodeStartY = si1.nodeStartY + calcOffsetY
        } else if (isSSC(ci.path)) {
          ci.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + calcOffsetX
          ci.nodeStartY = si1.nodeStartY + calcOffsetY
        }
        break
      }
    }
  })
}
