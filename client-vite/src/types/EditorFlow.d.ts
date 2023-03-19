import {AccessTypes, FormatMode, PageState} from "../core/Enums"
import {ML} from "../state/MTypes"

export interface EditorState {
  token: string,
  pageState: PageState,
  formatMode: FormatMode,
  tabShrink: boolean,
  tempMap: object,
  mapList: ML[],
  mapListIndex: number,
  editedNodeId: string,
  editType: '' | 'append' | 'replace'
  moveCoords: number[],
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
  mapDataList: ML[],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  frameIdList: string[],
}
