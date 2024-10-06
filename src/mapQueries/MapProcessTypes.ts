export type SubProcess = {
  subProcessId: string
  subProcessType: 'ingestion' | 'extraction'
  inputSubProcesses: string[]
  inputSubProcessesAll: string[]
  subProcessInputLink: string
  subProcessPromptOverride: string
}
