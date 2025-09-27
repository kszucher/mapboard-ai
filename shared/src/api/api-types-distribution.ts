import { L } from './api-types-map-link';
import { N } from './api-types-map-node';

export enum SSE_EVENT_TYPE {
  INVALIDATE_MAP_TAB = 'INVALIDATE_MAP_TAB',
  INVALIDATE_MAP_GRAPH = 'INVALIDATE_MAP_GRAPH',
  INVALIDATE_TAB = 'INVALIDATE_TAB',
  INVALIDATE_SHARE = 'UPDATE_SHARE',
  INVALIDATE_WORKSPACE_MAP_TAB_SHARE = 'INVALIDATE_WORKSPACE_MAP_TAB_SHARE',
}

export type UpdateMapGraphEventPayload = {
  nodes?: {
    insert?: N[],
    update?: Partial<N>[]
    delete?: number[],
  },
  links?: {
    insert?: L[],
    update?: Partial<L>[],
    delete?: number[],
  }
};

export type SSE_EVENT =
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_MAP_TAB; payload: {} }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_MAP_GRAPH; payload: UpdateMapGraphEventPayload }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_TAB; payload: {} }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_SHARE; payload: {} }
  | { type: typeof SSE_EVENT_TYPE.INVALIDATE_WORKSPACE_MAP_TAB_SHARE; payload: {} }
