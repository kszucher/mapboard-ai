import {AccessTypes} from "../core/Enums"
import {DefaultUseOpenWorkspaceQueryState} from "./ApiStateTypes"

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
