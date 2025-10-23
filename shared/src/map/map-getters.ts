import { E } from '../api/api-types-edge';
import { EdgeType } from '../api/api-types-edge-type';
import { M } from '../api/api-types-map';
import { M_PADDING, N, N_PADDING } from '../api/api-types-node';
import { Color, NodeType } from '../api/api-types-node-type';

export const getNodeType = (nodeTypes: Partial<NodeType>[], n: N) => nodeTypes.find(nt => nt.id === n.nodeTypeId);

export const getNodeLabel = (nodeTypes: Partial<NodeType>[], n: N) => getNodeType(nodeTypes, n)?.label || '';

export const getNodeColor = (nodeTypes: Partial<NodeType>[], n: N) => getNodeType(nodeTypes, n)?.color || Color.gray;

export const getNodeLeft = (n: N) => n.offsetX + M_PADDING;

export const getNodeTop = (n: N) => n.offsetY + M_PADDING;

export const getNodeWidth = (nodeTypes: Partial<NodeType>[], n: N) => getNodeType(nodeTypes, n)?.w || 0;

export const getNodeHeight = (nodeTypes: Partial<NodeType>[], n: N) => getNodeType(nodeTypes, n)?.h || 0;

export const getNodeRight = (nodeTypes: Partial<NodeType>[], n: N) => n.offsetX + getNodeWidth(nodeTypes, n) + N_PADDING;

export const getMapWidth = (nodeTypes: Partial<NodeType>[], m: M) => {
  const max = Math.max(...m.n.map(ni => ni.offsetX + getNodeWidth(nodeTypes, ni) + N_PADDING));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapHeight = (nodeTypes: Partial<NodeType>[], m: M) => {
  const max = Math.max(...m.n.map(ni => ni.offsetY + getNodeHeight(nodeTypes, ni) + N_PADDING));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getAllowedTargetNodeTypes = (edgeTypes: Partial<EdgeType>[], n: N) => {
  return edgeTypes.filter(eti => eti.fromNodeTypeId === n.nodeTypeId).map(eti => eti.toNodeTypeId);
};

export const isExistingEdge = (m: M, fromNodeId: number, toNodeId: number): boolean =>
  m.e.some(ei => ei.fromNodeId === fromNodeId && ei.toNodeId === toNodeId);

export const getInputNodeOfEdge = (m: M, e: E): N => m.n.find(ni => ni.id === e.fromNodeId)!;

export const getOutputNodeOfEdge = (m: M, e: E): N => m.n.find(ni => ni.id === e.toNodeId)!;

export const getLineCoords = (nodeTypes: Partial<NodeType>[], edgeTypes: Partial<EdgeType>[], m: M, e: E) => {
  const fromNode = getInputNodeOfEdge(m, e);
  const toNode = getOutputNodeOfEdge(m, e);
  const leftIndex = edgeTypes
    .filter(el => el.toNodeTypeId === toNode.nodeTypeId)
    .map(el => el.fromNodeTypeId)
    .findIndex(type => type === fromNode.nodeTypeId);

  return [
    getNodeRight(nodeTypes, fromNode),
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
