import {mapDeInit} from "../reducers/MapDeInit"
import {mapInit} from "../reducers/MapInit"
import {Sides} from "../state/Enums"
import {M, MPartial, T} from "../state/MapStateTypes"
import {getDependencySortedR, getReadableTree, lToCb, rToCb, sortNode} from "./MapSelector"

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
    ] as {nodeId: string, contentList: string[]}[])
  )
  test('getDependencySortedR', () => expect(getDependencySortedR(mapInit([
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['l', 0], fromNodeId: 'h', fromNodeSide: Sides.R, toNodeId: 'i', toNodeSide: Sides.L},
      {nodeId: 'c', path: ['l', 1], fromNodeId: 'i', fromNodeSide: Sides.R, toNodeId: 'j', toNodeSide: Sides.L},
      {nodeId: 'd', path: ['l', 2], fromNodeId: 'k', fromNodeSide: Sides.R, toNodeId: 'l', toNodeSide: Sides.L},
      {nodeId: 'e', path: ['l', 3], fromNodeId: 'l', fromNodeSide: Sides.R, toNodeId: 'j', toNodeSide: Sides.L},
      {nodeId: 'f', path: ['l', 4], fromNodeId: 'm', fromNodeSide: Sides.R, toNodeId: 'n', toNodeSide: Sides.L},
      {nodeId: 'g', path: ['l', 5], fromNodeId: 'n', fromNodeSide: Sides.R, toNodeId: 'l', toNodeSide: Sides.L},
      {nodeId: 'h', path: ['r', 0], selected: 1},
      {nodeId: 'i', path: ['r', 1]},
      {nodeId: 'j', path: ['r', 2]},
      {nodeId: 'k', path: ['r', 3]},
      {nodeId: 'l', path: ['r', 4]},
      {nodeId: 'm', path: ['r', 5]},
      {nodeId: 'n', path: ['r', 6]},
    ] as MPartial) as M)).toEqual([
      {nodeId: 'm'},
      {nodeId: 'n'},
      {nodeId: 'k'},
      {nodeId: 'l'},
      {nodeId: 'h'},
      {nodeId: 'i'},
      {nodeId: 'j'}
    ] as {nodeId: string}[])
  )
})
