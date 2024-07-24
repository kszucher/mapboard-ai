import {mapDeInit} from "../mapMutations/MapDeInit.ts"
import {mapMutations} from "../mapMutations/MapMutations.ts"
import {mapChain} from "../mapMutations/MapChain.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {sortNode} from "../mapMutations/MapSort.ts"
import {MM} from "../mapMutations/MapMutationsEnum.ts"
import {M, MPartial} from "../state/MapStateTypes.ts"

export const _assert = (test: MPartial, result: MPartial, mmType: MM, mmPayload?: any) => {
  const m = test as M
  mapInit(m)
  mapChain(m)
  mapMutations(m, mmType, mmPayload)
  const md = mapDeInit(m)
  return expect(md.sort(sortNode)).toEqual((result).sort(sortNode))
}
