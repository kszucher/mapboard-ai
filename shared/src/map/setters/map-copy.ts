import { M } from '../state/map-types';

export const mapCopy = (m: M, genId: Function): M => {
  const lIdMapping = new Map(Object.keys(m.l).map(id => [id, genId()]));
  const nIdMapping = new Map(Object.keys(m.n).map(id => [id, genId()]));

  return structuredClone({
    l: Object.fromEntries(
      Object.entries(m.l).map(([nodeId, li]) => [lIdMapping.get(nodeId), {
        ...li,
        fromNodeId: nIdMapping.get(li.fromNodeId),
        toNodeId: nIdMapping.get(li.toNodeId),
      }]),
    ),
    n: Object.fromEntries(
      Object.entries(m.n).map(([nodeId, ni]) => [nIdMapping.get(nodeId), ni]),
    ),
  });
};
