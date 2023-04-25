import {M} from "../state/MapPropTypes"
import {deleteSelectS, deleteSelectCR, deleteSelectCC} from "./MapDelete"
import {sortNode} from "./MapUtils";

const deleteSelectSTest = [
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

const deleteSelectSResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
] as M

const deleteSelectCRTest = [
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

const deleteSelectCRResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 2, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
] as M

const deleteSelectCCTest = [
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

const deleteSelectCCResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 2, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
] as M

describe("DeleteTests", () => {
  test('deleteSelectS', () => {
    deleteSelectS(deleteSelectSTest)
    expect(deleteSelectSTest.sort(sortNode)).toEqual(deleteSelectSResult)
  })
  test('deleteSelectCR', () => {
    deleteSelectCR(deleteSelectCRTest)
    expect(deleteSelectCRTest.sort(sortNode)).toEqual(deleteSelectCRResult)
  })
  test('deleteSelectCC', () => {
    deleteSelectCC(deleteSelectCCTest)
    expect(deleteSelectCCTest.sort(sortNode)).toEqual(deleteSelectCCResult)
  })
})
