import { M } from '../state/map-types';

export const mapCopy = (m: M, genId: Function): M => {
  const lIdMapping = new Map(Object.keys(m.l).map(id => [id, genId()]));
  const rIdMapping = new Map(Object.keys(m.r).map(id => [id, genId()]));

  return structuredClone({
    l: Object.fromEntries(
      Object.entries(m.l).map(([nodeId, li]) => [lIdMapping.get(nodeId), {
        ...li,
        fromNodeId: rIdMapping.get(li.fromNodeId),
        toNodeId: rIdMapping.get(li.toNodeId),
      }]),
    ),
    r: Object.fromEntries(
      Object.entries(m.r).map(([nodeId, ri]) => [rIdMapping.get(nodeId), ri]),
    ),
  });
};
