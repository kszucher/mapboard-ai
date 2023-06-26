import {M} from "../state/MapPropTypes"
import {insertS} from "./MapInsert"
import {getCountSS, getNodeById} from "./MapUtils"

export const gptParser = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentPath = getNodeById(m, el.insertParentId).path
      insertS(m, [...insertParentPath, 's', getCountSS(m, insertParentPath)], {content: suggestion})
    })
  })
}
