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
  promptJSON: MPartial
  prompt: string
  maxToken: number
  timestamp: number
}
