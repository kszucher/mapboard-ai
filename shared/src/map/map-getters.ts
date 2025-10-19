import { M } from '../api/api-types-map';
import { MapEdgeConfig, MapNodeConfig } from '../api/api-types-map-config';
import { E } from '../api/api-types-map-edge';
import { M_PADDING, N, N_PADDING } from '../api/api-types-map-node';

export const getNodeLeft = (offsetX: number) => offsetX + M_PADDING;

export const getNodeTop = (offsetY: number) => offsetY + M_PADDING;

export const getNodeWidth = (mapNodeConfigs: Partial<MapNodeConfig>[], type: string) =>
  mapNodeConfigs?.find(el => el.type === type)?.w || 0;

export const getNodeHeight = (mapNodeConfigs: Partial<MapNodeConfig>[], type: string) =>
  mapNodeConfigs?.find(el => el.type === type)?.h || 0;

export const getNodeRight = (mapNodeConfigs: Partial<MapNodeConfig>[], offsetX: number, type: string) =>
  offsetX + getNodeWidth(mapNodeConfigs, type) + N_PADDING;

export const getNodeBottom = (mapNodeConfigs: Partial<MapNodeConfig>[], offsetY: number, type: string) =>
  offsetY + getNodeHeight(mapNodeConfigs, type) + N_PADDING;

export const getMapWidth = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetX' | 'MapNodeConfig'>[]
}) => {
  const max = Math.max(...m.n.map(ni => getNodeRight(mapNodeConfigs, ni.offsetX, ni.MapNodeConfig.type)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapHeight = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetY' | 'MapNodeConfig'>[]
}) => {
  const max = Math.max(...m.n.map(ni => getNodeBottom(mapNodeConfigs, ni.offsetY, ni.MapNodeConfig.type)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapRight = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetX' | 'MapNodeConfig'>[]
}) => getMapWidth(mapNodeConfigs, m) - M_PADDING;

export const getMapBottom = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetY' | 'MapNodeConfig'>[]
}) => getMapHeight(mapNodeConfigs, m) - M_PADDING;

export const getAllowedSources = (mapEdgeConfigs: Partial<MapEdgeConfig>[], type: string) => {
  return mapEdgeConfigs.filter(el => el.ToNodeConfig?.type === type).map(el => el.FromNodeConfig?.type);
};

export const getAllowedTargets = (mapEdgeConfigs: Partial<MapEdgeConfig>[], type: string) => {
  return mapEdgeConfigs.filter(el => el.FromNodeConfig?.type === type).map(el => el.ToNodeConfig?.type);
};

export const getLastIndexN = (m: { n: Pick<N, 'iid'>[] }): number => Math.max(-1, ...m.n.map(ni => ni.iid));

export const isExistingEdge = (m: M, fromNodeId: number, toNodeId: number): boolean =>
  m.e.some(ei => ei.fromNodeId === fromNodeId && ei.toNodeId === toNodeId);

export const getInputNodeOfEdge = (m: M, e: E): N => {
  const inputNode = m.n.find(ni => ni.id === e.fromNodeId);
  if (!inputNode) {
    throw new Error(`Input node with id "${e.fromNodeId}" not found`);
  }
  return inputNode;
};

export const getOutputNodeOfEdge = (m: M, e: E): N => {
  const outputNode = m.n.find(ni => ni.id === e.toNodeId);
  if (!outputNode) {
    throw new Error(`Output node with id "${e.toNodeId}" not found`);
  }
  return outputNode;
};

export const getLineCoords = (mapNodeConfigs: Partial<MapNodeConfig>[], mapEdgeConfigs: Partial<MapEdgeConfig>[], m: M, e: E) => {
  const fromNode = getInputNodeOfEdge(m, e);
  const toNode = getOutputNodeOfEdge(m, e);

  const leftIndex = getAllowedSources(mapEdgeConfigs, toNode.MapNodeConfig.type).findIndex(type => type === fromNode.MapNodeConfig.type);
  const rightIndex = 0;

  return [
    getNodeRight(mapNodeConfigs, fromNode.offsetX, fromNode.MapNodeConfig.type),
    getNodeTop(fromNode.offsetY) + 60 + rightIndex * 20,
    getNodeLeft(toNode.offsetX),
    getNodeTop(toNode.offsetY) + 60 + leftIndex * 20,
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
