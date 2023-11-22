import {mapDeInit} from "../reducers/MapDeInit"
import {mapInit} from "../reducers/MapInit"
import {M} from "../state/MapStateTypes"
import {lToCb, rToCb, sortNode} from "./MapSelector"

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
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 1]},
      {nodeId: 'g', path: ['r', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 2], selected: 1},
      {nodeId: 'j', path: ['r', 2, 's', 0]},
      {nodeId: 'k', path: ['r', 3]},
      {nodeId: 'm', path: ['r', 3, 's', 0]},
      {nodeId: 'n', path: ['r', 4], selected: 2},
      {nodeId: 'p', path: ['r', 4, 's', 0]},
      {nodeId: 'q', path: ['r', 5]},
      {nodeId: 's', path: ['r', 5, 's', 0]},
    ] as M) as M)).sort(sortNode)).toEqual(([
      {nodeId: 'h', path: ['r', 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 's', 0]},
      {nodeId: 'n', path: ['r', 1], selected: 2},
      {nodeId: 'p', path: ['r', 1, 's', 0]},
    ] as M).sort(sortNode))
  )
})
