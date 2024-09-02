import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "./Enums"
import {M} from "./MapStateTypes"

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
  commitList: {commitId: string, data: M}[]
  commitIndex: number
  lastMergedCommitId: string
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  editStartMapListIndex: number
  formatterVisible: boolean
  rOffsetCoords: number[]
  sMoveCoords: number[]
  sMoveInsertParentNodeId: string
  sMoveTargetIndex: number
  selectionRectCoords: number[]
  intersectingNodes: string[]
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
