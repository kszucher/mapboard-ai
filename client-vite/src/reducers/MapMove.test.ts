import {sortNode} from "../selectors/MapSelector"
import {setIsTesting} from "../utils/Utils"
import {M, MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"

describe("Move_tests", () => {
  beforeEach(() => setIsTesting() as any)
  test('duplicateR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['l', 0], fromNodeId: 'f', toNodeId: 'i'},
      {nodeId: 'c', path: ['l', 1], fromNodeId: 'f', toNodeId: 'l'},
      {nodeId: 'd', path: ['l', 2], fromNodeId: 'f', toNodeId: 'o'},
      {nodeId: 'e', path: ['l', 3], fromNodeId: 'i', toNodeId: 'l'},
      {nodeId: 'f', path: ['r', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'i', path: ['r', 1], selected: 1, offsetW: 100, offsetH: 200},
      {nodeId: 'j', path: ['r', 1, 'd', 0]},
      {nodeId: 'k', path: ['r', 1, 'd', 0, 's', 0]},
      {nodeId: 'l', path: ['r', 2], selected: 2, offsetW: 110, offsetH: 220},
      {nodeId: 'm', path: ['r', 2, 'd', 0]},
      {nodeId: 'n', path: ['r', 2, 'd', 0, 's', 0]},
      {nodeId: 'o', path: ['r', 3]},
      {nodeId: 'p', path: ['r', 3, 'd', 0]},
      {nodeId: 'q', path: ['r', 3, 'd', 0, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['l', 0], fromNodeId: 'f', toNodeId: 'i'},
      {nodeId: 'c', path: ['l', 1], fromNodeId: 'f', toNodeId: 'l'},
      {nodeId: 'd', path: ['l', 2], fromNodeId: 'f', toNodeId: 'o'},
      {nodeId: 'e', path: ['l', 3], fromNodeId: 'i', toNodeId: 'l'},
      {nodeId: 'r', path: ['l', 4], fromNodeId: 'u', toNodeId: 'x'},
      {nodeId: 'f', path: ['r', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'i', path: ['r', 1], offsetW: 100, offsetH: 200},
      {nodeId: 'j', path: ['r', 1, 'd', 0]},
      {nodeId: 'k', path: ['r', 1, 'd', 0, 's', 0]},
      {nodeId: 'l', path: ['r', 2], offsetW: 110, offsetH: 220},
      {nodeId: 'm', path: ['r', 2, 'd', 0]},
      {nodeId: 'n', path: ['r', 2, 'd', 0, 's', 0]},
      {nodeId: 'o', path: ['r', 3]},
      {nodeId: 'p', path: ['r', 3, 'd', 0]},
      {nodeId: 'q', path: ['r', 3, 'd', 0, 's', 0]},
      {nodeId: 'u', path: ['r', 4], selected: 1},
      {nodeId: 'v', path: ['r', 4, 'd', 0]},
      {nodeId: 'w', path: ['r', 4, 'd', 0, 's', 0]},
      {nodeId: 'x', path: ['r', 5], selected: 2, offsetW: 10, offsetH: 20},
      {nodeId: 'y', path: ['r', 5, 'd', 0]},
      {nodeId: 'z', path: ['r', 5, 'd', 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'duplicateR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('duplicateS', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 3], selected: 1},
      {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 4], selected: 2},
      {nodeId: 'x', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 5]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 5, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'duplicateS', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSD', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2], selected: 1},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 3], selected: 2},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveST', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3], selected: 1},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4], selected: 2},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 1], selected: 2},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 2]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 3]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 4]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveST', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSU', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2], selected: 1},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3], selected: 2},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 3]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSB', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 1], selected: 2},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 3]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 4]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 2]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 3], selected: 1},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 4], selected: 2},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSB', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSO', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 1, 's', 1]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 2, 's', 1]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2], selected: 1},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 2},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSO', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSI', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2], selected: 1},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3], selected: 2},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 3, 's', 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 2], selected: 2},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 2, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 3]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 3, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSI', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSIR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'f', path: ['r', 0, 'd', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 1, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 1, 's', 1], selected: 1},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSIR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveSIL', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 1]},
      {nodeId: 'f', path: ['r', 0, 'd', 1, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 1, 's', 1], selected: 1},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 1], selected: 1},
      {nodeId: 'e', path: ['r', 0, 'd', 1]},
      {nodeId: 'f', path: ['r', 0, 'd', 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveSIL', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveCRD', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveCRD', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveCRU', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveCRU', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveCCR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveCCR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveCCL', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveCCL', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveS2TOR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0], selected: 1},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 1]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveS2TOR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('moveS2TO', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1, selection: 'f'},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
      {nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'w', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'moveS2TO', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('transpose', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'c', path: ['r', 0, 'd', 0]},
      {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
      {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'transpose', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
})
