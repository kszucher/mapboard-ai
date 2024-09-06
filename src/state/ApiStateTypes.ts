import {AccessType} from "./Enums"

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
  mapVersion: {merge_id: string, data: []},
}

export interface DefaultGetIngestionQueryState {
  ingestionResult: any[]
}
