import {AccessType} from "../editorState/EditorStateTypesEnums.ts"
import {
  DefaultGetIngestionQueryState,
  DefaultGetSharesQueryState,
  DefaultUseOpenWorkspaceQueryState
} from "./ApiStateTypes.ts"

export const defaultUseOpenWorkspaceQueryState: DefaultUseOpenWorkspaceQueryState = {
  userName: '',
  colorMode: 'dark',
  isShared: false,
  access: AccessType.UNAUTHORIZED,
  tabMapIdList: [],
  tabMapNameList: [],
  tabId: 0,
  sharedMapIdList: [],
  sharedMapNameList: [],
  mapId: '',
  mapName: '',
  mapData: {},
  mapMergeId: ''
}

export const defaultGetSharesQueryState: DefaultGetSharesQueryState = {
  shareDataImport: [],
  shareDataExport: []
}

export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}
