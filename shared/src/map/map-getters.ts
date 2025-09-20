import { M } from '../api/api-types-map';
import { L } from '../api/api-types-map-link';
import { allowedSourceControls, controlBaseSizes, M_PADDING, N, N_PADDING } from '../api/api-types-map-node';

export const getNodeSelfW = (n: N) => controlBaseSizes[n.controlType].w + 2 * N_PADDING;

export const getNodeSelfH = (n: N) => controlBaseSizes[n.controlType].h + 2 * N_PADDING;

export const getMapSelfW = (m: M) => {
  const nl = Object.values(m.n);
  const max = Math.max(...nl.map(ni => ni.offsetW + getNodeSelfW(ni)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapSelfH = (m: M) => {
  const nl = Object.values(m.n);
  const max = Math.max(...nl.map(ni => ni.offsetH + getNodeSelfH(ni)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getNodeLeft = (n: N) => n.offsetW + M_PADDING;

export const getNodeRight = (n: N) => n.offsetW + M_PADDING + getNodeSelfW(n);

export const getNodeTop = (n: N) => n.offsetH + M_PADDING;

export const getLastIndexN = (m: M): number => Math.max(-1, ...Object.values(m.n).map(ni => ni.iid));

export const isExistingLink = (m: M, fromNodeId: number, toNodeId: number): boolean =>
  Object.values(m.l).some(li => li.fromNodeId === fromNodeId && li.toNodeId === toNodeId);

export const getInputNodeOfLink = (m: M, l: L): N => {
  const inputNode = m.n[l.fromNodeId];
  if (!inputNode) {
    throw new Error(`Input node with id "${l.fromNodeId}" not found`);
  }
  return inputNode;
};

export const getOutputNodeOfLink = (m: M, l: L): N => {
  const outputNode = m.n[l.toNodeId];
  if (!outputNode) {
    throw new Error(`Output node with id "${l.toNodeId}" not found`);
  }
  return outputNode;
};

export const getLineCoords = (m: M, l: L) => {
  const fromNode = getInputNodeOfLink(m, l);
  const toNode = getOutputNodeOfLink(m, l);

  const leftIndex = allowedSourceControls[toNode.controlType].findIndex(controlType => controlType === fromNode.controlType);
  const rightIndex = 0;

  return [
    getNodeRight(m.n[l.fromNodeId]),
    getNodeTop(m.n[l.fromNodeId]) + 60 + rightIndex * 20,
    getNodeLeft(m.n[l.toNodeId]),
    getNodeTop(m.n[l.toNodeId]) + 60 + leftIndex * 20,
  ];
};

export const getTopologicalSort = (m: M): number[] | null => {
  // Kahn's algorithm
  const { n, l } = m;
  const graph = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();

  for (const nodeId of Object.keys(n).map(Number)) {
    graph.set(nodeId, new Set());
    inDegree.set(nodeId, 0);
  }

  for (const link of Object.values(l)) {
    const { fromNodeId: from, toNodeId: to } = link;
    graph.get(from)!.add(to);
    inDegree.set(to, inDegree.get(to)! + 1);
  }

  const queue: number[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(nodeId);
  }

  const order: number[] = [];

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
