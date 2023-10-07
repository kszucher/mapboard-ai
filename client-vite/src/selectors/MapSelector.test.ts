import {mapDeInit} from "../reducers/MapDeInit"
import {mapInit} from "../reducers/MapInit"
import {ControlTypes, Sides} from "../state/Enums"
import {M, MPartial, T} from "../state/MapStateTypes"
import {getReadableTree, getSubProcessList, lToCb, ReadableTree, rToCb, sortNode, SubProcess, SubProcessTypes} from "./MapSelector"

describe("Selector_tests", () => {
  test('lToCb', () => expect(mapDeInit(lToCb(mapInit([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['l', 0], fromNodeId: 'g', toNodeId: 'h'},
      {nodeId: 'c', path: ['l', 1], fromNodeId: 'g', toNodeId: 'i'},
      {nodeId: 'd', path: ['l', 2], fromNodeId: 'g', toNodeId: 'j'},
      {nodeId: 'e', path: ['l', 3], fromNodeId: 'i', toNodeId: 'j'},
      {nodeId: 'f', path: ['l', 4], fromNodeId: 'i', toNodeId: 'k'},
      {nodeId: 'g', path: ['r', 0]},
      {nodeId: 'h', path: ['r', 1]},
      {nodeId: 'i', path: ['r', 2], selected: 1},
      {nodeId: 'j', path: ['r', 3], selected: 2},
      {nodeId: 'k', path: ['r', 4], selected: 3},
    ] as M) as M)).sort(sortNode)).toEqual(([
      {nodeId: 'e', path: ['l', 0], fromNodeId: 'i', toNodeId: 'j'},
      {nodeId: 'f', path: ['l', 1], fromNodeId: 'i', toNodeId: 'k'},
    ] as M).sort(sortNode))
  )
  test('rToCb', () => expect(mapDeInit(rToCb(mapInit([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 1]},
      {nodeId: 'f', path: ['r', 1, 'd', 0]},
      {nodeId: 'g', path: ['r', 1, 'd', 0, 's', 0]},
      {nodeId: 'h', path: ['r', 2], selected: 1},
      {nodeId: 'i', path: ['r', 2, 'd', 0]},
      {nodeId: 'j', path: ['r', 2, 'd', 0, 's', 0]},
      {nodeId: 'k', path: ['r', 3]},
      {nodeId: 'l', path: ['r', 3, 'd', 0]},
      {nodeId: 'm', path: ['r', 3, 'd', 0, 's', 0]},
      {nodeId: 'n', path: ['r', 4], selected: 2},
      {nodeId: 'o', path: ['r', 4, 'd', 0]},
      {nodeId: 'p', path: ['r', 4, 'd', 0, 's', 0]},
      {nodeId: 'q', path: ['r', 5]},
      {nodeId: 'r', path: ['r', 5, 'd', 0]},
      {nodeId: 's', path: ['r', 5, 'd', 0, 's', 0]},
    ] as M) as M)).sort(sortNode)).toEqual(([
      {nodeId: 'h', path: ['r', 0], selected: 1},
      {nodeId: 'i', path: ['r', 0, 'd', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'n', path: ['r', 1], selected: 2},
      {nodeId: 'o', path: ['r', 1, 'd', 0]},
      {nodeId: 'p', path: ['r', 1, 'd', 0, 's', 0]},
    ] as M).sort(sortNode))
  )
  test('getReadableTree', () => expect(getReadableTree(mapInit([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0], selected: 1, content: 'contentR0'},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], content: 'contentR0D0S0'},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1], content: 'contentR0D0S1'},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2], content: 'contentR0D0S2'},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 2, 's', 0], content: 'contentR0D0S2S0'},
    ] as MPartial) as M, {nodeId: 'b', path: ['r', 0], selected: 1, content: 'contentR0'} as T)).toEqual([
      {nodeId: 'b', contentList: ['contentR0']},
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
      {nodeId: 'h', path: ['r', 0], content: 'ch', controlType: ControlTypes.UPLOAD, selected: 1},
      {nodeId: 'i', path: ['r', 1], content: 'ci', controlType: ControlTypes.GENERATE},
      {nodeId: 'j', path: ['r', 2], content: 'cj', controlType: ControlTypes.GENERATE},
      {nodeId: 'k', path: ['r', 3], content: 'ck', controlType: ControlTypes.UPLOAD},
      {nodeId: 'l', path: ['r', 4], content: 'cl', controlType: ControlTypes.GENERATE},
      {nodeId: 'm', path: ['r', 5], content: 'cm', controlType: ControlTypes.UPLOAD},
      {nodeId: 'n', path: ['r', 6], content: 'cn', controlType: ControlTypes.GENERATE},
    ] as MPartial) as M)).toEqual([{
      subProcessId: 'm',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'm', contentList: ['cm']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'n',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'n', contentList: ['cn']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'k',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'k', contentList: ['ck']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'l',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'l', contentList: ['cl']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'h',
      subProcessType: SubProcessTypes.INGESTION,
      subProcessMindMapData: [{nodeId: 'h', contentList: ['ch']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'i',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'i', contentList: ['ci']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }, {
      subProcessId: 'j',
      subProcessType: SubProcessTypes.EXTRACTION,
      subProcessMindMapData: [{nodeId: 'j', contentList: ['cj']}] as ReadableTree,
      inputSubProcesses: [''],
      shouldQueryAndStoreResultAsMindMapToo: false,
      subProcessInputLink: '',
      subProcessPromptOverride: ''
    }
    ] as SubProcess[])
  )
})
