import {FormatMode, PageState} from "../core/Enums"
import {M} from "./MTypes"

export interface EditorState {
  token: string
  pageState: PageState
  formatMode: FormatMode
  tabShrink: boolean
  tempMap: M
  mapList: M[]
  mapListIndex: number
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  movementCoords: number[]
  moveCoords: number[]
  formatterVisible: boolean
  moreMenu: boolean
}
