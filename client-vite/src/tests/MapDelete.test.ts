import {deleteSelectS} from "../map/MapDelete";
import {M} from "../state/MapPropTypes"

const deleteSelectTest = [
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

const deleteSelectResult = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0]},
] as M

describe("DeleteTests", () => {
  test('deleteSelectS', () => {
    deleteSelectS(deleteSelectTest)
    expect(deleteSelectTest).toEqual(deleteSelectResult)
  })
})
