import {M} from "../mapState/MapStateTypes.ts"
import {Side} from "../mapState/MapStateTypesEnums.ts"
import {SubProcess} from "./MapProcessTypes.ts"
import {mL, mR} from "./MapQueries.ts"

const getAllDependencies = (subProcessId: string, subProcessList: SubProcess[]): string[] => {
  const process = subProcessList.find(el => el.subProcessId === subProcessId)
  if (!process) {return []}
  return process.inputSubProcesses.concat(process.inputSubProcesses.reduce((acc: string[], curr) => acc.concat(getAllDependencies(curr, subProcessList)), []))
}

export const getSubProcessList = (m: M, subProcessId: string): SubProcess[] => {
  const subProcesses = mR(m).map(ri => ({
      subProcessId: ri.nodeId,
      subProcessType: ri.controlType,
      inputSubProcesses: [
        ...mL(m)
          .filter(li => li.fromNodeId === ri.nodeId && li.fromNodeSide === Side.L)
          .map(li => li.toNodeId),
        ...mL(m)
          .filter(li => li.toNodeId === ri.nodeId && li.toNodeSide === Side.L)
          .map(li => li.fromNodeId)
      ],
      inputSubProcessesAll: [],
      subProcessInputLink: ri.ingestionHash,
      subProcessPromptOverride: ''
    } as SubProcess)
  )
  subProcesses.forEach(sp => sp.inputSubProcessesAll = getAllDependencies(sp.subProcessId, subProcesses))
  const subProcessInputSubProcessesAll = getAllDependencies(subProcessId, subProcesses)
  return subProcesses
    .filter(el => subProcessInputSubProcessesAll.includes(el.subProcessId) || el.subProcessId === subProcessId)
    .sort((a, b) => a.inputSubProcessesAll.includes(b.subProcessId) ? 1 : -1)
}
