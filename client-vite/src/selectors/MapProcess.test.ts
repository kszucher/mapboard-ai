import {mapInit} from "../reducers/MapInit"
import {ControlTypes, Sides, SubProcessTypes} from "../state/Enums"
import {M, MPartial} from "../state/MapStateTypes"
import {getSubProcessList} from "./MapProcess"
import {ReadableTree, SubProcess} from "./MapProcessTypes.ts"

describe("Process_tests", () => {
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
      {nodeId: 'ta', path: ['r', 0], controlType: ControlTypes.INGESTION, llmDataType: 'text', llmDataId: 'hTextUrl', selected: 1},
      {nodeId: 'tas', path: ['r', 0, 's', 0], content: 'tas'},
      {nodeId: 'tb', path: ['r', 1], controlType: ControlTypes.EXTRACTION},
      {nodeId: 'tbs', path: ['r', 1, 's', 0], content: 'tbs'},
      {nodeId: 'tc', path: ['r', 2], controlType: ControlTypes.EXTRACTION},
      {nodeId: 'tcs', path: ['r', 2, 's', 0], content: 'tcs'},
      {nodeId: 'td', path: ['r', 3], controlType: ControlTypes.INGESTION, llmDataType: 'audio', llmDataId: 'kAudioUrl'},
      {nodeId: 'tds', path: ['r', 3, 's', 0], content: 'tds'},
      {nodeId: 'te', path: ['r', 4], controlType: ControlTypes.EXTRACTION},
      {nodeId: 'tes', path: ['r', 4, 's', 0], content: 'tes'},
      {nodeId: 'tf', path: ['r', 5], controlType: ControlTypes.INGESTION, llmDataType: 'text', llmDataId: 'mTextUrl'},
      {nodeId: 'tfs', path: ['r', 5, 's', 0], content: 'tfs'},
      {nodeId: 'tg', path: ['r', 6], controlType: ControlTypes.EXTRACTION},
      {nodeId: 'tgs', path: ['r', 6, 's', 0], content: 'tgs'},
    ] as MPartial) as M, 'tc')).toEqual([{
      subProcessId: 'tf',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'tfs', contentList: ['tfs']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'mTextUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tg',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tgs', contentList: ['tgs']}] as ReadableTree,
      inputSubProcesses: ['tf'],
      inputSubProcessesAll: ['tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'td',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'tds', contentList: ['tds']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'kAudioUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'te',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tes', contentList: ['tes']}] as ReadableTree,
      inputSubProcesses: ['td', 'tg'],
      inputSubProcessesAll: ['td', 'tg', 'tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'ta',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'tas', contentList: ['tas']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'hTextUrl',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tb',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tbs', contentList: ['tbs']}] as ReadableTree,
      inputSubProcesses: ['ta'],
      inputSubProcessesAll: ['ta'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tc',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tcs', contentList: ['tcs']}] as ReadableTree,
      inputSubProcesses: ['tb', 'te'],
      inputSubProcessesAll: ['tb', 'te', 'ta', 'td', 'tg', 'tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }] as SubProcess[])
  )
})
