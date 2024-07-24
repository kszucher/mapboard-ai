import {mapDeInit} from "../mapMutations/MapDeInit.ts"
import {mapMutation} from "../mapMutations/MapMutation.ts"
import {mapChain} from "../mapMutations/MapChain.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {sortNode} from "../mapMutations/MapSort.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {M, MPartial} from "../state/MapStateTypes.ts"

export const _assert = (test: MPartial, result: MPartial, mmType: MM, mmPayload?: any) => {
  const m = test as M
  mapInit(m)
  mapChain(m)
  mapMutation(m, mmType, mmPayload)
  const md = mapDeInit(m)
  return expect(md.sort(sortNode)).toEqual((result).sort(sortNode))
}
