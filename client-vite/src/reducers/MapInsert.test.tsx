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
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 3]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'xt_', path: ['r', 0, 's', 0, 's', 1], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 3]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 4]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSU', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 3], selected: 1},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'xt_', path: ['r', 0, 's', 0, 's', 3], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 4]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSO', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'xt_', path: ['r', 0, 's', 0, 's', 1], selected: 1},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSO', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCRD', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCRD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCRU', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 1},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 2, 0], selected: 1},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 2, 1], selected: 1},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCRU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCCR', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCCR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertCCL', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 1},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 2], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 2], selected: 1},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertCCL', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCRD', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCRD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCRU', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 2, 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCRU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCCR', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCCR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('insertSCCL', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 2]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'insertSCCL', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
})
