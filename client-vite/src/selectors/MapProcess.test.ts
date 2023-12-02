import {mapInit} from "../reducers/MapInit"
import {ControlTypes, Sides, SubProcessTypes} from "../state/Enums"
import {M, MPartial, T} from "../state/MapStateTypes"
import {getReadableTree, getSubProcessList} from "./MapProcess"
import {ReadableTree, SubProcess} from "./MapProcessTypes.ts"

describe("Process_tests", () => {
  test('getReadableTree', () => expect(getReadableTree(mapInit([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0], selected: 1, content: 'contentR0'},
      {nodeId: 'd', path: ['r', 0, 's', 0], content: 'contentR0D0S0'},
      {nodeId: 'e', path: ['r', 0, 's', 1], content: 'contentR0D0S1'},
      {nodeId: 'f', path: ['r', 0, 's', 2], content: 'contentR0D0S2'},
      {nodeId: 'g', path: ['r', 0, 's', 2, 's', 0], content: 'contentR0D0S2S0'},
    ] as MPartial) as M, {nodeId: 'b', path: ['r', 0], selected: 1, content: 'contentR0'} as T)).toEqual([
      {nodeId: 'd', contentList: ['contentR0', 'contentR0D0S0']},
      {nodeId: 'e', contentList: ['contentR0', 'contentR0D0S1']},
      {nodeId: 'g', contentList: ['contentR0', 'contentR0D0S2', 'contentR0D0S2S0']},
    ] as ReadableTree)
  )
  test('getSubProcessList', () =>
    //      [h]
    //         \
    //          [i]
    //             \
    //      [k]     [j]
    //         \   /
    //          [l]
    //         /
    //      [n]
    //     /
    //  [m]
    expect(getSubProcessList(mapInit([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['l', 0], fromNodeId: 'h', fromNodeSide: Sides.R, toNodeId: 'i', toNodeSide: Sides.L},
      {nodeId: 'c', path: ['l', 1], fromNodeId: 'i', fromNodeSide: Sides.R, toNodeId: 'j', toNodeSide: Sides.L},
      {nodeId: 'd', path: ['l', 2], fromNodeId: 'k', fromNodeSide: Sides.R, toNodeId: 'l', toNodeSide: Sides.L},
      {nodeId: 'e', path: ['l', 3], fromNodeId: 'l', fromNodeSide: Sides.R, toNodeId: 'j', toNodeSide: Sides.L},
      {nodeId: 'f', path: ['l', 4], fromNodeId: 'm', fromNodeSide: Sides.R, toNodeId: 'n', toNodeSide: Sides.L},
      {nodeId: 'g', path: ['l', 5], fromNodeId: 'n', fromNodeSide: Sides.R, toNodeId: 'l', toNodeSide: Sides.L},
      {nodeId: 'h', path: ['r', 0], content: 'ch', controlType: ControlTypes.INGESTION, llmDataType: 'text', llmDataId: 'hTextUrl', selected: 1},
      {nodeId: 'i', path: ['r', 1], content: 'ci', controlType: ControlTypes.EXTRACTION},
      {nodeId: 'j', path: ['r', 2], content: 'cj', controlType: ControlTypes.EXTRACTION},
      {nodeId: 'k', path: ['r', 3], content: 'ck', controlType: ControlTypes.INGESTION, llmDataType: 'audio', llmDataId: 'kAudioUrl'},
      {nodeId: 'l', path: ['r', 4], content: 'cl', controlType: ControlTypes.EXTRACTION},
      {nodeId: 'm', path: ['r', 5], content: 'cm', controlType: ControlTypes.INGESTION, llmDataType: 'text', llmDataId: 'mTextUrl'},
      {nodeId: 'n', path: ['r', 6], content: 'cn', controlType: ControlTypes.EXTRACTION},
    ] as MPartial) as M, 'j')).toEqual([{
      subProcessId: 'm',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'm', contentList: ['cm']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'mTextUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'n',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'n', contentList: ['cn']}] as ReadableTree,
      inputSubProcesses: ['m'],
      inputSubProcessesAll: ['m'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'k',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'k', contentList: ['ck']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'kAudioUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'l',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'l', contentList: ['cl']}] as ReadableTree,
      inputSubProcesses: ['k', 'n'],
      inputSubProcessesAll: ['k', 'n', 'm'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'h',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'h', contentList: ['ch']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'hTextUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'i',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'i', contentList: ['ci']}] as ReadableTree,
      inputSubProcesses: ['h'],
      inputSubProcessesAll: ['h'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'j',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'j', contentList: ['cj']}] as ReadableTree,
      inputSubProcesses: ['i', 'l'],
      inputSubProcessesAll: ['i', 'l', 'h', 'k', 'n', 'm'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }] as SubProcess[])
  )
})
