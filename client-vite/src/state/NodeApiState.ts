import {AccessType} from "./Enums"
import {DefaultGetIngestionQueryState, DefaultUseOpenWorkspaceQueryState} from "./NodeApiStateTypes"
import {api} from "../api/Api.ts"
import {store} from "../reducers/EditorReducer"

export const defaultUseOpenWorkspaceQueryState: DefaultUseOpenWorkspaceQueryState = {
  name: '',
  colorMode: 'dark',
  isShared: false,
  access: AccessType.UNAUTHORIZED,
  tabId: 0,
  mapId: '',
  mapData: [],
  tabMapIdList: [],
  tabMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  sharedMapIdList: [],
  sharedMapNameList: [],
}

export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}

export const getMapId = () => (api.endpoints.openWorkspace.select()(store.getState())?.data || defaultUseOpenWorkspaceQueryState).mapId







