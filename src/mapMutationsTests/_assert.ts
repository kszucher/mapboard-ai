import {mapPrune} from "../mapQueries/MapPrune.ts"
import {mapMutation} from "../mapMutations/MapMutation.ts"
import {mapChain} from "../mapMutations/MapChain.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {sortNode} from "../mapMutations/MapSort.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {M, MPartial} from "../state/MapStateTypes.ts"
import {mL} from "../mapQueries/MapQueries.ts"

export const _assert = (test: MPartial, result: MPartial, mmType: MM, mmPayload?: any) => {
  const m = test as M
  const pathMappingBefore = new Map<string, string>(m.map(ni => [ni.nodeId, ni.path.join('')]))
  mapInit(m)
  mapChain(m)
  mapMutation(m, mmType, mmPayload)
  const md = mapPrune(m)
  md.forEach(ni => Object.assign(ni, {
    nodeId: pathMappingBefore.has(ni.nodeId) ? pathMappingBefore.get(ni.nodeId) : '_' +  ni.path.join('')
  }))
  const pathMappingAfter = new Map<string, string>(m.map(ni => [ni.nodeId, ni.path.join('')]))
  mL(md as M).forEach(li => Object.assign(li, {
    fromNodeId: pathMappingBefore.has(li.fromNodeId) ? pathMappingBefore.get(li.fromNodeId) : '_' + pathMappingAfter.get(li.fromNodeId),
    toNodeId: pathMappingBefore.has(li.toNodeId) ? pathMappingBefore.get(li.toNodeId) : '_' + pathMappingAfter.get(li.toNodeId)
  }))
  return expect(md.sort(sortNode)).toEqual((result).sort(sortNode))
}
