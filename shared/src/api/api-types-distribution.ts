import { L } from './api-types-map-link';
import { N } from './api-types-map-node';

export type UpdateN = Partial<N> & Pick<N, 'workspaceId' | 'updatedAt'>
export type UpdateL = Partial<L> & Pick<L, 'workspaceId' | 'updatedAt'>

export type UpdateMapGraphEventPayload = {
  mapId: number,
  nodes?: { insert?: N[]; update?: UpdateN[]; delete?: number[] },
  links?: { insert?: L[]; update?: UpdateL[]; delete?: number[] }
};

export enum SSE_EVENT_TYPE {
  INVALIDATE_MAP_TAB = 'INVALIDATE_MAP_TAB',
  INVALIDATE_MAP_GRAPH = 'INVALIDATE_MAP_GRAPH',
  INVALIDATE_TAB = 'INVALIDATE_TAB',
  INVALIDATE_SHARE = 'UPDATE_SHARE',
  INVALIDATE_WORKSPACE_MAP_TAB_SHARE = 'INVALIDATE_WORKSPACE_MAP_TAB_SHARE',
}

export type SSE_EVENT =
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_MAP_TAB; payload: { mapId: number } }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH; payload: UpdateMapGraphEventPayload }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_TAB; payload: { userId: number } }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_SHARE; payload: { userIds: number[] } }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_WORKSPACE_MAP_TAB_SHARE; payload: {} }
