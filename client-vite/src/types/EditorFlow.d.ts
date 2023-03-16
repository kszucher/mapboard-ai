import {AccessTypes, FormatMode, PageState} from "../core/Enums";
import {M} from "./DefaultProps";

export interface EditorState {
  token: string,
  pageState: PageState,
  formatMode: FormatMode,
  tabShrink: boolean,
  tempMap: object,
  mapList: M[],
  mapListIndex: number,
  editedNodeId: string,
  editType: '' | 'append' | 'replace'
  moveTarget: [],
  formatterVisible: boolean,
  moreMenu: boolean,
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
