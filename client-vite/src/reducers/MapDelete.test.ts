import {sortNode} from "../selectors/MapSelectorUtils"
import {mapReducerAtomic} from "./MapReducer"
import {M} from "../state/MapStateTypes"
import {deleteS, deleteCR, deleteCC} from "./MapDelete"

const deleteR_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g'], connections: [{fromNodeId: 'b', toNodeId: 'e'}, {fromNodeId: 'b', toNodeId: 'h'}]},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 1]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 1, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 1, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 2]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 2, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 2, 'd', 0, 's', 0]},
] as M

const deleteR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g'], connections: [{fromNodeId: 'b', toNodeId: 'h'}]},
  {selected: 1, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 1]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 1, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 1, 'd', 0, 's', 0]},
] as M

const deleteS_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 2]},
  {selected: 2, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 's', 1, 's', 2]},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 3, selection: 's', nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 0]},
  {selected: 4, selection: 's', nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 1]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 2, 's', 2]},
] as M

const deleteS_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0], lastSelectedChild: 0},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
] as M

const deleteCR_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 2, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const deleteCR_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 2, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
] as M

const deleteCC_test = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 2, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const deleteCC_result = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 2, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
] as M

describe("Delete_tests", () => {
  test('deleteR', () => {mapReducerAtomic(deleteR_test, 'deleteR', {}); expect(deleteR_test.sort(sortNode)).toEqual(deleteR_result.sort(sortNode))})
  test('deleteS', () => {mapReducerAtomic(deleteS_test, 'deleteS', {}); expect(deleteS_test.sort(sortNode)).toEqual(deleteS_result.sort(sortNode))})
  test('deleteCR', () => {mapReducerAtomic(deleteCR_test, 'deleteCR', {}); expect(deleteCR_test.sort(sortNode)).toEqual(deleteCR_result.sort(sortNode))})
  test('deleteCC', () => {mapReducerAtomic(deleteCC_test, 'deleteCC', {}); expect(deleteCC_test.sort(sortNode)).toEqual(deleteCC_result.sort(sortNode))})
})
