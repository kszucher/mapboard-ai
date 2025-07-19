import { ControlType, L, M, M_PADDING, N, N_PADDING } from '../state/map-consts-and-types';

export const getMapSelfW = (m: M) => {
  const nl = Object.values(m.n);
  const max = Math.max(...nl.map(ni => ni.offsetW + ni.selfW));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapSelfH = (m: M) => {
  const nl = Object.values(m.n);
  const max = Math.max(...nl.map(ni => ni.offsetH + ni.selfH));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getNodeLeft = (n: N) => n.offsetW + M_PADDING;
export const getNodeRight = (n: N) => n.offsetW + M_PADDING + n.selfW;
export const getNodeTop = (n: N) => n.offsetH + M_PADDING;

export const getLineCoords = (m: M, l: L) => [
  getNodeRight(m.n[l.fromNodeId]) - 10,
  getNodeTop(m.n[l.fromNodeId]) + 60 + l.fromNodeSideIndex * 20,
  getNodeLeft(m.n[l.toNodeId]) + 10,
  getNodeTop(m.n[l.toNodeId]) + 60 + l.toNodeSideIndex * 20,
];

export const getLastIndexN = (m: M): number => Math.max(-1, ...Object.values(m.n).map(ni => ni.iid));

export const isExistingLink = (m: M, fromNodeId: string, toNodeId: string): boolean =>
  Object.values(m.l).some(li => li.fromNodeId === fromNodeId && li.toNodeId === toNodeId);

export const getInputL = (m: M, rNodeId: string): Record<string, L> => {
  return Object.fromEntries(Object.entries(m.l).filter(([, li]) => li.toNodeId === rNodeId));
};

export const getInputR = (m: M, rNodeId: string): Record<string, N> => {
  const ll = Object.values(m.l).filter(li => li.toNodeId === rNodeId);
  return Object.fromEntries(Object.entries(m.n).filter(([nodeId]) => ll.some(li => li.fromNodeId === nodeId)));
};

export const getTopologicalSort = (m: M): string[] | null => {
  // Kahn's algorithm
  const { n, l } = m;
  const graph = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  for (const nodeId of Object.keys(n)) {
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

  if (order.length !== Object.keys(n).length) {
    return null;
  }

  return order;
};

export const getControlTypeDimensions = (controlType: ControlType): { w: number, h: number } => {
  let w;
  let h;
  switch (controlType) {
    case ControlType.FILE:
      w = 160;
      h = 90;
      break;
    case ControlType.INGESTION:
      w = 160;
      h = 90;
      break;
    case ControlType.CONTEXT:
      w = 200;
      h = 200;
      break;
    case ControlType.QUESTION:
      w = 200;
      h = 200;
      break;
    case ControlType.VECTOR_DATABASE:
      w = 180;
      h = 60;
      break;
    case ControlType.LLM:
      w = 200;
      h = 210;
      break;
  }
  w += 2 * N_PADDING;
  h += 2 * N_PADDING;
  return { w, h };
};
