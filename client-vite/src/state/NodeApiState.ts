import {AccessTypes} from "./Enums"
import {DefaultUseOpenWorkspaceQueryState} from "./NodeApiStateTypes"
import {nodeApi} from "../apis/NodeApi"
import {store} from "../reducers/EditorReducer"

export const defaultUseOpenWorkspaceQueryState: DefaultUseOpenWorkspaceQueryState = {
  name: '',
  colorMode: 'dark',
  access: AccessTypes.UNAUTHORIZED,
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

export const getMapId = () => {
  const result = nodeApi.endpoints.openWorkspace.select()(store.getState())
  const {data} = result
  const {mapId} = data || defaultUseOpenWorkspaceQueryState
  return mapId
}

export const getFrameId = () => {
  const result = nodeApi.endpoints.openWorkspace.select()(store.getState())
  const {data} = result
  const {frameId} = data || defaultUseOpenWorkspaceQueryState
  return frameId
}
