import {M} from "../state/MapStateTypes"
import {insertS} from "./MapInsert"
import {getCountSO1, getNodeById} from "./MapUtils"

export const gptParser = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentPath = getNodeById(m, el.insertParentId).path
      insertS(m, [...insertParentPath, 's', getCountSO1(m, insertParentPath)], {content: suggestion})
    })
  })
}
