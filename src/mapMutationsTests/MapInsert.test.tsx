import {MPartial} from "../mapState/MapStateTypes.ts"
import {MM} from "../mapMutations/MapMutationEnum.ts"
import {_assert} from "./_assert.ts"

describe("MapInsertTests", () => {
  beforeEach(() => {})
  test('insertR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: '_r1', path: ['r', 1], selected: 1},
      {nodeId: '_r1s0', path: ['r', 1, 's', 0], content: 'New Root'},
    ] as MPartial
    _assert(test, result, MM.insertR)
  })
  test('insertSD', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'r0s0s3', path: ['r', 0, 's', 0, 's', 3]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: '_r0s0s1', path: ['r', 0, 's', 0, 's', 1], selected: 1},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 3]},
      {nodeId: 'r0s0s3', path: ['r', 0, 's', 0, 's', 4]},
    ] as MPartial
    _assert(test, result, MM.insertSD)
  })
  test('insertSU', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'r0s0s3', path: ['r', 0, 's', 0, 's', 3], selected: 1},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'r0s0s1', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'r0s0s2', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: '_r0s0s3', path: ['r', 0, 's', 0, 's', 3], selected: 1},
      {nodeId: 'r0s0s3', path: ['r', 0, 's', 0, 's', 4]},
    ] as MPartial
    _assert(test, result, MM.insertSU)
  })
  test('insertSSO', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0s0', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: '_r0s0s1', path: ['r', 0, 's', 0, 's', 1], selected: 1},
    ] as MPartial
    _assert(test, result, MM.insertSSO)
  })
  test('insertCRD', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
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
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: '_r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: '_r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertCRD)
  })
  test('insertCRU', () => {
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
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 1},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: '_r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: '_r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 2, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 2, 1], selected: 1},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertCRU)
  })
  test('insertCCR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: '_r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: '_r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertCCR)
  })
  test('insertCCL', () => {
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
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 1},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: '_r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: '_r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 2], selected: 1},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 2], selected: 1},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertCCL)
  })
  test('insertSCRD', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c20', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: '_r0s0c20s0', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: '_r0s0c21', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: '_r0s0c21s0', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertSCRD)
  })
  test('insertSCRU', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: '_r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: '_r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: '_r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: '_r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    _assert(test, result, MM.insertSCRU)
  })
  test('insertSCCR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: '_r0s0c02', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: '_r0s0c02s0', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c12', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: '_r0s0c12s0', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertSCCR)
  })
  test('insertSCCL', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: '_r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: '_r0s0c00s0', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: '_r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: '_r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    _assert(test, result, MM.insertSCCL)
  })
  test('insertTable', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0], selected: 1},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: 'r0s0', path: ['r', 0, 's', 0]},
      {nodeId: '_r0s0s0', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: '_r0s0s0c00', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0]},
      {nodeId: '_r0s0s0c00s0', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: '_r0s0s0c01', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 1]},
      {nodeId: '_r0s0s0c01s0', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: '_r0s0s0c10', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0]},
      {nodeId: '_r0s0s0c10s0', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0s0c11', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0s0c11s0', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: '_r0s0s0c20', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0]},
      {nodeId: '_r0s0s0c20s0', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: '_r0s0s0c21', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 1]},
      {nodeId: '_r0s0s0c21s0', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    _assert(test, result, MM.insertSOTable, {rowLen: 3, colLen: 2})
  })
})
