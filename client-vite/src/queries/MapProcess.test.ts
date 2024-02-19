import {mapInit} from "../reducers/MapInit"
import {ControlType, Side, SubProcessType} from "../state/Enums"
import {M, MPartial} from "../state/MapStateTypes"
import {getSubProcessList} from "./MapProcess"
import {ReadableTree, SubProcess} from "./MapProcessTypes.ts"

describe("MapProcessTests", () => {
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
      {nodeId: 'la', path: ['l', 0], fromNodeId: 'ta', fromNodeSide: Side.R, toNodeId: 'tb', toNodeSide: Side.L},
      {nodeId: 'lb', path: ['l', 1], fromNodeId: 'tb', fromNodeSide: Side.R, toNodeId: 'tc', toNodeSide: Side.L},
      {nodeId: 'lc', path: ['l', 2], fromNodeId: 'td', fromNodeSide: Side.R, toNodeId: 'te', toNodeSide: Side.L},
      {nodeId: 'ld', path: ['l', 3], fromNodeId: 'te', fromNodeSide: Side.R, toNodeId: 'tc', toNodeSide: Side.L},
      {nodeId: 'le', path: ['l', 4], fromNodeId: 'tf', fromNodeSide: Side.R, toNodeId: 'tg', toNodeSide: Side.L},
      {nodeId: 'lf', path: ['l', 5], fromNodeId: 'tg', fromNodeSide: Side.R, toNodeId: 'te', toNodeSide: Side.L},
      {nodeId: 'ta', path: ['r', 0], controlType: ControlType.INGESTION, ingestionHash: 'hHash', selected: 1},
      {nodeId: 'tas', path: ['r', 0, 's', 0], content: 'tas'},
      {nodeId: 'tb', path: ['r', 1], controlType: ControlType.EXTRACTION},
      {nodeId: 'tbs', path: ['r', 1, 's', 0], content: 'tbs'},
      {nodeId: 'tc', path: ['r', 2], controlType: ControlType.EXTRACTION},
      {nodeId: 'tcs', path: ['r', 2, 's', 0], content: 'tcs'},
      {nodeId: 'td', path: ['r', 3], controlType: ControlType.INGESTION, ingestionHash: 'kHash'},
      {nodeId: 'tds', path: ['r', 3, 's', 0], content: 'tds'},
      {nodeId: 'te', path: ['r', 4], controlType: ControlType.EXTRACTION},
      {nodeId: 'tes', path: ['r', 4, 's', 0], content: 'tes'},
      {nodeId: 'tf', path: ['r', 5], controlType: ControlType.INGESTION, ingestionHash: 'mHash'},
      {nodeId: 'tfs', path: ['r', 5, 's', 0], content: 'tfs'},
      {nodeId: 'tg', path: ['r', 6], controlType: ControlType.EXTRACTION},
      {nodeId: 'tgs', path: ['r', 6, 's', 0], content: 'tgs'},
    ] as MPartial) as M, 'tc')).toEqual([{
      subProcessId: 'tf',
      subProcessType: SubProcessType.INGESTION,
      subProcessMindMapData: [{nodeId: 'tfs', contentList: ['tfs']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'mHash',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tg',
      subProcessType: SubProcessType.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tgs', contentList: ['tgs']}] as ReadableTree,
      inputSubProcesses: ['tf'],
      inputSubProcessesAll: ['tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'td',
      subProcessType: SubProcessType.INGESTION,
      subProcessMindMapData: [{nodeId: 'tds', contentList: ['tds']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'kHash',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'te',
      subProcessType: SubProcessType.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tes', contentList: ['tes']}] as ReadableTree,
      inputSubProcesses: ['td', 'tg'],
      inputSubProcessesAll: ['td', 'tg', 'tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'ta',
      subProcessType: SubProcessType.INGESTION,
      subProcessMindMapData: [{nodeId: 'tas', contentList: ['tas']}] as ReadableTree,
      inputSubProcesses: [],
      inputSubProcessesAll: [],
      subProcessInputLink: 'hHash',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tb',
      subProcessType: SubProcessType.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tbs', contentList: ['tbs']}] as ReadableTree,
      inputSubProcesses: ['ta'],
      inputSubProcessesAll: ['ta'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'tc',
      subProcessType: SubProcessType.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'tcs', contentList: ['tcs']}] as ReadableTree,
      inputSubProcesses: ['tb', 'te'],
      inputSubProcessesAll: ['tb', 'te', 'ta', 'td', 'tg', 'tf'],
      subProcessInputLink: '',
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessPromptOverride: ''
    }] as SubProcess[])
  )
})
