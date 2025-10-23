import { EdgeType } from '../api/api-types-edge-type';
import { M } from '../api/api-types-map';
import { E } from '../api/api-types-edge';
import { M_PADDING, N, N_PADDING } from '../api/api-types-node';

export const getNodeLeft = (n: N) => n.offsetX + M_PADDING;

export const getNodeTop = (n: N) => n.offsetY + M_PADDING;

export const getNodeWidth = (n: N) => n.NodeType.w;

export const getNodeHeight = (n: N) => n.NodeType.h;

export const getNodeRight = (n: N) => n.offsetX + n.NodeType.w + N_PADDING;

export const getMapWidth = (m: M) => {
  const max = Math.max(...m.n.map(ni => ni.offsetX + ni.NodeType.w + N_PADDING));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapHeight = (m: M) => {
  const max = Math.max(...m.n.map(ni => ni.offsetY + ni.NodeType.h + N_PADDING));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const isExistingEdge = (m: M, fromNodeId: number, toNodeId: number): boolean =>
  m.e.some(ei => ei.fromNodeId === fromNodeId && ei.toNodeId === toNodeId);

export const getInputNodeOfEdge = (m: M, e: E): N => m.n.find(ni => ni.id === e.fromNodeId)!;

export const getOutputNodeOfEdge = (m: M, e: E): N => m.n.find(ni => ni.id === e.toNodeId)!;

export const getLineCoords = (edgeTypes: Partial<EdgeType>[], m: M, e: E) => {
  const fromNode = getInputNodeOfEdge(m, e);
  const toNode = getOutputNodeOfEdge(m, e);
  const leftIndex = edgeTypes
    .filter(el => el.toNodeTypeId === toNode.NodeType.id)
    .map(el => el.fromNodeTypeId)
    .findIndex(type => type === fromNode.NodeType.id);

  return [
    getNodeRight(fromNode),
    getNodeTop(fromNode) + 60,
    getNodeLeft(toNode),
    getNodeTop(toNode) + 60 + leftIndex * 20,
  ];
};

// Kahn's algorithm
export const getTopologicalSort = (m: {
  n: Pick<N, 'id'>[],
  e: Pick<E, 'fromNodeId' | 'toNodeId'>[]
}): number[] | null => {
  const { n, e } = m;
  const graph = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();

  // Initialize graph and indegree counts
  for (const node of n) {
    graph.set(node.id, new Set());
    inDegree.set(node.id, 0);
  }

  // Build graph edges and update indegree
  for (const edge of e) {
    const { fromNodeId: from, toNodeId: to } = edge;
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
