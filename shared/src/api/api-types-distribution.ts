import { L } from './api-types-map-link';
import { N } from './api-types-map-node';
import { ShareAccess } from './api-types-share';

export enum SSE_EVENT_TYPE {
  RENAME_MAP = 'RENAME_MAP',
  DELETE_MAP = 'DELETE_MAP',
  INSERT_NODE = 'INSERT_NODE',
  INSERT_LINK = 'INSERT_LINK',
  DELETE_NODE = 'DELETE_NODE',
  DELETE_LINK = 'DELETE_LINK',
  MOVE_NODE = 'MOVE_NODE',
  UPDATE_NODE = 'UPDATE_NODE',
  UPDATE_NODES = 'UPDATE_NODES',
  UPDATE_TAB = 'UPDATE_TAB',
  CREATE_SHARE = 'CREATE_SHARE',
  ACCEPT_SHARE = 'ACCEPT_SHARE',
  WITHDRAW_SHARE = 'WITHDRAW_SHARE',
  REJECT_SHARE = 'REJECT_SHARE',
  MODIFY_SHARE_ACCESS = 'MODIFY_SHARE_ACCESS',
}

export type RenameMapEventPayload = { mapId: number; mapName: string };
export type DeleteMapEventPayload = { mapId: number };
export type InsertNodeEventPayload = { node: N };
export type InsertLinkEventPayload = { link: L };
export type DeleteNodeEventPayload = { nodeId: number, linkIds: number[] };
export type DeleteLinkEventPayload = { linkId: number };
export type MoveNodeEventPayload = { nodeId: number; offsetX: number; offsetY: number };
export type UpdateNodeEventPayload = { node: Partial<N> };
export type UpdateNodesEventPayload = { nodes: Partial<N>[] };
export type UpdateTabEventPayload = {};
export type CreateShareEventPayload = { OwnerUser: { name: string }; Map: { name: string } };
export type AcceptShareEventPayload = { ShareUser: { name: string }; Map: { name: string } };
export type WithdrawShareEventPayload = {
  shareUserId: number;
  mapId: number;
  OwnerUser: { name: string };
  Map: { name: string };
};
export type RejectShareEventPayload = {
  shareUserId: number;
  mapId: number;
  ShareUser: { name: string };
  Map: { name: string };
};
export type ModifyShareAccessEventPayload = {
  access: ShareAccess;
  OwnerUser: { name: string };
  Map: { name: string };
};

export type SSE_EVENT =
  | { type: typeof SSE_EVENT_TYPE.RENAME_MAP; payload: RenameMapEventPayload }
  | { type: typeof SSE_EVENT_TYPE.DELETE_MAP; payload: DeleteMapEventPayload }
  | { type: typeof SSE_EVENT_TYPE.INSERT_NODE; payload: InsertNodeEventPayload }
  | { type: typeof SSE_EVENT_TYPE.INSERT_LINK; payload: InsertLinkEventPayload }
  | { type: typeof SSE_EVENT_TYPE.DELETE_NODE; payload: DeleteNodeEventPayload }
  | { type: typeof SSE_EVENT_TYPE.DELETE_LINK; payload: DeleteLinkEventPayload }
  | { type: typeof SSE_EVENT_TYPE.MOVE_NODE; payload: MoveNodeEventPayload }
  | { type: typeof SSE_EVENT_TYPE.UPDATE_NODE; payload: UpdateNodeEventPayload }
  | { type: typeof SSE_EVENT_TYPE.UPDATE_NODES; payload: UpdateNodesEventPayload }
  | { type: typeof SSE_EVENT_TYPE.UPDATE_TAB; payload: UpdateTabEventPayload }
  | { type: typeof SSE_EVENT_TYPE.CREATE_SHARE; payload: CreateShareEventPayload }
  | { type: typeof SSE_EVENT_TYPE.ACCEPT_SHARE; payload: AcceptShareEventPayload }
  | { type: typeof SSE_EVENT_TYPE.WITHDRAW_SHARE; payload: WithdrawShareEventPayload }
  | { type: typeof SSE_EVENT_TYPE.REJECT_SHARE; payload: RejectShareEventPayload }
  | { type: typeof SSE_EVENT_TYPE.MODIFY_SHARE_ACCESS; payload: ModifyShareAccessEventPayload };
