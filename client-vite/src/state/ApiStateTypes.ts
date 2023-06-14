import {AccessTypes} from "./Enums"
import {M, MPartial} from "./MapPropTypes"

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

export type GptData = {
  promptId: string
  promptJSON: any[] // TODO define
  prompt: string
  maxToken: number
  timestamp: number
}
