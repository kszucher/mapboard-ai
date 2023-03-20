import {FormatMode, PageState} from "../core/Enums"
import {ML} from "./MTypes"

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
