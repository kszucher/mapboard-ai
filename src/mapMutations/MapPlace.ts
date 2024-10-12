import {mR} from "../mapQueries/MapQueries.ts"
import {M} from "../mapState/MapStateTypes.ts"

export const mapPlace = (m: M) => {
  mR(m).forEach(ri => {
    ri.nodeStartX = ri.offsetW + 20
    ri.nodeStartY = ri.offsetH + 20
  })
}
