import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MapMode, MidMouseMode, PageState, Side} from "./Enums"
import {M, T} from "./MapStateTypes"

export interface EditorState {
  token: string
  isLoading: boolean
  mapMode: MapMode
  leftMouseMode: LeftMouseMode
  midMouseMode: MidMouseMode
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
  rOffsetCoords: number[]
  sMoveCoords: number[]
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
    fromNodeSide: Side
  }
}
