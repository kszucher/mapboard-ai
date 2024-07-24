import {mapDiff} from "../mapQueries/MapDiff.ts"
import {MPartial} from "../state/MapStateTypes.ts"

describe("MapDiffTests", () => {
  test('mapDiff', () => {
      const version0 = [
        {nodeId: 's', a: 'vo'},
        {nodeId: 't', a: 'vo', b: 'vo', c: 'vo'},
        {nodeId: 'u', a: 'vo'}
      ] as any as MPartial
      const version1 = [
        {nodeId: 's', a: 'vo'},
        {nodeId: 't', a: 'vo', b: 'vd', d: 'vd'},
        {nodeId: 'v', a: 'vd'}
      ] as any as MPartial
      const result = {
        t: {b: 'vd', c: null, d: 'vd'},
        u: null,
        v: {a: 'vd'}
      }
      expect(mapDiff(version0, version1)).toEqual(result)
    }
  )
})
