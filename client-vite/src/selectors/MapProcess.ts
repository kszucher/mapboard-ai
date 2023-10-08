import {ControlTypes, Sides} from "../state/Enums"
import {M, T} from "../state/MapStateTypes"
import {getNodeByPath, getRSIPL, getTRD0SOL, mL, mTR} from "./MapSelector"

export type ReadableTree = {
  nodeId: string,
  contentList: string[]
}[]

export enum SubProcessTypes {
  INGESTION = 'ingestion',
  EXTRACTION = 'extraction',
  NONE = ''
}

export type SubProcess = {
  subProcessId: string
  subProcessType: 'ingestion' | 'extraction'
  subProcessMindMapData: ReadableTree,
  inputSubProcesses: string[]
  subProcessInputLink: string
  shouldQueryAndStoreResultAsMindMapToo: boolean
  subProcessPromptOverride: string
}

export const getSubProcessType = (controlType: ControlTypes): SubProcessTypes => {
  if (controlType === ControlTypes.UPLOAD) {
    return SubProcessTypes.INGESTION
  } else if (controlType === ControlTypes.GENERATE) {
    return SubProcessTypes.EXTRACTION
  } else {
    return SubProcessTypes.NONE
  }
}

export const getReadableTree = (m: M, t: T): ReadableTree => [
  {nodeId: t.nodeId, contentList: [t.content]}, ...getTRD0SOL(m, t).map(ti => ({
    nodeId: ti.nodeId,
    contentList: [...getRSIPL(ti.path), ti.path].map(p => getNodeByPath(m, p).content)
  }))
]

export const getSubProcessList = (m: M): SubProcess[] =>
  mTR(m)
    .sort((a: T, b: T) => (mL(m).filter(li => (
        li.fromNodeId === b.nodeId && li.fromNodeSide === Sides.R && li.toNodeId === a.nodeId && li.toNodeSide === Sides.L ||
        li.fromNodeId === a.nodeId && li.fromNodeSide === Sides.L && li.toNodeId === b.nodeId && li.toNodeSide === Sides.R
      )).length ? 1 : -1
    ))
    .map(ri => ({
        subProcessId: ri.nodeId,
        subProcessType: getSubProcessType(ri.controlType),
        subProcessMindMapData: getReadableTree(m, ri),
        inputSubProcesses: [''], // TODO start here
        subProcessInputLink: '',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      } as SubProcess)
    )
