import {MPartial} from "../state/MapStateTypes.ts"
import {MM} from "../mapMutations/MapMutationsEnum.ts"
import {_assert} from "./_assert.ts"

describe("MapDeleteTests", () => {
  test('deleteLR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'l0', path: ['l', 0], fromNodeId: 'r0', toNodeId: 'r1'},
      {nodeId: 'l1', path: ['l', 1], fromNodeId: 'r0', toNodeId: 'r2'},
      {nodeId: 'l2', path: ['l', 2], fromNodeId: 'r1', toNodeId: 'r2'},
      {nodeId: 'r0', path: ['r', 0], offsetW: 120, offsetH: 230},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r1', path: ['r', 1], offsetW: 340, offsetH: 450, selected: 1},
      {nodeId: 'r1s0', path: ['r', 1, 's', 0]},
      {nodeId: 'r2', path: ['r', 2], offsetW: 560, offsetH: 780},
      {nodeId: 'r2s0', path: ['r', 2, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'l1', path: ['l', 0], fromNodeId: 'r0', toNodeId: 'r2'},
      {nodeId: 'r0', path: ['r', 0], selected: 1},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r2', path: ['r', 1], offsetW: 440, offsetH: 550},
      {nodeId: 'r2s0', path: ['r', 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.deleteLR)
  })
  test('deleteS', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0s0s0', path: ['r', 0, 's', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s0s1', path: ['r', 0, 's', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s0s2', path: ['r', 0, 's', 0, 's', 0, 's', 2]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1], selected: 2},
      {nodeId: 'r0s0s1s0', path: ['r', 0, 's', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s0s1s1', path: ['r', 0, 's', 0, 's', 1, 's', 1]},
      {nodeId: 'r0s0s1s2', path: ['r', 0, 's', 0, 's', 1, 's', 2]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'r0s0s2s0', path: ['r', 0, 's', 0, 's', 2, 's', 0], selected: 3},
      {nodeId: 'r0s0s2s1', path: ['r', 0, 's', 0, 's', 2, 's', 1], selected: 4},
      {nodeId: 'r0s0s2s2', path: ['r', 0, 's', 0, 's', 2, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0], selected: 1},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s2s2', path: ['r', 0, 's', 0, 's', 0, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.deleteSJumpR)
  })
  test('deleteCR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.deleteCRJumpD)
  })
  test('deleteCC', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.deleteCCJumpR)
  })
})
