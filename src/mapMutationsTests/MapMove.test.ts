import {M, MPartial} from "../mapState/MapStateTypes.ts"
import {_assert} from "./_assert.ts"
import {Side} from "../consts/Enums.ts"
import {mapMutations} from "../mapMutations/MapMutations.ts"

describe("MapMoveTests", () => {
  beforeEach(() => {})
  test('duplicateR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'l0', path: ['l', 0], fromNodeId: 'r0', fromNodeSide: Side.L, toNodeId: 'r1', toNodeSide: Side.R},
      {nodeId: 'l1', path: ['l', 1], fromNodeId: 'r0', fromNodeSide: Side.L, toNodeId: 'r2', toNodeSide: Side.R},
      {nodeId: 'l2', path: ['l', 2], fromNodeId: 'r0', fromNodeSide: Side.L, toNodeId: 'r3', toNodeSide: Side.R},
      {nodeId: 'l3', path: ['l', 3], fromNodeId: 'r1', fromNodeSide: Side.L, toNodeId: 'r2', toNodeSide: Side.R},
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
      {nodeId: 'l0', path: ['l', 0], fromNodeId: 'r0', fromNodeSide: Side.L, toNodeId: 'r1', toNodeSide: Side.R},
      {nodeId: 'l1', path: ['l', 1], fromNodeId: 'r0', fromNodeSide: Side.L, toNodeId: 'r2', toNodeSide: Side.R},
      {nodeId: 'l2', path: ['l', 2], fromNodeId: 'r0', fromNodeSide: Side.L, toNodeId: 'r3', toNodeSide: Side.R},
      {nodeId: 'l3', path: ['l', 3], fromNodeId: 'r1', fromNodeSide: Side.L, toNodeId: 'r2', toNodeSide: Side.R},
      {nodeId: '_l4', path: ['l', 4], fromNodeId: '_r4', fromNodeSide: Side.L, toNodeId: '_r5', toNodeSide: Side.R},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r1', path: ['r', 1], offsetW: 100, offsetH: 200},
      {nodeId: 'r1s0', path: ['r', 1, 's', 0]},
      {nodeId: 'r2', path: ['r', 2], offsetW: 110, offsetH: 220},
      {nodeId: 'r2s0', path: ['r', 2, 's', 0]},
      {nodeId: 'r3', path: ['r', 3]},
      {nodeId: 'r3s0', path: ['r', 3, 's', 0]},
      {nodeId: '_r4', path: ['r', 4], selected: 1},
      {nodeId: '_r4s0', path: ['r', 4, 's', 0]},
      {nodeId: '_r5', path: ['r', 5], selected: 2, offsetW: 10, offsetH: 20},
      {nodeId: '_r5s0', path: ['r', 5, 's', 0]},
    ] as MPartial
    _assert(test, result, (m: M) => mapMutations.duplicateR(m))
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
    _assert(test, result, (m: M) => mapMutations.duplicateS(m))
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
    _assert(test, result, (m: M) => mapMutations.moveSD(m))
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
    _assert(test, result, (m: M) => mapMutations.moveST(m))
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
    _assert(test, result, (m: M) => mapMutations.moveSU(m))
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
    _assert(test, result, (m: M) => mapMutations.moveSB(m))
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
    _assert(test, result, (m: M) => mapMutations.moveSO(m))
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
    _assert(test, result, (m: M) => mapMutations.moveSI(m))
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
    _assert(test, result, (m: M) => mapMutations.moveCRD(m))
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
    _assert(test, result, (m: M) => mapMutations.moveCRU(m))
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
    _assert(test, result, (m: M) => mapMutations.moveCCR(m))
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
    _assert(test, result, (m: M) => mapMutations.moveCCL(m))
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
    _assert(test, result, (m: M) => mapMutations.moveS2T(m))
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
    _assert(test, result, (m: M) => mapMutations.transpose(m))
  })
})
