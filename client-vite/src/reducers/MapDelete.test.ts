import {sortNode} from "../selectors/MapSelectorUtils"
import {M, MPartial} from "../state/MapStateTypes"
import {mapDeInit} from "./MapDeInit"
import {deleteS, deleteCR, deleteCC} from "./MapDelete"
import {mapInit} from "./MapInit"
import {mapReducerAtomic} from "./MapReducer"

const deleteR_test = [
  {nodeId: 'a', path: ['g'], connections: [{fromNodeId: 'b', toNodeId: 'e'}, {fromNodeId: 'b', toNodeId: 'h'}]},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 1], selected: 1},
  {nodeId: 'f', path: ['r', 1, 'd', 0]},
  {nodeId: 'g', path: ['r', 1, 'd', 0, 's', 0]},
  {nodeId: 'h', path: ['r', 2]},
  {nodeId: 'i', path: ['r', 2, 'd', 0]},
  {nodeId: 'j', path: ['r', 2, 'd', 0, 's', 0]},
] as MPartial

const deleteR_result = [
  {nodeId: 'a', path: ['g'], connections: [{fromNodeId: 'b', toNodeId: 'h'}]},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'h', path: ['r', 1]},
  {nodeId: 'i', path: ['r', 1, 'd', 0]},
  {nodeId: 'j', path: ['r', 1, 'd', 0, 's', 0]},
] as MPartial

const deleteS_test = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0], selected: 1},
  {nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 1]},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 2]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 1], selected: 2},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 1]},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 2]},
  {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0], selected: 3},
  {nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1], selected: 4},
  {nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 2]},
] as MPartial

const deleteS_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0], lastSelectedChild: 0},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], selected: 1},
  {nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
] as MPartial

const deleteCR_test = [
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

const deleteCR_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
  {nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1], selected: 2},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
] as MPartial

const deleteCC_test = [
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

const deleteCC_result = [
  {nodeId: 'a', path: ['g']},
  {nodeId: 'b', path: ['r', 0]},
  {nodeId: 'c', path: ['r', 0, 'd', 0]},
  {nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0], selected: 1},
  {nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0], selected: 2},
  {nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
] as MPartial

const testFlow = (test: MPartial, result: MPartial, type: string, payload: object) => {
  mapInit(test)
  mapReducerAtomic(test as M, type, payload)
  return expect(mapDeInit(test as M).sort(sortNode)).toEqual((result as M).sort(sortNode))
}

describe("Delete_tests", () => {
  test('deleteR', () => testFlow(deleteR_test, deleteR_result, 'deleteR', {}))
  test('deleteS', () => testFlow(deleteS_test, deleteS_result, 'deleteS', {}))
  test('deleteCR', () => testFlow(deleteCR_test, deleteCR_result, 'deleteCR', {}))
  test('deleteCC', () => testFlow(deleteCC_test, deleteCC_result, 'deleteCC', {}))
})
