import {mapInit} from "../mapMutations/MapInit.ts"
import {ControlType, Side, SubProcessType} from "../state/Enums.ts"
import {M, MPartial} from "../state/MapStateTypes.ts"
import {getSubProcessList} from "../mapQueries/MapProcess.ts"
import {ReadableTree, SubProcess} from "../mapQueries/MapProcessTypes.ts"

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
        {nodeId: 'r0s0', path: ['r', 0, 's', 0], content: 'r0s0'},
        {nodeId: 'r1', path: ['r', 1], controlType: ControlType.EXTRACTION},
        {nodeId: 'r1s0', path: ['r', 1, 's', 0], content: 'r1s0'},
        {nodeId: 'r2', path: ['r', 2], controlType: ControlType.EXTRACTION},
        {nodeId: 'r2s0', path: ['r', 2, 's', 0], content: 'r2s0'},
        {nodeId: 'r3', path: ['r', 3], controlType: ControlType.INGESTION, ingestionHash: 'kHash'},
        {nodeId: 'r3s0', path: ['r', 3, 's', 0], content: 'r3s0'},
        {nodeId: 'r4', path: ['r', 4], controlType: ControlType.EXTRACTION},
        {nodeId: 'r4s0', path: ['r', 4, 's', 0], content: 'r4s0'},
        {nodeId: 'r5', path: ['r', 5], controlType: ControlType.INGESTION, ingestionHash: 'mHash'},
        {nodeId: 'r5s0', path: ['r', 5, 's', 0], content: 'r5s0'},
        {nodeId: 'r6', path: ['r', 6], controlType: ControlType.EXTRACTION},
        {nodeId: 'r6s0', path: ['r', 6, 's', 0], content: 'r6s0'},
      ] as MPartial
      const result = [{
        subProcessId: 'r5',
        subProcessType: SubProcessType.INGESTION,
        subProcessMindMapData: [{nodeId: 'r5s0', contentList: ['r5s0']}] as ReadableTree,
        inputSubProcesses: [],
        inputSubProcessesAll: [],
        subProcessInputLink: 'mHash',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r6',
        subProcessType: SubProcessType.EXTRACTION,
        subProcessMindMapData: [{nodeId: 'r6s0', contentList: ['r6s0']}] as ReadableTree,
        inputSubProcesses: ['r5'],
        inputSubProcessesAll: ['r5'],
        subProcessInputLink: '',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r3',
        subProcessType: SubProcessType.INGESTION,
        subProcessMindMapData: [{nodeId: 'r3s0', contentList: ['r3s0']}] as ReadableTree,
        inputSubProcesses: [],
        inputSubProcessesAll: [],
        subProcessInputLink: 'kHash',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r4',
        subProcessType: SubProcessType.EXTRACTION,
        subProcessMindMapData: [{nodeId: 'r4s0', contentList: ['r4s0']}] as ReadableTree,
        inputSubProcesses: ['r3', 'r6'],
        inputSubProcessesAll: ['r3', 'r6', 'r5'],
        subProcessInputLink: '',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r0',
        subProcessType: SubProcessType.INGESTION,
        subProcessMindMapData: [{nodeId: 'r0s0', contentList: ['r0s0']}] as ReadableTree,
        inputSubProcesses: [],
        inputSubProcessesAll: [],
        subProcessInputLink: 'hHash',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r1',
        subProcessType: SubProcessType.EXTRACTION,
        subProcessMindMapData: [{nodeId: 'r1s0', contentList: ['r1s0']}] as ReadableTree,
        inputSubProcesses: ['r0'],
        inputSubProcessesAll: ['r0'],
        subProcessInputLink: '',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }, {
        subProcessId: 'r2',
        subProcessType: SubProcessType.EXTRACTION,
        subProcessMindMapData: [{nodeId: 'r2s0', contentList: ['r2s0']}] as ReadableTree,
        inputSubProcesses: ['r1', 'r4'],
        inputSubProcessesAll: ['r1', 'r4', 'r0', 'r3', 'r6', 'r5'],
        subProcessInputLink: '',
        shouldQueryAndStoreResultAsMindMapToo: false,
        subProcessPromptOverride: ''
      }] as SubProcess[]
      mapInit(test)
      expect(getSubProcessList(test as M, 'r2')).toEqual(result)
    }
  )
})
