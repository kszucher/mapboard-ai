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
    //      [ta]
    //         \
    //          [tb]
    //             \
    //      [td]     [tc]
    //         \   /
    //          [te]
    //         /
    //      [tg]
    //     /
    //  [tf]
    expect(getSubProcessList(mapInit([
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'la', path: ['l', 0], fromNodeId: 'ta', fromNodeSide: Sides.R, toNodeId: 'tb', toNodeSide: Sides.L},
      {nodeId: 'lb', path: ['l', 1], fromNodeId: 'tb', fromNodeSide: Sides.R, toNodeId: 'tc', toNodeSide: Sides.L},
      {nodeId: 'lc', path: ['l', 2], fromNodeId: 'td', fromNodeSide: Sides.R, toNodeId: 'te', toNodeSide: Sides.L},
      {nodeId: 'ld', path: ['l', 3], fromNodeId: 'te', fromNodeSide: Sides.R, toNodeId: 'tc', toNodeSide: Sides.L},
      {nodeId: 'le', path: ['l', 4], fromNodeId: 'tf', fromNodeSide: Sides.R, toNodeId: 'tg', toNodeSide: Sides.L},
      {nodeId: 'lf', path: ['l', 5], fromNodeId: 'tg', fromNodeSide: Sides.R, toNodeId: 'te', toNodeSide: Sides.L},
      {nodeId: 'ta', path: ['r', 0], content: 'cta', controlType: ControlTypes.INGESTION, llmDataType: 'text', llmDataId: 'hTextUrl', selected: 1},
      {nodeId: 'tb', path: ['r', 1], content: 'ctb', controlType: ControlTypes.EXTRACTION},
      {nodeId: 'tc', path: ['r', 2], content: 'ctc', controlType: ControlTypes.EXTRACTION},
      {nodeId: 'td', path: ['r', 3], content: 'ctd', controlType: ControlTypes.INGESTION, llmDataType: 'audio', llmDataId: 'kAudioUrl'},
      {nodeId: 'te', path: ['r', 4], content: 'cte', controlType: ControlTypes.EXTRACTION},
      {nodeId: 'tf', path: ['r', 5], content: 'ctf', controlType: ControlTypes.INGESTION, llmDataType: 'text', llmDataId: 'mTextUrl'},
      {nodeId: 'tg', path: ['r', 6], content: 'ctg', controlType: ControlTypes.EXTRACTION},
    ] as MPartial) as M, 'tc')).toEqual([{
      subProcessId: 'tf',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'tf', contentList: ['ctf']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'mTextUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tg',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tg', contentList: ['ctg']}] as ReadableTree,
      inputSubProcesses: ['tf'],
      inputSubProcessesAll: ['tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'td',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'td', contentList: ['ctd']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'kAudioUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'te',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'te', contentList: ['cte']}] as ReadableTree,
      inputSubProcesses: ['td', 'tg'],
      inputSubProcessesAll: ['td', 'tg', 'tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'ta',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'ta', contentList: ['cta']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'hTextUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tb',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tb', contentList: ['ctb']}] as ReadableTree,
      inputSubProcesses: ['ta'],
      inputSubProcessesAll: ['ta'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tc',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tc', contentList: ['ctc']}] as ReadableTree,
      inputSubProcesses: ['tb', 'te'],
      inputSubProcessesAll: ['tb', 'te', 'ta', 'td', 'tg', 'tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }] as SubProcess[])
  )
})
