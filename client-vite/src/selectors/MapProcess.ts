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
  inputSubProcessesAll: string[]
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

const getAllDependencies = (subProcessId: string, subProcessList: SubProcess[]): string[] => {
  const process = subProcessList.find(el => el.subProcessId === subProcessId)
  if (!process) {return []}
  return process.inputSubProcesses.concat(process.inputSubProcesses.reduce((acc: string[], curr) => acc.concat(getAllDependencies(curr, subProcessList)), []))
}

export const getSubProcessList = (m: M, subProcessId: string): SubProcess[] => {
  const subProcesses = mTR(m).map(ri => ({
      subProcessId: ri.nodeId,
      subProcessType: getSubProcessType(ri.controlType),
      subProcessMindMapData: getReadableTree(m, ri),
      inputSubProcesses: [
        ...mL(m).filter(li => li.fromNodeId === ri.nodeId && li.fromNodeSide === Sides.L).map(li => li.toNodeId),
        ...mL(m).filter(li => li.toNodeId === ri.nodeId && li.toNodeSide === Sides.L).map(li => li.fromNodeId)
      ],
      inputSubProcessesAll: [],
      subProcessInputLink: ri.llmDataId,
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    } as SubProcess)
  )
  subProcesses.forEach(sp => sp.inputSubProcessesAll = getAllDependencies(sp.subProcessId, subProcesses))
  return subProcesses
    .filter(el => getAllDependencies(subProcessId, subProcesses).includes(el.subProcessId) || el.subProcessId === subProcessId)
    .sort((a, b) => a.inputSubProcessesAll.includes(b.subProcessId) ? 1 : -1)
}
