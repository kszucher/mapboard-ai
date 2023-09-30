import {FormatMode, PageState, Sides} from "./Enums"
import {M, T} from "./MapStateTypes"

export interface EditorState {
  token: string
  pageState: PageState
  formatMode: FormatMode
  tabShrink: boolean
  mapList: M[]
  mapListIndex: number
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  editStartMapListIndex: number
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
  intersectingNodes: T[]
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
