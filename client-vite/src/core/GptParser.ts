import {M} from "../state/MapStateTypes"
import {insertS} from "./MapInsert"
import {getCountNSO1, getNodeById} from "./MapUtils"

export const gptParseNodesS = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentNode = getNodeById(m, el.insertParentId)
      insertS(m, [...insertParentNode.path, 's', getCountNSO1(m, insertParentNode)], {content: suggestion})
    })
  })
}

export const gptParseNodesT = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentNode = getNodeById(m, el.insertParentId)
      insertS(m, [...insertParentNode.path, 's', getCountNSO1(m, insertParentNode)], {content: suggestion})
    })
  })
}

export const gptParseNodeMermaid = (m: M, gptParsed: any) => {
  const insertParentNode = getNodeById(m, gptParsed[0].insertParentId)
  insertS(m, [...insertParentNode.path, 's', getCountNSO1(m, insertParentNode)], {content: gptParsed[0].mermaidString, contentType: 'mermaid'})
}
