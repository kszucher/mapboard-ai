import {MPartial} from "../state/MapStateTypes.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {_assert} from "./_assert.ts"

describe("MapMoveTests", () => {
  beforeEach(() => {})
  test('duplicateR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'l0', path: ['l', 0], fromNodeId: 'r0', toNodeId: 'r1'},
      {nodeId: 'l1', path: ['l', 1], fromNodeId: 'r0', toNodeId: 'r2'},
      {nodeId: 'l2', path: ['l', 2], fromNodeId: 'r0', toNodeId: 'r3'},
      {nodeId: 'l3', path: ['l', 3], fromNodeId: 'r1', toNodeId: 'r2'},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r1', path: ['r', 1], selected: 1, offsetW: 100, offsetH: 200},
      {nodeId: 'r1s0', path: ['r', 1, 's', 0]},
      {nodeId: 'r2', path: ['r', 2], selected: 2, offsetW: 110, offsetH: 220},
      {nodeId: 'r2s0', path: ['r', 2, 's', 0]},
      {nodeId: 'r3', path: ['r', 3]},
      {nodeId: 'r3s0', path: ['r', 3, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'l0', path: ['l', 0], fromNodeId: 'r0', toNodeId: 'r1'},
      {nodeId: 'l1', path: ['l', 1], fromNodeId: 'r0', toNodeId: 'r2'},
      {nodeId: 'l2', path: ['l', 2], fromNodeId: 'r0', toNodeId: 'r3'},
      {nodeId: 'l3', path: ['l', 3], fromNodeId: 'r1', toNodeId: 'r2'},
      {nodeId: 'l4', path: ['l', 4], fromNodeId: 'r4', toNodeId: 'r5'},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r1', path: ['r', 1], offsetW: 100, offsetH: 200},
      {nodeId: 'r1s0', path: ['r', 1, 's', 0]},
      {nodeId: 'r2', path: ['r', 2], offsetW: 110, offsetH: 220},
      {nodeId: 'r2s0', path: ['r', 2, 's', 0]},
      {nodeId: 'r3', path: ['r', 3]},
      {nodeId: 'r3s0', path: ['r', 3, 's', 0]},
      {nodeId: 'r4', path: ['r', 4], selected: 1},
      {nodeId: 'r4s0', path: ['r', 4, 's', 0]},
      {nodeId: 'r5', path: ['r', 5], selected: 2, offsetW: 10, offsetH: 20},
      {nodeId: 'r5s0', path: ['r', 5, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.duplicateR)
  })
  test('duplicateS', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s1s0c00', path: ['r', 0, 's', 1, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 3]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s1s0c00', path: ['r', 0, 's', 1, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2]},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: '_r0s3', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: '_r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: '_r0s3s0c00', path: ['r', 0, 's', 3, 's', 0, 'c', 0, 0]},
      {nodeId: '_r0s4', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: '_r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 5]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 5, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.duplicateS)
  })
  test('moveSD', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 3]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4]},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 1]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 2], selected: 1},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 3], selected: 2},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4]},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveSD)
  })
  test('moveST', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2]},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 1], selected: 2},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 2]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 3]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 4]},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveST)
  })
  test('moveSU', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2], selected: 1},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 3], selected: 2},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4]},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 3]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4]},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveSU)
  })
  test('moveSB', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1], selected: 2},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2]},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 3]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4]},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 1]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 2]},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveSB)
  })
  test('moveSO', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'r0s1s1', path: ['r', 0, 's', 1, 's', 1]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s2s1', path: ['r', 0, 's', 2, 's', 1]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 0, 's', 2], selected: 1},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s1s1', path: ['r', 0, 's', 0, 's', 2, 's', 1]},
      {nodeId: 'r0s2', path: ['r', 0, 's', 0, 's', 3], selected: 2},
      {nodeId: 'r0s2s0', path: ['r', 0, 's', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s2s1', path: ['r', 0, 's', 0, 's', 3, 's', 1]},
    ] as MPartial
    _assert(test, result, MM.moveSO)
  })
  test('moveSI', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 2], selected: 1},
      {nodeId: 'r0s0s3', path: ['r', 0, 's', 0, 's', 3], selected: 2},
      {nodeId: 'r0s0s3s0', path: ['r', 0, 's', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s0s4', path: ['r', 0, 's', 0, 's', 4]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 1]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s4', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'r0s0s3', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'r0s0s3s0', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'r0s1', path: ['r', 0, 's', 3]},
      {nodeId: 'r0s1s0', path: ['r', 0, 's', 3, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveSI)
  })
  test('moveCRD', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
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
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveCRD)
  })
  test('moveCRU', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
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
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveCRU)
  })
  test('moveCCR', () => {
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
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveCCR)
  })
  test('moveCCL', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveCCL)
  })
  test('moveS2T', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: '_r0s0s0', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: '_r0s0s0c00', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: '_r0s0s0c10', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0s0c20', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.moveS2T)
  })
  test('transpose', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c02', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'r0s0c02s0', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'r0s0c12', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'r0s0c12s0', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'r0s0c02', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0c02s0', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'r0s0c12', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'r0s0c12s0', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.transpose)
  })
})
