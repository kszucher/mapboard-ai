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
        if (isRS(si.path)) {
          const ri1 = hn.get(si.ri1) as R
          const su = si.su.map(nid => hn.get(nid)) as S[]
          const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(ri1.so.length > ri1.so1.length || ri1.co.length)
          si.nodeStartX = MARGIN_X + ri1.nodeStartX
          si.nodeStartY = ri1.nodeStartY + ri1.selfH / 2 - ri1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
        } else if (isSS(si.path)) {
          const si1 = hn.get(si.si1) as S
          const su = si.su.map(nid => hn.get(nid)) as S[]
          const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.so.length > si1.so1.length || si1.co.length)
          si.nodeStartX = si1.nodeStartX + si1.selfW + g.sLineDeltaXDefault
          si.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
        } else if (isCS(si.path)) {
          const ci1 = hn.get(si.ci1) as C
          const su = si.su.map(nid => hn.get(nid)) as S[]
          const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(ci1.so.length > ci1.so1.length)
          si.nodeStartX = ci1.nodeStartX + 2
          si.nodeStartY = ci1.nodeStartY + ci1.selfH / 2 - ci1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        const cl = ci.cl.map(nid => hn.get(nid)) as C[]
        const cu = ci.cu.map(nid => hn.get(nid)) as C[]
        const calcOffsetX = cl.reduce((a, b) => a + b.selfW, 0)
        const calcOffsetY = cu.reduce((a, b) => a + b.selfH, 0)
        if (isRSC(ci.path)) {
          const ri2 = hn.get(ci.ri2) as R
          const si1 = hn.get(ci.si1) as S
          ci.nodeStartX = MARGIN_X + ri2.nodeStartX + calcOffsetX
          ci.nodeStartY = si1.nodeStartY + calcOffsetY
        } else if (isSSC(ci.path)) {
          const si2 = hn.get(ci.si2) as S
          const si1 = hn.get(ci.si1) as S
          ci.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + calcOffsetX
          ci.nodeStartY = si1.nodeStartY + calcOffsetY
        }
        break
      }
    }
  })
}
