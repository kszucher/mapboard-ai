import {FormatMode, PageState} from "../core/Enums"
import {EditorState} from "./EditorStateTypes";
import {store} from "../core/EditorReducer";

export const editorState: EditorState = {
  token: '',
  pageState: PageState.AUTH,
  formatMode: FormatMode.text,
  tabShrink: false,
  tempMap: {},
  mapList: [],
  mapListIndex: 0,
  editedNodeId: '',
  editType: '',
  movementCoords: [],
  moveCoords: [],
  formatterVisible: false,
  moreMenu: false,
}

export const getMap = () => (store.getState().editor.mapList[store.getState().editor.mapListIndex])
