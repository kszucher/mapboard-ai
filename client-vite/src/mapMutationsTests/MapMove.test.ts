import {setIsTesting} from "../utils/Utils.ts"
import {MPartial} from "../state/MapStateTypes.ts"
import {mapDeInit} from "../mapMutations/MapDeInit.ts"
import {mapInit} from "../mapMutations/MapInit.ts"
import {mapMutations} from "../mapMutations/MapMutations.ts"
import {MM} from "../mapMutations/MapMutationsEnum.ts"
import {mapChain} from "../mapMutations/MapChain.ts"
import {sortNode} from "../mapMutations/MapSort.ts"

describe("MapMoveTests", () => {
  beforeEach(() => setIsTesting() as any)
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.duplicateR)).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: 'r0s3', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'r0s3s0c00', path: ['r', 0, 's', 3, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s4', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: 'r0s4s0', path: ['r', 0, 's', 4, 's', 0]},
      {nodeId: 'r0s3', path: ['r', 0, 's', 5]},
      {nodeId: 'r0s3s0', path: ['r', 0, 's', 5, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.duplicateS)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveSD)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveST)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveSU)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveSB)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveSO)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveSI)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveCRD)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveCRU)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveCCR)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveCCL)).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0s0c00', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0s0c10', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0s0c20', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.moveS2T)).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapMutations(mapChain(mapInit(test)), MM.transpose)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
})
