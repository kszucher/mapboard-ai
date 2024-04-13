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
  frameId: '',
  mapDataList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  frameIdList: []
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

export const getFrameId = () => {
  const result = api.endpoints.openWorkspace.select()(store.getState())
  const {data} = result
  const {frameId} = data || defaultUseOpenWorkspaceQueryState
  return frameId
}
