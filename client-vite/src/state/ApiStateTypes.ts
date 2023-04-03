import {AccessTypes} from "../core/Enums"
import {M} from "./MTypes"

export interface DefaultUseOpenWorkspaceQueryState {
  name: string
  colorMode: string
  access: AccessTypes
  tabId: number
  mapId: string
  frameId: string
  mapDataList: M[]
  breadcrumbMapIdList: []
  breadcrumbMapNameList: []
  tabMapIdList: []
  tabMapNameList: []
  frameIdList: string[]
}
