import {setIsTesting} from "../core/Utils"
import {mapReducerAtomic} from "../map/MapReducer"
import {M} from "../state/MapPropTypes"

const insertSDTest = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
] as M

const insertSDResult = [
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 1]},
  {selected: 1, selection: 's', taskStatus: 0, nodeId: 'x', path: ['r', 0, 'd', 0, 's', 0, 's', 2]},
  {selected: 0, selection: 's', taskStatus: 0, nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 3]},
] as M

describe("InsertTests", () => {
  beforeEach(() => setIsTesting())
  test('insertSD', () => {mapReducerAtomic(insertSDTest, 'insertSD', {}); expect(insertSDTest).toEqual(insertSDResult)})
})
