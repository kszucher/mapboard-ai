import {AccessTypes, FormatMode, PageState} from "../core/Types";
import {M} from "./DefaultProps";

export interface KeyboardEventData {
  key: string,
  code: string
}

export interface EditorState {
  token: string,
  pageState: PageState,
  formatMode: FormatMode,
  tabShrink: boolean,
  tempMap: object,
  mapList: M[],
  mapListIndex: number,
  editedNodeId: string,
  moveTarget: [],
  selectTarget: [],
  formatterVisible: boolean,
  moreMenu: boolean,
  lastKeyboardEventData: KeyboardEventData | undefined,
}

export interface DefaultUseOpenWorkspaceQueryState {
  name: string,
  colorMode: string,
  access: AccessTypes,
  tabId: number,
  mapId: string,
  frameId: string,
  mapDataList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  frameIdList: string[],
}
