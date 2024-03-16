import {sortNode} from "../queries/MapQueries.ts"
import {setIsTesting} from "../utils/Utils"
import {MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"
import {MR} from "./MapReducerEnum.ts"
import {mapChain} from "./MapChain.ts"

describe("MapMoveTests", () => {
  beforeEach(() => setIsTesting() as any)
  test('duplicateR', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'la', path: ['l', 0], fromNodeId: 'ra', toNodeId: 'rb'},
      {nodeId: 'lb', path: ['l', 1], fromNodeId: 'ra', toNodeId: 'rc'},
      {nodeId: 'lc', path: ['l', 2], fromNodeId: 'ra', toNodeId: 'rd'},
      {nodeId: 'ld', path: ['l', 3], fromNodeId: 'rb', toNodeId: 'rc'},
      {nodeId: 'ra', path: ['r', 0]},
      {nodeId: 'sa', path: ['r', 0, 's', 0]},
      {nodeId: 'rb', path: ['r', 1], selected: 1, offsetW: 100, offsetH: 200},
      {nodeId: 'sb', path: ['r', 1, 's', 0]},
      {nodeId: 'rc', path: ['r', 2], selected: 2, offsetW: 110, offsetH: 220},
      {nodeId: 'sc', path: ['r', 2, 's', 0]},
      {nodeId: 'rd', path: ['r', 3]},
      {nodeId: 'sd', path: ['r', 3, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'la', path: ['l', 0], fromNodeId: 'ra', toNodeId: 'rb'},
      {nodeId: 'lb', path: ['l', 1], fromNodeId: 'ra', toNodeId: 'rc'},
      {nodeId: 'lc', path: ['l', 2], fromNodeId: 'ra', toNodeId: 'rd'},
      {nodeId: 'ld', path: ['l', 3], fromNodeId: 'rb', toNodeId: 'rc'},
      {nodeId: 'xla', path: ['l', 4], fromNodeId: 'xra', toNodeId: 'xrb'},
      {nodeId: 'ra', path: ['r', 0]},
      {nodeId: 'sa', path: ['r', 0, 's', 0]},
      {nodeId: 'rb', path: ['r', 1], offsetW: 100, offsetH: 200},
      {nodeId: 'sb', path: ['r', 1, 's', 0]},
      {nodeId: 'rc', path: ['r', 2], offsetW: 110, offsetH: 220},
      {nodeId: 'sc', path: ['r', 2, 's', 0]},
      {nodeId: 'rd', path: ['r', 3]},
      {nodeId: 'sd', path: ['r', 3, 's', 0]},
      {nodeId: 'xra', path: ['r', 4], selected: 1},
      {nodeId: 'xsa', path: ['r', 4, 's', 0]},
      {nodeId: 'xrb', path: ['r', 5], selected: 2, offsetW: 10, offsetH: 20},
      {nodeId: 'xsb', path: ['r', 5, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.duplicateR)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('duplicateS', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'te', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 3]},
      {nodeId: 'ti', path: ['r', 0, 's', 3, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 2]},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'xta', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: 'xtb', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'xtc', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: 'xtd', path: ['r', 0, 's', 4, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 5]},
      {nodeId: 'ti', path: ['r', 0, 's', 5, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.duplicateS)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveSD', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'te', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 3]},
      {nodeId: 'ti', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 4]},
      {nodeId: 'tk', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 1]},
      {nodeId: 'ti', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 2], selected: 1},
      {nodeId: 'te', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 3], selected: 2},
      {nodeId: 'tg', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 4]},
      {nodeId: 'tk', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveSD)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveST', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 2]},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: 'ti', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: 'tk', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 1], selected: 2},
      {nodeId: 'tk', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 2]},
      {nodeId: 'tc', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 3]},
      {nodeId: 'te', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 4]},
      {nodeId: 'tg', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveST)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveSU', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 2], selected: 1},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 3], selected: 2},
      {nodeId: 'ti', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 4]},
      {nodeId: 'tk', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'tg', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'ti', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 3]},
      {nodeId: 'te', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 4]},
      {nodeId: 'tk', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveSU)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveSB', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 1], selected: 2},
      {nodeId: 'te', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 2]},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 3]},
      {nodeId: 'ti', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 4]},
      {nodeId: 'tk', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 1]},
      {nodeId: 'ti', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 2]},
      {nodeId: 'tk', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 3], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 3, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 4], selected: 2},
      {nodeId: 'te', path: ['r', 0, 's', 4, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveSB)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveSO', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 1, 's', 1]},
      {nodeId: 'th', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'ti', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 2, 's', 1]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 2], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 2, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 's', 2, 's', 1]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 's', 3], selected: 2},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 's', 3, 's', 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 's', 3, 's', 1]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveSO)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveSI', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 2], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 3], selected: 2},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 's', 3, 's', 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 's', 4]},
      {nodeId: 'ti', path: ['r', 0, 's', 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'te', path: ['r', 0, 's', 1], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 2], selected: 2},
      {nodeId: 'tg', path: ['r', 0, 's', 2, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 3]},
      {nodeId: 'tj', path: ['r', 0, 's', 3, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveSI)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveCRD', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
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
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveCRD)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveCRU', () => {
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
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveCRU)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveCCR', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveCCR)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveCCL', () => {
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
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 1], selected: 2},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveCCL)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('moveS2T', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 1]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'xt_', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'xta', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'xtb', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'xtc', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 0, 'c', 2, 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.moveS2T)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
  test('transpose', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 0, 2]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 0, 2, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'tk', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tl', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'tm', path: ['r', 0, 's', 0, 'c', 1, 2]},
      {nodeId: 'tn', path: ['r', 0, 's', 0, 'c', 1, 2, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 'c', 0, 0]},
      {nodeId: 'td', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 1, 0]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'tk', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'tl', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 2, 0]},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 2, 0, 's', 0]},
      {nodeId: 'tm', path: ['r', 0, 's', 0, 'c', 2, 1]},
      {nodeId: 'tn', path: ['r', 0, 's', 0, 'c', 2, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapChain(mapInit(test)), MR.transpose)).sort(sortNode)).toEqual((result).sort(sortNode))
  })
})
