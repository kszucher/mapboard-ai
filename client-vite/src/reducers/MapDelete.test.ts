import {sortNode} from "../selectors/MapSelector"
import {M, MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"

describe("Delete_tests", () => {
  test('deleteLR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['l', 0], fromNodeId: 'e', toNodeId: 'i'},
      {nodeId: 'c', path: ['l', 1], fromNodeId: 'e', toNodeId: 'm'},
      {nodeId: 'd', path: ['l', 2], fromNodeId: 'i', toNodeId: 'm'},
      {nodeId: 'e', path: ['r', 0], offsetW: 120, offsetH: 230},
      {nodeId: 'g', path: ['r', 0, 's', 0]},
      {nodeId: 'i', path: ['r', 1], offsetW: 340, offsetH: 450, selected: 1},
      {nodeId: 'k', path: ['r', 1, 's', 0]},
      {nodeId: 'm', path: ['r', 2], offsetW: 560, offsetH: 780},
      {nodeId: 'o', path: ['r', 2, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'c', path: ['l', 0], fromNodeId: 'e', toNodeId: 'm'},
      {nodeId: 'e', path: ['r', 0], selected: 1},
      {nodeId: 'g', path: ['r', 0, 's', 0]},
      {nodeId: 'm', path: ['r', 1], offsetW: 440, offsetH: 550},
      {nodeId: 'o', path: ['r', 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'deleteLR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('deleteS', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 's', 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 's', 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 's', 0, 's', 1]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 's', 0, 's', 2]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 's', 1], selected: 2},
      {nodeId: 'j', path: ['r', 0, 's', 0, 's', 1, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 's', 1, 's', 1]},
      {nodeId: 'l', path: ['r', 0, 's', 0, 's', 1, 's', 2]},
      {nodeId: 'm', path: ['r', 0, 's', 0, 's', 2]},
      {nodeId: 'n', path: ['r', 0, 's', 0, 's', 2, 's', 0], selected: 3},
      {nodeId: 'o', path: ['r', 0, 's', 0, 's', 2, 's', 1], selected: 4},
      {nodeId: 'p', path: ['r', 0, 's', 0, 's', 2, 's', 2]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0], lastSelectedChild: 0},
      {nodeId: 'd', path: ['r', 0, 's', 0], selected: 1},
      {nodeId: 'm', path: ['r', 0, 's', 0, 's', 0]},
      {nodeId: 'p', path: ['r', 0, 's', 0, 's', 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'deleteS', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('deleteCR', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
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
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 0, 1], selected: 2},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'deleteCR', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
  test('deleteCC', () => {
    const test = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'e', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'f', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 1]},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 1, 's', 0]},
      {nodeId: 'i', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'j', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 1]},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 1, 's', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'a', path: ['g']},
      {nodeId: 'b', path: ['r', 0]},
      {nodeId: 'd', path: ['r', 0, 's', 0]},
      {nodeId: 'g', path: ['r', 0, 's', 0, 'c', 0, 0], selected: 1},
      {nodeId: 'h', path: ['r', 0, 's', 0, 'c', 0, 0, 's', 0]},
      {nodeId: 'k', path: ['r', 0, 's', 0, 'c', 1, 0], selected: 2},
      {nodeId: 'l', path: ['r', 0, 's', 0, 'c', 1, 0, 's', 0]},
    ] as MPartial
    expect(mapDeInit(mapReducerAtomic(mapInit(test) as M, 'deleteCC', {}) as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
  })
})
