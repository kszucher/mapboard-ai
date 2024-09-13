import {AccessType} from "../consts/Enums.ts"

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
  mapData: object,
  mapMergeId: string,
}

export interface DefaultGetIngestionQueryState {
  ingestionResult: any[]
}
