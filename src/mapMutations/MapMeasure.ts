import {MARGIN_X, MARGIN_Y} from "../mapConsts/MapConsts.ts"
import {mR} from "../mapQueries/MapQueries.ts"
import {isG, isR} from "../mapQueries/PathQueries.ts"
import {G, M, R} from "../mapState/MapStateTypes.ts"
import {ControlType} from "../mapState/MapStateTypesEnums.ts"

export const mapMeasure = (m: M) => {
  const minOffsetW = Math.min(...mR(m).map(ri => ri.offsetW))
  const minOffsetH = Math.min(...mR(m).map(ri => ri.offsetH))
  mR(m).map(ri => Object.assign(ri, {
    offsetW: ri.offsetW - minOffsetW,
    offsetH: ri.offsetH - minOffsetH
  }))
  m.slice().reverse().forEach(ni => {
    switch (true) {
      case isG(ni.path): {
        const g = <G>ni
        g.selfW = Math.max(...mR(m).map(ri => ri.offsetW + ri.selfW)) + 40
        g.selfH = Math.max(...mR(m).map(ri => ri.offsetH + ri.selfH)) + 40
        break
      }
      case isR(ni.path): {
        const ri = <R>ni
        if (ri.controlType === ControlType.NONE) {
          ri.familyW = 80
          ri.familyH = 60
        } else if (ri.controlType === ControlType.INGESTION) {
          ri.familyW = 200
          ri.familyH = 240
        } else if (ri.controlType === ControlType.EXTRACTION) {
          ri.familyW = 200
          ri.familyH = 240
        }
        ri.selfW = ri.familyW + 2 * MARGIN_X
        ri.selfH = ri.familyH + 2 * MARGIN_Y
        break
      }
    }
  })
}
