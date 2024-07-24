import {getEquationDim, getTextDim} from "../components/map/MapDivUtils.ts"
import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getG, getHN, hasTask, isC, isG, isR, isS, mR} from "../mapQueries/MapQueries.ts"
import {C_SPACING, INDENT, MARGIN_X, MARGIN_Y, MIN_NODE_H, MIN_NODE_W, NODE_MARGIN_X_LARGE, NODE_MARGIN_X_SMALL, NODE_MARGIN_Y_LARGE, NODE_MARGIN_Y_SMALL, S_SPACING} from "../state/Consts"
import {Flow} from "../state/Enums.ts"
import {M, G, R, S, C} from "../state/MapStateTypes"

export const mapMeasure = (pm: M, m: M) => {
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  const minOffsetW = Math.min(...mR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mR(m).map(ri => ri.offsetH))
  mR(m).map(ri => Object.assign(ri, {
    offsetW: ri.offsetW - minOffsetW,
    offsetH: ri.offsetH - minOffsetH
  }))
  m.slice().reverse().forEach(ni => {
    switch (true) {
      case isG(ni.path): {
        const g = ni as G
        g.selfW = Math.max(...mR(m).map(ri => ri.offsetW + ri.selfW))
        g.selfH = Math.max(...mR(m).map(ri => ri.offsetH + ri.selfH))
        break
      }
      case isR(ni.path): {
        const ri = ni as R
        if (ri.so1.length) {
          const so1 = ri.so1.map(nid => hn.get(nid)) as S[]
          if (g.flow === Flow.EXPLODED) {
            ri.familyW = Math.max(...so1.map(si => si.maxW))
            ri.familyH = so1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ri.so1.length - 1) * +Boolean(ri.so.length > ri.so1.length || ri.co.length)
          } else if (g.flow === Flow.INDENTED) {
            ri.familyW = Math.max(...so1.map(si => si.maxW))
            ri.familyH = so1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ri.so1.length - 1) * +Boolean(ri.co.length)
          }
        }
        ri.selfW = ri.familyW + 2 * MARGIN_X + getTaskWidth(g) * hasTask(m, ri)
        ri.selfH = ri.familyH + 2 * MARGIN_Y
        break
      }
      case isS(ni.path): {
        const si = ni as S
        if (si.so1.length) {
          const so1 = si.so1.map(nid => hn.get(nid)) as S[]
          if (g.flow === Flow.EXPLODED) {
            si.familyW = Math.max(...so1.map(si => si.maxW)) + g.sLineDeltaXDefault
            si.familyH = so1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (si.so1.length - 1) * +Boolean(si.so.length > si.so1.length || si.co.length)
          } else if (g.flow === Flow.INDENTED) {
            si.familyW = Math.max(...so1.map(si => si.maxW)) + INDENT
            si.familyH = so1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (si.so1.length - 1) * +Boolean(si.co.length)
          }
        }
        if (si.co1.length) {
          const co1 = si.co1.map(nid => hn.get(nid)) as C[]
          co1.forEach(ci => {
            ci.selfW = Math.max(...ci.cv.map(ni => (hn.get(ni) as C).familyW + C_SPACING))
            ci.selfH = Math.max(...ci.ch.map(ni => (hn.get(ni) as C).familyH + C_SPACING))
          })
          si.selfW = co1.at(0)!.ch.map(nid => hn.get(nid) as S).reduce((a, b) => a + b.selfW, 0)
          si.selfH = co1.at(0)!.cv.map(nid => hn.get(nid) as S).reduce((a, b) => a + b.selfH, 0)
        }
        if (!si.co1.length) {
          const psi = phn.get(si.nodeId) as S
          if (
            si.content !== '' &&
            (
              si.dimW === 0 ||
              si.dimH === 0 ||
              (
                psi && (
                  psi.content !== si.content ||
                  psi.contentType !== si.contentType ||
                  psi.textFontSize !== si.textFontSize
                )
              )
            )
          ) {
            if (si.contentType === 'text') {
              const dim = getTextDim(si.content, si.textFontSize)
              si.dimW = dim[0]
              si.dimH = dim[1]
            } else if (si.contentType === 'equation') {
              const dim = getEquationDim(si.content)
              si.dimW = dim[0]
              si.dimH = dim[1]
            }
          }
          si.selfW = (si.dimW > 20 ? si.dimW : MIN_NODE_W) + (g.density === 'large' ? NODE_MARGIN_X_LARGE : NODE_MARGIN_X_SMALL)
          si.selfH = (si.dimH / 17 > 1 ? si.dimH : MIN_NODE_H) + (g.density === 'large' ? NODE_MARGIN_Y_LARGE : NODE_MARGIN_Y_SMALL)
        }
        if (g.flow === Flow.EXPLODED) {
          si.maxW = si.selfW + si.familyW
          si.maxH = Math.max(...[si.selfH, si.familyH])
        } else if (g.flow === Flow.INDENTED) {
          si.maxW = Math.max(...[si.selfW, si.familyW])
          si.maxH = si.selfH + si.familyH
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        if (ci.so1.length) {
          const so1 = ci.so1.map(nid => hn.get(nid)) as S[]
          if (g.flow === Flow.EXPLODED) {
            ci.familyW = Math.max(...so1.map(si => si.maxW)) + g.sLineDeltaXDefault
            ci.familyH = so1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ci.so1.length - 1) * +Boolean(ci.so.length > ci.so1.length)
          } else {
            ci.familyW = Math.max(...so1.map(si => si.maxW)) + INDENT
            ci.familyH = so1.reduce((a, b) => a + b.maxH, 0)
          }
        } else {
          ci.familyW = 60
          ci.familyH = 30
        }
        break
      }
    }
  })
}
