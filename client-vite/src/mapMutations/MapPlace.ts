import {getG, getHN} from "../mapQueries/MapQueries.ts"
import {INDENT, MARGIN_X, S_SPACING} from "../state/Consts.ts"
import {C, M, R, S} from "../state/MapStateTypes"
import {Flow} from "../state/Enums.ts"
import {isC, isCS, isR, isRS, isRSC, isS, isSS, isSSC} from "../mapQueries/PathQueries.ts";

export const mapPlace = (m: M) => {
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
          const ri1 = si.ri1
          const su = si.su.map(nid => hn.get(nid)) as S[]
          if (g.flow === Flow.EXPLODED) {
            const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(ri1.so.length > ri1.so1.length || ri1.co.length)
            si.nodeStartX = MARGIN_X + ri1.nodeStartX
            si.nodeStartY = ri1.nodeStartY + ri1.selfH / 2 - ri1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
          } else {
            const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(ri1.co.length)
            si.nodeStartX = MARGIN_X + ri1.nodeStartX
            si.nodeStartY = ri1.nodeStartY + ri1.selfH / 2 - ri1.familyH / 2  + elapsed
          }
        } else if (isSS(si.path)) {
          const si1 = hn.get(si.si1) as S
          const su = si.su.map(nid => hn.get(nid)) as S[]
          if (g.flow === Flow.EXPLODED) {
            const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.so.length > si1.so1.length || si1.co.length)
            si.nodeStartX = si1.nodeStartX + si1.selfW + g.sLineDeltaXDefault
            si.nodeStartY = si1.nodeStartY + si1.selfH / 2 - si1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
          } else {
            const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(si1.co.length)
            si.nodeStartX = si1.nodeStartX + INDENT
            si.nodeStartY = si1.nodeStartY + si1.selfH + elapsed
          }
        } else if (isCS(si.path)) {
          const ci1 = hn.get(si.ci1) as C
          const su = si.su.map(nid => hn.get(nid)) as S[]
          if (g.flow === Flow.EXPLODED) {
            const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0) + i * S_SPACING * +Boolean(ci1.so.length > ci1.so1.length)
            si.nodeStartX = ci1.nodeStartX + 2
            si.nodeStartY = ci1.nodeStartY + ci1.selfH / 2 - ci1.familyH / 2 + si.maxH / 2 - si.selfH / 2 + elapsed
          } else {
            const elapsed = su.map(si => si.maxH).reduce((a, b) => a + b, 0)
            si.nodeStartX = ci1.nodeStartX + 2
            si.nodeStartY = ci1.nodeStartY + ci1.selfH / 2 - ci1.familyH / 2  + elapsed
          }
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
          if (g.flow === Flow.EXPLODED) {
            ci.nodeStartX = MARGIN_X + ri2.nodeStartX + calcOffsetX
            ci.nodeStartY = si1.nodeStartY + calcOffsetY
          } else {
            ci.nodeStartX = MARGIN_X + ri2.nodeStartX + calcOffsetX
            ci.nodeStartY = si1.nodeStartY + calcOffsetY
          }
        } else if (isSSC(ci.path)) {
          const si2 = hn.get(ci.si2) as S
          const si1 = hn.get(ci.si1) as S
          if (g.flow === Flow.EXPLODED) {
            ci.nodeStartX = si2.nodeStartX + si2.selfW + g.sLineDeltaXDefault + calcOffsetX
            ci.nodeStartY = si1.nodeStartY + calcOffsetY
          } else {
            ci.nodeStartX = si2.nodeStartX + INDENT + 2 + calcOffsetX
            ci.nodeStartY = si1.nodeStartY + calcOffsetY
          }
        }
        break
      }
    }
  })
}
