import {AccessType} from "./Enums"
import {M} from "./MapStateTypes"

export interface DefaultUseOpenWorkspaceQueryState {
  name: string
  colorMode: string
  access: AccessType
  tabId: number
  mapId: string
  frameId: string
  mapDataList: M[]
  breadcrumbMapIdList: string[]
  breadcrumbMapNameList: {name: string}[]
  tabMapIdList: string[]
  tabMapNameList: {name: string}[]
  frameIdList: string[]
}

export type GptData = {
  promptId: string
  promptJson: any[] // TODO define
  prompt: string
  maxToken: number
  timestamp: number
}
