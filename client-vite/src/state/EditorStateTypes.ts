import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "./Enums"
import {M, S} from "./MapStateTypes"

export interface EditorState {
  token: string
  sessionId: string
  isLoading: boolean
  leftMouseMode: LeftMouseMode
  midMouseMode: MidMouseMode
  pageState: PageState
  dialogState: DialogState
  alertDialogState: AlertDialogState
  formatMode: FormatMode
  mapList: M[]
  mapListIndex: number
  mapListIndexSaved: number
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  editStartMapListIndex: number
  formatterVisible: boolean
  rOffsetCoords: number[]
  sMoveCoords: number[]
  selectionRectCoords: number[]
  intersectingNodes: S[]
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
