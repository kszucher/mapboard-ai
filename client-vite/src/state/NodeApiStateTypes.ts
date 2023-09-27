import {AccessTypes} from "./Enums"
import {M, MPartial} from "./MapStateTypes"

export interface DefaultUseOpenWorkspaceQueryState {
  name: string
  colorMode: string
  access: AccessTypes
  tabId: number
  mapId: string
  frameId: string
  mapDataList: M[]
  breadcrumbMapIdList: []
  breadcrumbMapNameList: {name: string}[]
  tabMapIdList: []
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
