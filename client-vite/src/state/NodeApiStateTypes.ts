import {AccessType} from "./Enums"
import {M} from "./MapStateTypes"

export interface DefaultUseOpenWorkspaceQueryState {
  name: string
  colorMode: string
  isShared: boolean
  access: AccessType
  tabId: number
  mapId: string
  mapDataList: M[]
  breadcrumbMapIdList: string[]
  breadcrumbMapNameList: {name: string}[]
  tabMapIdList: string[]
  tabMapNameList: {name: string}[]
}

export interface DefaultGetIngestionQueryState {
  ingestionResult: any[]
}
