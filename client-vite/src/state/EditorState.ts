import {FormatMode, PageState} from "./Enums"
import {EditorState} from "./EditorStateTypes"
import {RootState, store} from "../core/EditorReducer"

export const editorState: EditorState = {
  token: '',
  pageState: PageState.AUTH,
  formatMode: FormatMode.text,
  tabShrink: false,
  tempMap: [],
  mapList: [],
  mapListIndex: 0,
  editedNodeId: '',
  editType: '',
  formatterVisible: false,
  moreMenu: false,
  moveCoords: [],
  selectionRectCoords: [],
  intersectingNodes: [],
  zoomInfo: {
    scale: 1,
    xLast: 0,
    yLast: 0,
    xNew: 0,
    yNew: 0,
    xImage: 0,
    yImage: 0,
  },
  connectorsVisible: false
}

export const getMap = () => (store.getState().editor.mapList[store.getState().editor.mapListIndex])
export const mSelector = (state: RootState) => state.editor.tempMap.length ? state.editor.tempMap : state.editor.mapList[state.editor.mapListIndex]
export const pmSelector = (state: RootState) => state.editor.tempMap.length ? state.editor.tempMap : state.editor.mapList[state.editor.mapListIndex > 0 ? state.editor.mapListIndex - 1 : 0]
