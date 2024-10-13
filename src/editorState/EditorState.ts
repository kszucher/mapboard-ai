import {Side} from "../mapState/MapEnums.ts"
import {AlertDialogState, DialogState, LeftMouseMode, MidMouseMode, PageState} from "./EditorEnums.ts"
import {EditorState} from "./EditorStateTypes.ts"

export const editorState: EditorState = {
  token: '',
  connectionId: '',
  isLoading: false,
  leftMouseMode: LeftMouseMode.CLICK_SELECT,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  mapId: '',
  commitList: [],
  commitIndex: 0,
  latestMapData: [],
  latestMapMergeId: '',
  editedNodeId: '',
  editType: '',
  editStartMapListIndex: Infinity,
  formatterVisible: false,
  rOffsetCoords: [],
  sMoveCoords: [],
  insertLocation: {
    sl: '',
    su: '',
    sd: ''
  },
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
  connectionHelpersVisible: true,
  connectionStart: {
    fromNodeId: '',
    fromNodeSide: Side.R
  }
}

export const editorStateDefault = JSON.stringify(editorState)
