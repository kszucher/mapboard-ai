import { E } from './api-types-map-edge';
import { N } from './api-types-map-node';

export type UpdateN = Partial<N> & Pick<N, 'workspaceId' | 'updatedAt'>
export type UpdateL = Partial<E> & Pick<E, 'workspaceId' | 'updatedAt'>

export type UpdateMapGraphEventPayload = {
  mapId: number,
  nodes?: { insert?: N[]; update?: UpdateN[]; delete?: number[] },
  edges?: { insert?: E[]; update?: UpdateL[]; delete?: number[] }
};

export enum SSE_EVENT_TYPE {
  INVALIDATE_MAP = 'INVALIDATE_MAP',
  INVALIDATE_MAP_GRAPH = 'INVALIDATE_MAP_GRAPH',
  INVALIDATE_TAB = 'INVALIDATE_TAB',
  INVALIDATE_SHARE = 'UPDATE_SHARE',
  INVALIDATE_WORKSPACE = 'INVALIDATE_WORKSPACE',
}

export type SSE_EVENT =
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_MAP; payload: { mapId: number } }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH; payload: UpdateMapGraphEventPayload }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_TAB; payload: { tabId: number } }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_SHARE; payload: { shareId: number } }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_WORKSPACE; payload: {} }
