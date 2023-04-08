import {AccessTypes} from "../core/Enums"
import {DefaultUseOpenWorkspaceQueryState} from "./ApiStateTypes"
import {api} from "../core/Api";
import {store} from "../editor/EditorReducer";

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
