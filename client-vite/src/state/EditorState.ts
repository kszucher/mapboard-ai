import {FormatMode, PageState, Sides} from "./Enums"
import {EditorState} from "./EditorStateTypes"
import {RootState, store} from "../reducers/EditorReducer"

export const editorState: EditorState = {
  token: '',
  pageState: PageState.AUTH,
  formatMode: FormatMode.sFill,
  tabShrink: false,
  mapList: [],
  mapListIndex: 0,
  editedNodeId: '',
  editType: '',
  formatterVisible: false,
  moreMenu: false,
  frameMenu: false,
  contextMenu: {
    isActive: false,
    type: 'map',
    position: {x: 0, y: 0}
  },
  moveCoords: [],
  selectionRectCoords: [],
  intersectingNodes: [],
  zoomInfo: {
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

export const getMap = () => (store.getState().editor.mapList[store.getState().editor.mapListIndex])
export const mSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex]
export const pmSelector = (state: RootState) => state.editor.mapList[state.editor.mapListIndex > 0 ? state.editor.mapListIndex - 1 : 0]
