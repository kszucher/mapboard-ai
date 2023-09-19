import {M} from "../state/MapStateTypes"
import {insertS} from "./MapInsert"
import {getCountNSO1, getNodeById} from "../selectors/MapSelector"

const cleanSuggestion = (suggestion: string) => suggestion.startsWith('$') ? 'USD' + suggestion.slice(1) : suggestion

export const gptParseNodesS = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentNode = getNodeById(m, el.insertParentId)
      insertS(m, insertParentNode, getCountNSO1(m, insertParentNode), {content: cleanSuggestion(suggestion), isGenerated: true})
    })
  })
}

export const gptParseNodesT = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentNode = getNodeById(m, el.insertParentId)
      insertS(m, insertParentNode, getCountNSO1(m, insertParentNode), {content: cleanSuggestion(suggestion), isGenerated: true})
    })
  })
}

export const gptParseNodeMermaid = (m: M, gptParsed: any) => {
  const insertParentNode = getNodeById(m, gptParsed[0].insertParentId)
  insertS(m, insertParentNode, getCountNSO1(m, insertParentNode), {content: gptParsed[0].mermaidString, contentType: 'mermaid'})
}
