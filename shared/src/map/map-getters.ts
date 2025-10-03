import { M } from '../api/api-types-map';
import { L } from '../api/api-types-map-link';
import { allowedSourceControls, controlBaseSizes, M_PADDING, N, N_PADDING } from '../api/api-types-map-node';

export const getNodeSelfW = (n: Pick<N, 'controlType'>) => controlBaseSizes[n.controlType].w + 2 * N_PADDING;

export const getNodeSelfH = (n: Pick<N, 'controlType'>) => controlBaseSizes[n.controlType].h + 2 * N_PADDING;

export const getMapSelfW = (m: { n: Pick<N, 'offsetX' | 'controlType'>[] }) => {
  const max = Math.max(...m.n.map(ni => ni.offsetX + getNodeSelfW(ni)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapSelfH = (m: { n: Pick<N, 'offsetY' | 'controlType'>[] }) => {
  const max = Math.max(...m.n.map(ni => ni.offsetY + getNodeSelfH(ni)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getNodeLeft = (n: N) => n.offsetX + M_PADDING;

export const getNodeRight = (n: N) => n.offsetX + M_PADDING + getNodeSelfW(n);

export const getNodeTop = (n: N) => n.offsetY + M_PADDING;

export const getLastIndexN = (m: { n: Pick<N, 'iid'>[] }): number => Math.max(-1, ...m.n.map(ni => ni.iid));

export const isExistingLink = (m: M, fromNodeId: number, toNodeId: number): boolean =>
  m.l.some(li => li.fromNodeId === fromNodeId && li.toNodeId === toNodeId);

export const getInputNodeOfLink = (m: M, l: L): N => {
  const inputNode = m.n.find(ni => ni.id === l.fromNodeId);
  if (!inputNode) {
    throw new Error(`Input node with id "${l.fromNodeId}" not found`);
  }
  return inputNode;
};

export const getOutputNodeOfLink = (m: M, l: L): N => {
  const outputNode = m.n.find(ni => ni.id === l.toNodeId);
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
    getNodeRight(m.n.find(ni => ni.id === l.fromNodeId)!),
    getNodeTop(m.n.find(ni => ni.id === l.fromNodeId)!) + 60 + rightIndex * 20,
    getNodeLeft(m.n.find(ni => ni.id === l.toNodeId)!),
    getNodeTop(m.n.find(ni => ni.id === l.toNodeId)!) + 60 + leftIndex * 20,
  ];
};

// Kahn's algorithm
export const getTopologicalSort = (m: {
  n: Pick<N, 'id'>[],
  l: Pick<L, 'fromNodeId' | 'toNodeId'>[]
}): number[] | null => {
  const { n, l } = m;
  const graph = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();

  // Initialize graph and indegree counts
  for (const node of n) {
    graph.set(node.id, new Set());
    inDegree.set(node.id, 0);
  }

  // Build graph edges and update indegree
  for (const link of l) {
    const { fromNodeId: from, toNodeId: to } = link;
    graph.get(from)!.add(to);
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
  }

  // Start with nodes that have no incoming edges
  const queue: number[] = [];
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(nodeId);
  }

  const order: number[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const neighbor of graph.get(current) ?? []) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If not all nodes were sorted, the graph has a cycle
  if (order.length !== n.length) {
    return null;
  }

  return order;
};
