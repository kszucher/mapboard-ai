import {RootState, store} from "../reducers/EditorReducer"
import {EditorState} from "./EditorStateTypes"
import {AlertDialogState, DialogState, FormatMode, LeftMouseMode, MidMouseMode, PageState, Side} from "./Enums"

export const editorState: EditorState = {
  token: '',
  isLoading: false,
  leftMouseMode: LeftMouseMode.SELECT_BY_CLICK_OR_MOVE,
  midMouseMode: MidMouseMode.SCROLL,
  pageState: PageState.AUTH,
  dialogState: DialogState.NONE,
  alertDialogState: AlertDialogState.NONE,
  formatMode: FormatMode.sFill,
  mapList: [],
  mapListIndex: 0,
  editedNodeId: '',
  editType: '',
  editStartMapListIndex: Infinity,
  formatterVisible: false,
  rOffsetCoords: [],
  sMoveCoords: [],
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

export const getMidMouseMode = () => store.getState().editor.midMouseMode
export const getMap = () => store.getState().editor.mapList[store.getState().editor.mapListIndex]
export const mSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex]
export const pmSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex > 0 ? state.editor.mapListIndex - 1 : 0]
