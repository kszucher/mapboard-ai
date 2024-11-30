import { AccessType } from "../editorState/EditorStateTypesEnums.ts"
import {
  DefaultGetIngestionQueryState,
  DefaultGetSharesQueryState,
  DefaultUseOpenWorkspaceQueryState
} from "./ApiStateTypes.ts"

export const defaultUseOpenWorkspaceQueryState: DefaultUseOpenWorkspaceQueryState = {
  userName: '',
  colorMode: 'dark',
  tabMapIdList: [],
  tabMapNameList: [],
  sharedMapIdList: [],
  sharedMapNameList: [],
  mapId: '',
  mapName: '',
  mapData: {},
  access: AccessType.UNAUTHORIZED
}

export const defaultGetSharesQueryState: DefaultGetSharesQueryState = {
  shareDataImport: [],
  shareDataExport: []
}

export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}
