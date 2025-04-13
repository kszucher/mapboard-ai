import { mapInit } from './MapInit.ts';
import { sortNode } from './MapSort.ts';
import { mapPrune } from '../mapGetters/MapPrune.ts';
import { mL } from '../mapGetters/MapQueries.ts';
import { M, MPartial } from '../mapState/MapStateTypes.ts';

export const _assert = (test: MPartial, result: MPartial, fn: Function) => {
  const m = <M>test;
  const pathMappingBefore = new Map<string, string>(m.map(ni => [ni.nodeId, ni.path.join('')]));
  mapInit(m);
  fn(m);
  const mp = mapPrune(m);
  mp.forEach(ni =>
    Object.assign(ni, {
      nodeId: pathMappingBefore.has(ni.nodeId) ? pathMappingBefore.get(ni.nodeId) : '_' + ni.path.join(''),
    })
  );
  const pathMappingAfter = new Map<string, string>(m.map(ni => [ni.nodeId, ni.path.join('')]));
  mL(mp).forEach(li =>
    Object.assign(li, {
      fromNodeId: pathMappingBefore.has(li.fromNodeId)
        ? pathMappingBefore.get(li.fromNodeId)
        : '_' + pathMappingAfter.get(li.fromNodeId),
      toNodeId: pathMappingBefore.has(li.toNodeId)
        ? pathMappingBefore.get(li.toNodeId)
        : '_' + pathMappingAfter.get(li.toNodeId),
    })
  );
  return expect(mp.sort(sortNode)).toEqual(result.sort(sortNode));
};
