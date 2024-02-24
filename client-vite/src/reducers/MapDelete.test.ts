import {sortNode} from "../queries/MapQueries.ts"
import {M, MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"
import {MR} from "./MapReducerEnum.ts"

describe("MapDeleteTests", () => {
  test('deleteLR', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'la', path: ['l', 0], fromNodeId: 'ta', toNodeId: 'tc'},
      {nodeId: 'lb', path: ['l', 1], fromNodeId: 'ta', toNodeId: 'te'},
      {nodeId: 'lc', path: ['l', 2], fromNodeId: 'tc', toNodeId: 'te'},
      {nodeId: 'ta', path: ['r', 0], offsetW: 120, offsetH: 230},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 1], offsetW: 340, offsetH: 450, selected: 1},
      {nodeId: 'td', path: ['r', 1, 's', 0]},
      {nodeId: 'te', path: ['r', 2], offsetW: 560, offsetH: 780},
      {nodeId: 'tf', path: ['r', 2, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'lb', path: ['l', 0], fromNodeId: 'ta', toNodeId: 'te'},
      {nodeId: 'ta', path: ['r', 0], selected: 1},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'te', path: ['r', 1], offsetW: 440, offsetH: 550},
      {nodeId: 'tf', path: ['r', 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, MR.deleteLR) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('deleteS', () => {
    const test = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0]},
      {nodeId: 'tb', path: ['r', 0, 's', 0]},
      {nodeId: 'tc', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'td', path: ['r', 0, 's', 0, 's', 0, 's', 0]},
      {nodeId: 'te', path: ['r', 0, 's', 0, 's', 0, 's', 1]},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 's', 0, 's', 2]},
      {nodeId: 'tg', path: ['r', 0, 's', 0, 's', 1], selected: 2},
      {nodeId: 'th', path: ['r', 0, 's', 0, 's', 1, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 's', 1, 's', 1]},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 's', 1, 's', 2]},
      {nodeId: 'tk', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'tl', path: ['r', 0, 's', 0, 's', 2, 's', 0], selected: 3},
      {nodeId: 'tm', path: ['r', 0, 's', 0, 's', 2, 's', 1], selected: 4},
      {nodeId: 'tn', path: ['r', 0, 's', 0, 's', 2, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'ga', path: ['g']},
      {nodeId: 'ta', path: ['r', 0], lastSelectedChild: 0},
      {nodeId: 'tb', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'tk', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'tn', path: ['r', 0, 's', 0, 's', 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, MR.deleteSJumpSI) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('deleteCR', () => {
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
      {nodeId: 'tg', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'th', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, MR.deleteCR) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('deleteCC', () => {
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
      {nodeId: 'te', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'tf', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'ti', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'tj', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, MR.deleteCC) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
})
