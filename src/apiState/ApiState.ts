import {AccessType} from "../consts/Enums.ts"
import {DefaultGetIngestionQueryState, DefaultUseOpenWorkspaceQueryState} from "./ApiStateTypes.ts"
import {api} from "../api/Api.ts"
import {store} from "../editorMutations/EditorReducer.ts"

export const defaultUseOpenWorkspaceQueryState: DefaultUseOpenWorkspaceQueryState = {
  userName: '',
  colorMode: 'dark',
  isShared: false,
  access: AccessType.UNAUTHORIZED,
  tabMapIdList: [],
  tabMapNameList: [],
  tabId: 0,
  // sharedMapIdList: [],
  // sharedMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  mapId: '',
  mapName: '',
  mapVersion: {merge_id: '', data: []},
}

export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}

export const getMapId = () => (api.endpoints.openWorkspace.select()(store.getState())?.data || defaultUseOpenWorkspaceQueryState).mapId
