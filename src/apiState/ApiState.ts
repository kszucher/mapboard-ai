import {AccessType} from "../consts/Enums.ts"
import {
  DefaultGetIngestionQueryState,
  DefaultGetLatestMergedQueryState,
  DefaultUseOpenWorkspaceQueryState
} from "./ApiStateTypes.ts"

export const defaultUseOpenWorkspaceQueryState: DefaultUseOpenWorkspaceQueryState = {
  userName: '',
  colorMode: 'dark',
  isShared: false,
  access: AccessType.UNAUTHORIZED,
  tabMapIdList: [],
  tabMapNameList: [],
  tabId: 0,
  sharedMapIdList: [],
  sharedMapNameList: [],
  breadcrumbMapIdList: [],
  breadcrumbMapNameList: [],
  mapId: '',
  mapName: '',
  mapData: {},
  mapMergeId: ''
}

export const defaultGetLatestMergedQueryState: DefaultGetLatestMergedQueryState = {
  mapData: {},
  mapMergeId: ''
}


export const defaultGetIngestionQueryState: DefaultGetIngestionQueryState = {
  ingestionResult: []
}
