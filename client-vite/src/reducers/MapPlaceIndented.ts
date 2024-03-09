import {getHN, isC, isCS, isR, isRS, isRSC, isS, isSS, isSSC} from "../queries/MapQueries.ts"
import {INDENT, MARGIN_X, S_SPACING} from "../state/Consts.ts"
import {M, R, S, C} from "../state/MapStateTypes"

export const mapPlaceIndented = (m: M) => {
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
          const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(ri1.co.length)
          si.nodeStartX = MARGIN_X + ri1.nodeStartX
          si.nodeStartY = ri1.nodeStartY + ri1.selfH / 2 - ri1.familyH / 2  + elapsed
        } else if (isSS(si.path)) {
          const si1 = hn.get(si.si1) as S
          const su = si.su.map(nid => hn.get(nid)) as S[]
          const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.co.length)
          si.nodeStartX = si1.nodeStartX + INDENT
          si.nodeStartY = si1.nodeStartY + si1.selfH + elapsed
        } else if (isCS(si.path)) {
          const ci1 = hn.get(si.ci1) as C
          const su = si.su.map(nid => hn.get(nid)) as S[]
          const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0)
          si.nodeStartX = ci1.nodeStartX + 2
          si.nodeStartY = ci1.nodeStartY + ci1.selfH / 2 - ci1.familyH / 2  + elapsed
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        const si1 = hn.get(ci.si1) as C
        const si2 = hn.get(ci.si2) as C
        const cl = ci.cl.map(nid => hn.get(nid)) as C[]
        const cu = ci.cu.map(nid => hn.get(nid)) as C[]
        const calcOffsetX = cl.reduce((a, b) => a + b.selfW, 0)
        const calcOffsetY = cu.reduce((a, b) => a + b.selfH, 0)
        if (isRSC(ci.path)) {
          ci.nodeStartX = MARGIN_X + si2.nodeStartX + calcOffsetX
          ci.nodeStartY = si1.nodeStartY + calcOffsetY
        } else if (isSSC(ci.path)) {
          ci.nodeStartX = si2.nodeStartX + INDENT + 2 + calcOffsetX
          ci.nodeStartY = si1.nodeStartY + calcOffsetY
        }
        break
      }
    }
  })
}
