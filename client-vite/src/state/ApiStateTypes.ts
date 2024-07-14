import {AccessType} from "./Enums"
import {M} from "./MapStateTypes"

export interface DefaultUseOpenWorkspaceQueryState {
  userName: string
  colorMode: string
  isShared: boolean
  access: AccessType
  tabMapIdList: string[]
  tabMapNameList: string[]
  tabId: number
  // sharedMapIdList: string[]
  // sharedMapNameList: {name: string}[]
  breadcrumbMapIdList: string[]
  breadcrumbMapNameList: string[]
  mapId: string
  mapName: string
  mapData: M
}

export interface DefaultGetIngestionQueryState {
  ingestionResult: any[]
}
