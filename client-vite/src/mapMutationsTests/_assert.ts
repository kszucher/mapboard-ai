import {mapDeInit} from "../mapMutations/MapDeInit.ts"
import {mapMutation} from "../mapMutations/MapMutation.ts"
import {mapChain} from "../mapMutations/MapChain.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {sortNode} from "../mapMutations/MapSort.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {M, MPartial} from "../state/MapStateTypes.ts"

export const _assert = (test: MPartial, result: MPartial, mmType: MM, mmPayload?: any) => {
  const m = test as M

  const pathMapping = new Map<string, string>(m.map(ni => [ni.nodeId, ni.path.join('') as string]))

  mapInit(m)
  mapChain(m)
  mapMutation(m, mmType, mmPayload)
  const md = mapDeInit(m)

  md.forEach(ni => Object.assign(ni, {nodeId: pathMapping.has(ni.nodeId) ? pathMapping.get(ni.nodeId) : '_' +  ni.path.join('')}))

  return expect(md.sort(sortNode)).toEqual((result).sort(sortNode))
}
