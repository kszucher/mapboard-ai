import {sortNode} from "../selectors/MapSelector"
import {setIsTesting} from "../utils/Utils"
import {M, MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"

describe("InsertTests", () => {
  beforeEach(() => setIsTesting() as any)
  test('insertSD', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 's', 3]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 't', path: ['r', 0, 's', 0, 's', 1], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 's', 3]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 's', 4]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSU', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 's', 3], selected: 1},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 't', path: ['r', 0, 's', 0, 's', 3], selected: 1},
      {nodeId: 'h', path: ['r', 0, 's', 0, 's', 4]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSO', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 't', path: ['r', 0, 's', 0, 's', 1], selected: 1},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSO', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCRD', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCRD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCRU', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 1},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 2, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 2, 1], selected: 1},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCRU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCCR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCCR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCCL', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 1},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 2], selected: 1},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 2], selected: 1},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCCL', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCRD', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCRD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCRU', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCRU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCCR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCCR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCCL', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'u', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'v', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCCL', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
})
