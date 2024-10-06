import {ControlType, Side, SubProcessType} from "../consts/Enums.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {getSubProcessList} from "../mapQueries/MapProcess.ts"
import {SubProcess} from "../mapQueries/MapProcessTypes.ts"
import {M, MPartial} from "../mapState/MapStateTypes.ts"

describe("MapProcessTests", () => {
  test('getSubProcessList', () => {
      //      [r0]
      //         \
      //          [r1]
      //             \
      //      [r3]     [r2]
      //         \   /
      //          [r4]
      //         /
      //      [r6]
      //     /
      //  [r5]
      const test = [
        {nodeId: 'g', path: ['g']},
        {nodeId: 'l0', path: ['l', 0], fromNodeId: 'r0', fromNodeSide: Side.R, toNodeId: 'r1', toNodeSide: Side.L},
        {nodeId: 'l1', path: ['l', 1], fromNodeId: 'r1', fromNodeSide: Side.R, toNodeId: 'r2', toNodeSide: Side.L},
        {nodeId: 'l2', path: ['l', 2], fromNodeId: 'r3', fromNodeSide: Side.R, toNodeId: 'r4', toNodeSide: Side.L},
        {nodeId: 'l3', path: ['l', 3], fromNodeId: 'r4', fromNodeSide: Side.R, toNodeId: 'r2', toNodeSide: Side.L},
        {nodeId: 'l4', path: ['l', 4], fromNodeId: 'r5', fromNodeSide: Side.R, toNodeId: 'r6', toNodeSide: Side.L},
        {nodeId: 'l5', path: ['l', 5], fromNodeId: 'r6', fromNodeSide: Side.R, toNodeId: 'r4', toNodeSide: Side.L},
        {nodeId: 'r0', path: ['r', 0], controlType: ControlType.INGESTION, ingestionHash: 'hHash', selected: 1},
        {nodeId: 'r1', path: ['r', 1], controlType: ControlType.EXTRACTION},
        {nodeId: 'r2', path: ['r', 2], controlType: ControlType.EXTRACTION},
        {nodeId: 'r3', path: ['r', 3], controlType: ControlType.INGESTION, ingestionHash: 'kHash'},
        {nodeId: 'r4', path: ['r', 4], controlType: ControlType.EXTRACTION},
        {nodeId: 'r5', path: ['r', 5], controlType: ControlType.INGESTION, ingestionHash: 'mHash'},
        {nodeId: 'r6', path: ['r', 6], controlType: ControlType.EXTRACTION},
      ] as MPartial
      const result = [{
        subProcessId: 'r5',
        subProcessType: SubProcessType.INGESTION,
        inputSubProcesses: [],
        inputSubProcessesAll: [],
        subProcessInputLink: 'mHash',
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r6',
        subProcessType: SubProcessType.EXTRACTION,
        inputSubProcesses: ['r5'],
        inputSubProcessesAll: ['r5'],
        subProcessInputLink: '',
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r3',
        subProcessType: SubProcessType.INGESTION,
        inputSubProcesses: [],
        inputSubProcessesAll: [],
        subProcessInputLink: 'kHash',
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r4',
        subProcessType: SubProcessType.EXTRACTION,
        inputSubProcesses: ['r3', 'r6'],
        inputSubProcessesAll: ['r3', 'r6', 'r5'],
        subProcessInputLink: '',
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r0',
        subProcessType: SubProcessType.INGESTION,
        inputSubProcesses: [],
        inputSubProcessesAll: [],
        subProcessInputLink: 'hHash',
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r1',
        subProcessType: SubProcessType.EXTRACTION,
        inputSubProcesses: ['r0'],
        inputSubProcessesAll: ['r0'],
        subProcessInputLink: '',
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r2',
        subProcessType: SubProcessType.EXTRACTION,
        inputSubProcesses: ['r1', 'r4'],
        inputSubProcessesAll: ['r1', 'r4', 'r0', 'r3', 'r6', 'r5'],
        subProcessInputLink: '',
        subProcessPromptOverride: ''
      }] as SubProcess[]
      mapInit(test)
      expect(getSubProcessList(test as M, 'r2')).toEqual(result)
    }
  )
})
