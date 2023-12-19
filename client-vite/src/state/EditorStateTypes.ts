import {AlertDialogState, DialogState, FormatMode, LeftMouseTypes, PageState, Sides} from "./Enums"
import {M, T} from "./MapStateTypes"

export interface EditorState {
  token: string
  leftMouseMode: LeftMouseTypes
  scrollOverride: boolean
  pageState: PageState
  dialogState: DialogState
  alertDialogState: AlertDialogState
  formatMode: FormatMode
  mapList: M[]
  mapListIndex: number
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  editStartMapListIndex: number
  formatterVisible: boolean
  moveCoords: number[]
  selectionRectCoords: number[]
  intersectingNodes: T[]
  zoomInfo: {
    fromX: number
    fromY: number
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
