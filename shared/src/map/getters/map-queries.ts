import { M_PADDING } from '../state/map-consts';
import { L, M, R } from '../state/map-types';

export const getMapSelfW = (m: M) => {
  const rl = Object.values(m.r);
  return Math.max(...rl.map(ri => ri.offsetW + ri.selfW)) + 2 * M_PADDING;
};

export const getMapSelfH = (m: M) => {
  const rl = Object.values(m.r);
  return Math.max(...rl.map(ri => ri.offsetH + ri.selfH)) + 2 * M_PADDING;
};

export const getNodeStartX = (r: R) => r.offsetW + M_PADDING;
export const getNodeStartY = (r: R) => r.offsetH + M_PADDING;

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
