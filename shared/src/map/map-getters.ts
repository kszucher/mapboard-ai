import { M } from '../api/api-types-map';
import { MapLinkConfig, MapNodeConfig } from '../api/api-types-map-config';
import { L } from '../api/api-types-map-link';
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
  n: Pick<N, 'offsetX' | 'controlType'>[]
}) => {
  const max = Math.max(...m.n.map(ni => getNodeRight(mapNodeConfigs, ni.offsetX, ni.controlType)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapHeight = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetY' | 'controlType'>[]
}) => {
  const max = Math.max(...m.n.map(ni => getNodeBottom(mapNodeConfigs, ni.offsetY, ni.controlType)));
  return Number.isFinite(max) ? max + 2 * M_PADDING : 0;
};

export const getMapRight = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetX' | 'controlType'>[]
}) => getMapWidth(mapNodeConfigs, m) - M_PADDING;

export const getMapBottom = (mapNodeConfigs: Partial<MapNodeConfig>[], m: {
  n: Pick<N, 'offsetY' | 'controlType'>[]
}) => getMapHeight(mapNodeConfigs, m) - M_PADDING;

export const getAllowedSources = (mapLinkConfigs: Partial<MapLinkConfig>[], type: string) => {
  return mapLinkConfigs.filter(el => el.ToNodeConfig?.type === type).map(el => el.FromNodeConfig?.type);
};

export const getAllowedTargets = (mapLinkConfigs: Partial<MapLinkConfig>[], type: string) => {
  return mapLinkConfigs.filter(el => el.FromNodeConfig?.type === type).map(el => el.ToNodeConfig?.type);
};

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

export const getLineCoords = (mapNodeConfigs: Partial<MapNodeConfig>[], mapLinkConfigs: Partial<MapLinkConfig>[], m: M, l: L) => {
  const fromNode = getInputNodeOfLink(m, l);
  const toNode = getOutputNodeOfLink(m, l);

  const leftIndex = getAllowedSources(mapLinkConfigs, toNode.controlType).findIndex(controlType => controlType === fromNode.controlType);
  const rightIndex = 0;

  return [
    getNodeRight(mapNodeConfigs, fromNode.offsetX, fromNode.controlType),
    getNodeTop(fromNode.offsetY) + 60 + rightIndex * 20,
    getNodeLeft(toNode.offsetX),
    getNodeTop(toNode.offsetY) + 60 + leftIndex * 20,
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
