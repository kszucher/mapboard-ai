export type ReadableTree = {
  nodeId: string,
  contentList: string[]
}[]

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
