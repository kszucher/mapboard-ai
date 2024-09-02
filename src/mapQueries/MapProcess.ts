import {Side} from "../state/Enums"
import {M, PS} from "../state/MapStateTypes"
import {SubProcess} from "./MapProcessTypes.ts"
import {mL, mS, mR, pathToS} from "./MapQueries.ts"

const getAllDependencies = (subProcessId: string, subProcessList: SubProcess[]): string[] => {
  const process = subProcessList.find(el => el.subProcessId === subProcessId)
  if (!process) {return []}
  return process.inputSubProcesses.concat(process.inputSubProcesses.reduce((acc: string[], curr) => acc.concat(getAllDependencies(curr, subProcessList)), []))
}

export const getSubProcessList = (m: M, subProcessId: string): SubProcess[] => {
  const subProcesses = mR(m).map(ri => ({
      subProcessId: ri.nodeId,
      subProcessType: ri.controlType,
      subProcessMindMapData:
        mS(m)
          .filter(si => si.path.at(1) === ri.path.at(1) && si.so1.length === 0)
          .map(si => ({
            nodeId: si.nodeId,
            contentList: [si.path, ...si.path.map((_, i) => si.path.slice(0, i)).filter(pi => pi.at(-2) === 's')].map(pi => pathToS(m, pi as PS).content)
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
      subProcessInputLink: ri.ingestionHash,
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
