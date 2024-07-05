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
  mapDataList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
}

export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}

export const getMapId = () => {
  const result = api.endpoints.openWorkspace.select()(store.getState())
  const {data} = result
  const {mapId} = data || defaultUseOpenWorkspaceQueryState
  return mapId
}
