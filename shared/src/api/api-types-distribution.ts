import { E, EdgeUpdateDown } from './api-types-edge';
import { N, NodeUpdateDown } from './api-types-node';

export type UpdateMapGraphEventPayload = {
  mapId: number,
  nodes?: {
    insert?: N[];
    update?: NodeUpdateDown[];
    delete?: number[]
  },
  edges?: {
    insert?: E[];
    update?: EdgeUpdateDown[];
    delete?: number[]
  }
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
