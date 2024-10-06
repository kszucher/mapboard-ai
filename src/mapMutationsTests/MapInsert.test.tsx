import {mapMutations} from "../mapMutations/MapMutations.ts"
import {M, MPartial} from "../mapState/MapStateTypes.ts"
import {_assert} from "./_assert.ts"

describe("MapInsertTests", () => {
  beforeEach(() => {})
  test('insertR', () => {
    const test = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
    ] as MPartial
    const result = [
      {nodeId: 'g', path: ['g']},
      {nodeId: 'r0', path: ['r', 0]},
      {nodeId: '_r1', path: ['r', 1], selected: 1},
    ] as MPartial
    _assert(test, result, (m: M) => mapMutations.insertR(m))
  })
})
