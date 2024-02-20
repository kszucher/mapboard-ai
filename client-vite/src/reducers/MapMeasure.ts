import {getEquationDim, getTextDim} from "../components/map/MapDivUtils.ts"
import {getTaskWidth} from "../components/map/MapSvgUtils"
import {getG, getHN, getTCO1C0, getTCO1R0,   hasTask, isC, isG, isR, isS, mGT, mTR} from "../queries/MapQueries.ts"
import {C_SPACING, INDENT, MARGIN_X, MARGIN_Y, MIN_NODE_H, MIN_NODE_W, NODE_MARGIN_X_LARGE, NODE_MARGIN_X_SMALL, NODE_MARGIN_Y_LARGE, NODE_MARGIN_Y_SMALL, S_SPACING} from "../state/Consts"
import {Flow} from "../state/Enums.ts"
import {M, T} from "../state/MapStateTypes"

export const mapMeasure = (pm: M, m: M) => {
  const hn = getHN(m)
  const phn = getHN(pm)
  const g = getG(m)
  const minOffsetW = Math.min(...mTR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mTR(m).map(ri => ri.offsetH))
  mTR(m).map(tri => Object.assign(tri, {
    offsetW: tri.offsetW - minOffsetW,
    offsetH: tri.offsetH - minOffsetH
  }))
  mGT(m).slice().reverse().forEach(ti => {
    switch (true) {
      case isG(ti.path): {
        ti.selfW = Math.max(...mTR(m).map(ri => ri.offsetW + ri.selfW))
        ti.selfH = Math.max(...mTR(m).map(ri => ri.offsetH + ri.selfH))
        break
      }
      case isR(ti.path): {
        if (ti.so1.length) {
          const tso1 = ti.so1.map(nid => hn.get(nid)) as T[]
          if (g.flow === Flow.EXPLODED) {
            ti.familyW = Math.max(...tso1.map(ti => ti.maxW))
            ti.familyH = tso1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ti.so1.length - 1) * +Boolean(ti.so2.length || ti.co2.length)
          } else if (g.flow === Flow.INDENTED) {
            ti.familyW = Math.max(...tso1.map(ti => ti.maxW))
            ti.familyH = tso1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ti.so1.length - 1) * +Boolean(ti.co2.length)
          }
        }
        ti.selfW = ti.familyW + 2 * MARGIN_X + getTaskWidth(g) * hasTask(m, ti)
        ti.selfH = ti.familyH + 2 * MARGIN_Y
        break
      }
      case isS(ti.path): {
        if (ti.so1.length) {
          const tso1 = ti.so1.map(nid => hn.get(nid)) as T[]
          if (g.flow === Flow.EXPLODED) {
            ti.familyW = Math.max(...tso1.map(ti => ti.maxW)) + g.sLineDeltaXDefault
            ti.familyH = tso1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ti.so1.length - 1) * +Boolean(ti.so2.length || ti.co2.length)
          } else if (g.flow === Flow.INDENTED) {
            ti.familyW = Math.max(...tso1.map(ti => ti.maxW)) + INDENT
            ti.familyH = tso1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ti.so1.length - 1) * +Boolean(ti.co2.length)
          }
        }
        if (ti.co1.length) {
          const tco1 = ti.co1.map(nid => hn.get(nid)) as T[]
          tco1.forEach(ti => {
            const cv = ti.cv.map(nid => hn.get(nid)) as T[]
            const ch = ti.ch.map(nid => hn.get(nid)) as T[]
            ti.selfW = Math.max(...cv.map(ti => ti.familyW + C_SPACING))
            ti.selfH = Math.max(...ch.map(ti => ti.familyH + C_SPACING))
          })
          ti.selfW = getTCO1R0(m, ti).reduce((a, b) => a + b.selfW, 0)
          ti.selfH = getTCO1C0(m, ti).reduce((a, b) => a + b.selfH, 0)
        }
        if (!ti.co1.length) {
          const pti = phn.get(ti.nodeId)
          if (
            ti.content !== '' &&
            (
              ti.dimW === 0 ||
              ti.dimH === 0 ||
              (
                pti && (
                  pti.content !== ti.content ||
                  pti.contentType !== ti.contentType ||
                  pti.textFontSize !== ti.textFontSize
                )
              )
            )
          ) {
            if (ti.contentType === 'text') {
              const dim = getTextDim(ti.content, ti.textFontSize)
              ti.dimW = dim[0]
              ti.dimH = dim[1]
            } else if (ti.contentType === 'mermaid') {
              const currDiv = document.getElementById(ti.nodeId) as HTMLDivElement
              if (currDiv) {
                ti.dimW = currDiv.offsetWidth
                ti.dimH = currDiv.offsetHeight
              }
            } else if (ti.contentType === 'equation') {
              const dim = getEquationDim(ti.content)
              ti.dimW = dim[0]
              ti.dimH = dim[1]
            }
          }
          ti.selfW = (ti.dimW > 20 ? ti.dimW : MIN_NODE_W) + (g.density === 'large' ? NODE_MARGIN_X_LARGE : NODE_MARGIN_X_SMALL)
          ti.selfH = (ti.dimH / 17 > 1 ? ti.dimH : MIN_NODE_H) + (g.density === 'large' ? NODE_MARGIN_Y_LARGE : NODE_MARGIN_Y_SMALL)
        }
        if (g.flow === Flow.EXPLODED) {
          ti.maxW = ti.selfW + ti.familyW
          ti.maxH = Math.max(...[ti.selfH, ti.familyH])
        } else if (g.flow === Flow.INDENTED) {
          ti.maxW = Math.max(...[ti.selfW, ti.familyW])
          ti.maxH = ti.selfH + ti.familyH
        }
        break
      }
      case isC(ti.path): {
        if (ti.so1.length) {
          const tso1 = ti.so1.map(nid => hn.get(nid)) as T[]
          if (g.flow === Flow.EXPLODED) {
            ti.familyW = Math.max(...tso1.map(ti => ti.maxW)) + g.sLineDeltaXDefault
            ti.familyH = tso1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ti.so1.length - 1) * +Boolean(ti.so2.length || ti.co2.length)
          } else {
            ti.familyW = Math.max(...tso1.map(ti => ti.maxW)) + INDENT
            ti.familyH = tso1.reduce((a, b) => a + b.maxH, 0) + S_SPACING * (ti.so1.length - 1) * +Boolean(ti.co2.length)
          }
        } else {
          ti.familyW = 60
          ti.familyH = 30
        }
        break
      }
    }
  })
}
