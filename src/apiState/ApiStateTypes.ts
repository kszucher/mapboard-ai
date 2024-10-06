import {AccessType} from "../consts/Enums.ts"

export interface DefaultUseOpenWorkspaceQueryState {
  userName: string
  colorMode: string
  isShared: boolean
  access: AccessType
  tabMapIdList: string[]
  tabMapNameList: string[]
  tabId: number
  sharedMapIdList: string[]
  sharedMapNameList: string[]
  mapId: string
  mapName: string
  mapData: object,
  mapMergeId: string,
}

export interface DefaultGetSharesQueryState {
  shareDataImport: {
    _id: string
    sharedMapName: string
    ownerUserEmail: string
    access: string
    status: string
  }[]
  shareDataExport: {
    _id: string
    sharedMapName: string
    shareUserEmail: string
    access: string
    status: string
  }[]
}

export interface DefaultGetLatestMergedQueryState {
  mapData: object,
  mapMergeId: string,
}

export interface DefaultGetIngestionQueryState {
  ingestionResult: any[]
}
