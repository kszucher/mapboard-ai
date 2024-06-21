import {mapDiff} from "./MapDiff.ts"
import {MPartial} from "../state/MapStateTypes.ts"

describe("MapDiffTests", () => {
  test('mapDiff', () => {
      const version0 = [
        {nodeId: 's', a: 'vo'},
        {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'vo', e: 'vo', f: 'vo', g: 'vo', h: 'vo', i: 'vo'},
        {nodeId: 'u', a: 'vo'}
      ] as any as MPartial
      const version1 = [
        {nodeId: 's', a: 'vo'},
        {nodeId: 't', a: 'vo', b: 'vo', c: 'vo', d: 'va', e: 'va', f: 'va', j: 'va', l: 'vab'},
        {nodeId: 'v', a: 'va'}
      ] as any as MPartial
      const result = {
        t: {d: "va", e: "va", f: "va", g: null, h: null, i: null, j: "va", l: "vab"}, u: null, v: {"a": "va"}
      }
      expect(mapDiff(version0, version1)).toEqual(result)
    }
  )
})
