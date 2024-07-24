import {RootState, store} from "../reducers/EditorReducer.ts"
import {EditorState} from "./EditorStateTypes"
import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "./Enums"

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
  mapList: [],
  mapListIndex: 0,
  lastMergedCommitId: '',
  editedNodeId: '',
  editType: '',
  editStartMapListIndex: Infinity,
  formatterVisible: false,
  rOffsetCoords: [],
  sMoveCoords: [],
  sMoveInsertParentNodeId: '',
  sMoveTargetIndex: 0,
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

export const getMap = () => store.getState().editor.mapList[store.getState().editor.mapListIndex]?.data
export const mSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex]?.data
export const pmSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex > 0 ? state.editor.mapListIndex - 1 : 0]?.data
