import {Side} from "../state/Enums"
import {M} from "../state/MapStateTypes"
import {SubProcess} from "./MapProcessTypes.ts"
import {getNodeByPath, getSIPL, mL, mTS, mTR} from "./MapQueries.ts"

const getAllDependencies = (subProcessId: string, subProcessList: SubProcess[]): string[] => {
  const process = subProcessList.find(el => el.subProcessId === subProcessId)
  if (!process) {return []}
  return process.inputSubProcesses.concat(process.inputSubProcesses.reduce((acc: string[], curr) => acc.concat(getAllDependencies(curr, subProcessList)), []))
}

export const getSubProcessList = (m: M, subProcessId: string): SubProcess[] => {
  const subProcesses = mTR(m).map(ri => ({
      subProcessId: ri.nodeId,
      subProcessType: ri.controlType,
      subProcessMindMapData:
        mTS(m)
          .filter(ti => ti.path.at(1) === ri.path.at(1) && ti.tso1.length === 0)
          .map(ti => ({
            nodeId: ti.nodeId,
            contentList: [...getSIPL(ti.path), ti.path].map(p => getNodeByPath(m, p).content)
          }))
      ,
      inputSubProcesses: [
        ...mL(m)
          .filter(li => li.fromNodeId === ri.nodeId && li.fromNodeSide === Side.L)
          .map(li => li.toNodeId),
        ...mL(m)
          .filter(li => li.toNodeId === ri.nodeId && li.toNodeSide === Side.L)
          .map(li => li.fromNodeId)
      ],
      inputSubProcessesAll: [],
      subProcessInputLink: ri.llmDataId,
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    } as SubProcess)
  )
  subProcesses.forEach(sp => sp.inputSubProcessesAll = getAllDependencies(sp.subProcessId, subProcesses))
  const subProcessInputSubProcessesAll = getAllDependencies(subProcessId, subProcesses)
  return subProcesses
    .filter(el => subProcessInputSubProcessesAll.includes(el.subProcessId) || el.subProcessId === subProcessId)
    .sort((a, b) => a.inputSubProcessesAll.includes(b.subProcessId) ? 1 : -1)
}
