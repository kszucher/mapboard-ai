import {FormatMode, PageState} from "../core/Enums"
import {EditorState} from "./EditorStateTypes";
import {RootState, store} from "../editor/EditorReducer";

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
}

export const getMap = () => (store.getState().editor.mapList[store.getState().editor.mapListIndex])
export const mSelector = (state: RootState) => state.editor.tempMap.length ? state.editor.tempMap : state.editor.mapList[state.editor.mapListIndex]
export const pmSelector = (state: RootState) => state.editor.tempMap.length ? state.editor.tempMap : state.editor.mapList[state.editor.mapListIndex > 0 ? state.editor.mapListIndex - 1 : 0]
