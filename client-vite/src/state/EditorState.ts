import {FormatMode, PageState} from "../core/Enums"
import {EditorState} from "./EditorStateTypes";

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
  moveCoords: [],
  formatterVisible: false,
  moreMenu: false,
}
