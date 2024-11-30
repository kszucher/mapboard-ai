import { rSaveOptional } from "../mapState/MapState.ts"
import { M } from "../mapState/MapStateTypes.ts"
import { getAXR, idToR, mL } from "./MapQueries.ts"

export const lrToClipboard = (m: M): M => {
  const minOffsetW = Math.min(...getAXR(m).map(ri => ri.offsetW ?? rSaveOptional.offsetW))
  const minOffsetH = Math.min(...getAXR(m).map(ri => ri.offsetH ?? rSaveOptional.offsetH))
  return structuredClone([
    ...mL(m)
      .filter(li => idToR(m, li.fromNodeId).selected && idToR(m, li.toNodeId).selected)
      .map((li, i) => ({ ...li, path: ['l', i] })),
    ...getAXR(m).map((ri, i) => ({
      ...ri,
      path: ri.path.with(1, i),
      offsetW: (ri.offsetW ?? rSaveOptional.offsetW) - minOffsetW,
      offsetH: (ri.offsetH ?? rSaveOptional.offsetH) - minOffsetH
    }))
  ]) as M
}
