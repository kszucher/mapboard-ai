import {EditorState} from "./EditorStateTypes.ts"
import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "../consts/Enums.ts"

export const editorState: EditorState = {
  token: '',
  sessionId: '',
  isLoading: false,
  leftMouseMode: LeftMouseMode.CLICK_SELECT,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  formatMode: FormatMode.sFill,
  commitList: [],
  commitIndex: 0,
  lastSavedCommit: {commitId: '', data: []},
  editedNodeId: '',
  editType: '',
  editStartMapListIndex: Infinity,
  formatterVisible: false,
  rOffsetCoords: [],
  sMoveCoords: [],
  sL: '',
  sU: '',
  sD: '',
  selectionRectCoords: [],
  intersectingNodes: [],
  zoomInfo: {
    fromX: 0,
    fromY: 0,
    scale: 1,
    prevMapX: 0,
    prevMapY: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0,
  },
  connectionHelpersVisible: false,
  connectionStart: {
    fromNodeId: '',
    fromNodeSide: Side.R
  }
}

export const editorStateDefault = JSON.stringify(editorState)
