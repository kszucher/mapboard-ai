import {AccessType} from "../editorState/EditorStateTypesEnums.ts"
import {
  DefaultGetIngestionQueryState,
  DefaultGetLatestMergedQueryState,
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

export const defaultGetLatestMergedQueryState: DefaultGetLatestMergedQueryState = {
  mapData: {},
  mapMergeId: ''
}

export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}
