import { M_PADDING } from "../mapConsts/MapConsts.ts"
import { mR } from "../mapQueries/MapQueries.ts"
import { M } from "../mapState/MapStateTypes.ts"

export const mapPlace = (m: M) => {
  mR(m).forEach(ri => {
    ri.nodeStartX = ri.offsetW + M_PADDING
    ri.nodeStartY = ri.offsetH + M_PADDING
  })
}
