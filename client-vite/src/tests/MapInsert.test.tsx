import {setIsTesting} from "../core/Utils"
import {mapReducerAtomic} from "../map/MapReducer"
import {M} from "../state/MapPropTypes"

const insertSDTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSDResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSUTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

const insertSUResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 4]},
] as M

const insertSORTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
] as M

const insertSORResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 1]},
] as M

const insertSOTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
] as M

const insertSOResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'z', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
] as M

const insertCRDTest = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
] as M

const insertCRDResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc0', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'zcs0', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0]},
  {selected: 1, selection: 's', nodeId: 'zc1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'zcs1', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
] as M

describe("InsertTests", () => {
  beforeEach(() => setIsTesting())
  test('insertSD', () => {mapReducerAtomic(insertSDTest, 'insertSD', {}); expect(insertSDTest).toEqual(insertSDResult)})
  test('insertSU', () => {mapReducerAtomic(insertSUTest, 'insertSU', {}); expect(insertSUTest).toEqual(insertSUResult)})
  test('insertSOR', () => {mapReducerAtomic(insertSORTest, 'insertSOR', {}); expect(insertSORTest).toEqual(insertSORResult)})
  test('insertSO', () => {mapReducerAtomic(insertSOTest, 'insertSO', {}); expect(insertSOTest).toEqual(insertSOResult)})
  test('insertCRD', () => {mapReducerAtomic(insertCRDTest, 'insertCRD', {}); expect(insertCRDTest).toEqual(insertCRDResult)})
  // test('insertCRD', () => {mapReducerAtomic(insertCRDTest, 'insertCRD', {}); expect(insertCRDTest).toEqual(insertCRDResult)})
  // test('insertCRD', () => {mapReducerAtomic(insertCRDTest, 'insertCRD', {}); expect(insertCRDTest).toEqual(insertCRDResult)})
  // test('insertCRD', () => {mapReducerAtomic(insertCRDTest, 'insertCRD', {}); expect(insertCRDTest).toEqual(insertCRDResult)})
})

// TODO finish tests and finally make a test for insertTable which is not working
