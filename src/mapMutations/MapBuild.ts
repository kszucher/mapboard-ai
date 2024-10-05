import {M} from "../mapState/MapStateTypes.ts"
import {mapCalcTask} from "./MapCalcTask.ts"
import {mapChain} from "./MapChain.ts"
import {mapInit} from "./MapInit.ts"
import {mapMeasure} from "./MapMeasure.ts"
import {mapPlace} from "./MapPlace.ts"
import {sortNode, sortPath} from "./MapSort.ts"

export const mapBuild = (pm: M, m: M) => {
  m.sort(sortPath)
  mapInit(m)
  mapChain(m)
  mapCalcTask(m)
  mapMeasure(pm, m)
  mapPlace(m)
  m.sort(sortNode)
  Object.freeze(m)
}
