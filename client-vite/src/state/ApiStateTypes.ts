import {AccessTypes} from "../core/Enums"
import {ML} from "./MTypes"

export interface DefaultUseOpenWorkspaceQueryState {
  name: string,
  colorMode: string,
  access: AccessTypes,
  tabId: number,
  mapId: string,
  frameId: string,
  mapDataList: ML[],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  tabMapIdList: [],
  tabMapNameList: [],
  frameIdList: string[],
}
