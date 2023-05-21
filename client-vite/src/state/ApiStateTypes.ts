import {AccessTypes} from "./Enums"
import {M} from "./MapPropTypes"

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
  prompt: string
  context: string
  content: string
  typeNodes: string
  numNodes: number
  maxToken: number
}
