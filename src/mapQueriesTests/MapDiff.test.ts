import { mapDiff } from "../mapQueries/MapDiff.ts"
import { MPartial } from "../mapState/MapStateTypes.ts"

describe("MapDiffTests", () => {
  test('mapDiff', () => {
      const version0 = [
        { nodeId: 's', a: 'vo' },
        { nodeId: 't', a: 'vo', b: 'vo', c: 'vo' },
        { nodeId: 'u', a: 'vo' }
      ]
      const version1 = [
        { nodeId: 's', a: 'vo' },
        { nodeId: 't', a: 'vo', b: 'vd', d: 'vd' },
        { nodeId: 'v', a: 'vd' }
      ]
      const result = {
        t: { b: 'vd', c: null, d: 'vd' },
        u: null,
        v: { a: 'vd' }
      }
      expect(mapDiff(version0 as unknown as MPartial, version1 as unknown as MPartial)).toEqual(result)
    }
  )
})
