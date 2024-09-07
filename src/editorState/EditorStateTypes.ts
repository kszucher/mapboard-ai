import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "../consts/Enums.ts"
import {M} from "../mapState/MapStateTypes.ts"

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
  mapId: string
  commitList: {commitId: string, data: M}[]
  commitIndex: number
  lastSavedCommit: {commitId: string, data: M}
  editedNodeId: string
  editType: '' | 'append' | 'replace'
  editStartMapListIndex: number
  formatterVisible: boolean
  rOffsetCoords: number[]
  sMoveCoords: number[]
  sL: string
  sU: string
  sD: string
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
