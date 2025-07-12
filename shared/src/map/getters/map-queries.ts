import { M_PADDING } from '../state/map-consts';
import { L, M, R } from '../state/map-types';

export const getMapSelfW = (m: M) => {
  const rl = Object.values(m.r);
  const max = Math.max(...rl.map(ri => ri.offsetW + ri.selfW));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapSelfH = (m: M) => {
  const rl = Object.values(m.r);
  const max = Math.max(...rl.map(ri => ri.offsetH + ri.selfH));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getRootLeftX = (r: R) => r.offsetW + M_PADDING;
export const getRootRightX = (r: R) => r.offsetW + M_PADDING + r.selfW;
export const getRootTopY = (r: R) => r.offsetH + M_PADDING;

export const getLineCoords = (m: M, l: L) => [
  getRootRightX(m.r[l.fromNodeId]) - 10,
  getRootTopY(m.r[l.fromNodeId]) + 60 + l.fromNodeSideIndex * 20,
  getRootLeftX(m.r[l.toNodeId]) + 10,
  getRootTopY(m.r[l.toNodeId]) + 60 + l.toNodeSideIndex * 20,
];

export const getLastIndexR = (m: M): number => Math.max(-1, ...Object.values(m.r).map(ri => ri.iid));

export const isExistingLink = (m: M, fromNodeId: string, toNodeId: string): boolean =>
  Object.values(m.l).some(li => li.fromNodeId === fromNodeId && li.toNodeId === toNodeId);

export const getInputL = (m: M, rNodeId: string): Record<string, L> => {
  return Object.fromEntries(Object.entries(m.l).filter(([, li]) => li.toNodeId === rNodeId));
};

export const getInputR = (m: M, rNodeId: string): Record<string, R> => {
  const ll = Object.values(m.l).filter(li => li.toNodeId === rNodeId);
  return Object.fromEntries(Object.entries(m.r).filter(([nodeId]) => ll.some(li => li.fromNodeId === nodeId)));
};

export const getTopologicalSort = (m: M): string[] | null => {
  // Kahn's algorithm
  const { r, l } = m;
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  for (const nodeId of Object.keys(r)) {
    graph.set(nodeId, new Set());
    inDegree.set(nodeId, 0);
  }

  for (const link of Object.values(l)) {
    const { fromNodeId: from, toNodeId: to } = link;
    graph.get(from)!.add(to);
    inDegree.set(to, inDegree.get(to)! + 1);
  }

  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(nodeId);
  }

  const order: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const neighbor of graph.get(current)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (order.length !== Object.keys(r).length) {
    return null;
  }

  return order;
};
