import {ControlTypes, Sides} from "../state/Enums"
import {M, T} from "../state/MapStateTypes"
import {getMapId} from "../state/NodeApiState"
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

export type Process = {
  processId: string
  subProcesses: SubProcess[]
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

export const getDependencies = (m: M, r: T): string[] => [
  ...mL(m).filter(li => li.fromNodeId === r.nodeId && li.fromNodeSide === Sides.L).map(li => li.toNodeId),
  ...mL(m).filter(li => li.toNodeId === r.nodeId && li.toNodeSide === Sides.L).map(li => li.fromNodeId)
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
        inputSubProcesses: getDependencies(m, ri),
        subProcessInputLink: ri.llmDataId,
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      } as SubProcess)
    )

const getAllDependencies = (subProcessId: string, subProcessList: SubProcess[]): string[] => {
  const process = subProcessList.find(el => el.subProcessId === subProcessId)
  if (!process) {return []}
  return process.inputSubProcesses.concat(process.inputSubProcesses.reduce((acc: string[], curr) => acc.concat(getAllDependencies(curr, subProcessList)), []))
}

export const getSubProcessListFiltered = (m: M, subProcessId: string): SubProcess[] => {
  const subProcessList = getSubProcessList(m)
  const subProcessListFiltered = subProcessList.filter(el => getAllDependencies(subProcessId, subProcessList).includes(el.subProcessId) || el.subProcessId === subProcessId)
  console.log(subProcessListFiltered.map(el  => el.subProcessMindMapData[0].contentList))
  return subProcessListFiltered
}

// export const getProcess = (m: M, subProcessId: string) => ({
//   processId: getMapId(),
//   subProcesses: getSubProcessListFiltered(m, subProcessId),
// })
