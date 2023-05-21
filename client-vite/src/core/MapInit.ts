import {GSaveOptional, GSaveNever, GPartial, NSaveAlways, NSaveOptional, NSaveNever, M, MPartial} from "../state/MapPropTypes"
import {gSaveAlways, gSaveNever, gSaveOptional, nSaveAlways, nSaveNever, nSaveOptional} from "../state/MapProps"
import {getNodeByPath, isG} from "./MapUtils"
import {genHash} from "./Utils"

export const mapInit = (m: MPartial) => {
  const g = getNodeByPath(m as M, ['g']) as GPartial
  m.forEach(n => {
    if (isG(n.path)) {
      for (const prop in gSaveAlways) {
        // do nothing
      }
      for (const prop in gSaveOptional) {
        if (!g.hasOwnProperty(prop)) {
          Object.assign(g, {[prop]: structuredClone(gSaveOptional[prop as keyof GSaveOptional])})
        }
      }
      for (const prop in gSaveNever) {
        Object.assign(g, {[prop]: structuredClone(gSaveNever[prop as keyof GSaveNever])})
      }
      // 30 = 14 + 2*8, 20 = 14 + 2*3
      g.sLineDeltaXDefault = g.density === 'large' ? 30 : 20
      g.padding = g.density === 'large' ? 8 : 3
      g.defaultH = g.density === 'large' ? 30 : 20
      g.taskConfigD = g.density === 'large' ? 24 : 20
      g.taskConfigWidth =
        (g.taskConfigN || gSaveNever.taskConfigWidth) * g.taskConfigD +
        ((g.taskConfigN || gSaveNever.taskConfigWidth) - 1) * (g.taskConfigGap || gSaveOptional.taskConfigGap)
    } else {
      for (const prop in nSaveAlways) {
        if (!n.hasOwnProperty(prop)) {
          if (prop === 'nodeId') {
            n[prop] = 'node' + genHash(8)
          } else {
            Object.assign(n, {[prop]: structuredClone(nSaveAlways[prop as keyof NSaveAlways])})
          }
        }
      }
      for (const prop in nSaveOptional) {
        if (!n.hasOwnProperty(prop)) {
          Object.assign(n, {[prop]: structuredClone(nSaveOptional[prop as keyof NSaveOptional])})
        }
      }
      for (const prop in nSaveNever) {
        Object.assign(n, {[prop]: structuredClone(nSaveNever[prop as keyof NSaveNever])})
      }
    }
  })
}
