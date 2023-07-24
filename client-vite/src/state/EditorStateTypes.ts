import {FormatMode, PageState} from "./Enums"
import {M, N} from "./MapPropTypes"

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
  formatterVisible: boolean
  moreMenu: boolean
  moveCoords: number[]
  selectionRectCoords: number[]
  intersectingNodes: N[]
  zoomInfo: {
    scale: number
    xLast: number,
    yLast: number,
    xNew: number,
    yNew: number,
    xImage: number,
    yImage: number,
  }
}
