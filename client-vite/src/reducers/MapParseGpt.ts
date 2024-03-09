import {M} from "../state/MapStateTypes"
import {insertS} from "./MapInsert"
import {idToS} from "../queries/MapQueries.ts"

const cleanSuggestion = (suggestion: string) => suggestion.startsWith('$') ? 'USD' + suggestion.slice(1) : suggestion

export const gptParseNodesS = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentNode = idToS(m, el.insertParentId)
      insertS(m, [...insertParentNode.path, 's', insertParentNode.so1.length], {content: cleanSuggestion(suggestion), isGenerated: true})
    })
  })
}

export const gptParseNodesT = (m: M, gptParsed: any) => {
  gptParsed.forEach((el: any) => {
    el.suggestions.forEach((suggestion: string) => {
      const insertParentNode = idToS(m, el.insertParentId)
      insertS(m, [...insertParentNode.path, 's', insertParentNode.so1.length], {content: cleanSuggestion(suggestion), isGenerated: true})
    })
  })
}

export const gptParseNodeMermaid = (m: M, gptParsed: any) => {
  const insertParentNode = idToS(m, gptParsed[0].insertParentId)
  insertS(m, [...insertParentNode.path, 's', insertParentNode.so1.length], {content: gptParsed[0].mermaidString, contentType: 'mermaid'})
}
