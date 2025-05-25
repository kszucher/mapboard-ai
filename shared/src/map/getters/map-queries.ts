import { L, M, R } from '../state/map-types';

export const getLastIndexR = (m: M): number => Math.max(-1, ...Object.values(m.r).map(ri => ri.iid));

export const isExistingLink = (m: M, partialL: Partial<L>): boolean =>
  Object.values(m.l).some(
    li =>
      partialL.fromNodeId === li.fromNodeId &&
      partialL.toNodeId === li.toNodeId &&
      partialL.fromNodeSide === li.fromNodeSide &&
      partialL.toNodeSide === li.toNodeSide,
  );

export const getInputNodes = (m: M, rNodeId: string): Record<string, R> => {
  const ll = Object.values(m.l).filter(li => li.toNodeId === rNodeId);
  return Object.fromEntries(Object.entries(m.r).filter(([nodeId]) => ll.some(li => li.fromNodeId === nodeId)));
};
