import {RootState, store} from "../reducers/EditorReducer"
import {EditorState} from "./EditorStateTypes"
import {AlertDialogState, DialogState, FormatMode, LeftMouseTypes, PageState, Sides} from "./Enums"

export const editorState: EditorState = {
  token: '',
  leftMouseMode: LeftMouseTypes.SELECT_BY_CLICK_OR_MOVE,
  scrollOverride: false,
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
  moveCoords: [],
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
    fromNodeSide: Sides.R
  }
}

export const getScrollOverride = () => store.getState().editor.scrollOverride
export const getMap = () => store.getState().editor.mapList[store.getState().editor.mapListIndex]
export const mSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex]
export const pmSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex > 0 ? state.editor.mapListIndex - 1 : 0]
