import {FormatMode, PageState, Sides} from "./Enums"
import {M, N} from "./MapStateTypes"

export interface EditorState {
  token: string
  pageState: PageState
  formatMode: FormatMode
  tabShrink: boolean
  mapList: M[]
  mapListIndex: number
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  formatterVisible: boolean
  moreMenu: boolean
  frameMenu: boolean
  contextMenu: {
    isActive: boolean
    type: 'map' | 'node'
    position: {x: number, y: number}
  }
  moveCoords: number[]
  selectionRectCoords: number[]
  intersectingNodes: N[]
  zoomInfo: {
    scale: number
    prevMapX: number
    prevMapY: number
    translateX: number
    translateY: number
    originX: number
    originY: number
  }
  connectionHelpersVisible: boolean
  connectionStart: {
    fromNodeId: string,
    fromNodeSide: Sides
  }
}
