import {sortNode} from "../queries/MapQueries.ts"
import {setIsTesting} from "../utils/Utils"
import {MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapChain} from "./MapChain.ts"
import {mapReducerAtomic} from "./MapReducer"
import {MR} from "./MapReducerEnum.ts"

describe("MapInsertTests", () => {
  beforeEach(() => setIsTesting() as any)
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
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSD, {})).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSU, {})).sort(sortNode)).toEqual((result).sort(sortNode))
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
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSSO, {})).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertCRD, {})).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 2, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 2, 1], selected: 1},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertCRU, {})).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertCCR, {})).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 2], selected: 1},
      {nodeId: 'r0s0c01s0', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c10s0', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: '_r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 2], selected: 1},
      {nodeId: 'r0s0c11s0', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertCCL)).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: '_r0s0c21', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSCRD)).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: '_r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSCRU)).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: '_r0s0c12', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSCCR)).sort(sortNode)).toEqual((result).sort(sortNode))
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
      {nodeId: 'r0s0c00', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'r0s0c01', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: '_r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'r0s0c10', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'r0s0c11', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.insertSCCL)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
})
