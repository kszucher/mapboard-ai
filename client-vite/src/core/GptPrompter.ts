import {M, N} from "../state/MapStateTypes"
import {getXSSCC0, getXSSCR0, m2cbS, getSIL, getNodeByPath, getXSSCYY, sortPath, isXR, getX, getNRiD0, getNRi, getCountNSO1, getXRiD0} from "./MapUtils"
import {GptData} from "../state/ApiStateTypes"

export const genPromptJsonS = (m: M) => {
  const cb = m2cbS(m)
  return m2cbS(m).filter(n => getCountNSO1(cb, n) === 0).map(n => ({
    keywords: [...getSIL(n.path), n.path].map(p => getNodeByPath(cb, p).content),
    suggestions: [],
    insertParentId: n.nodeId
  }))
}

export const genPromptJsonT = (m: M) => {
  const cb = m2cbS(m).sort(sortPath)
  const rowHeader = getXSSCR0(cb).map(n => getNodeByPath(cb, [...n.path, 's', 0])?.content || '')
  const colHeader = getXSSCC0(cb).map(n => getNodeByPath(cb, [...n.path, 's', 0])?.content || '')
  return getXSSCYY(cb).map((n: N) => ({
    keywords: [colHeader[0], colHeader[n.path.at(-2) as number], rowHeader[n.path.at(-1) as number]],
    suggestions: [],
    insertParentId: n.nodeId
  }))
}

const getResponseSchema = (properties: object) => ({
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "array",
  "items": {
    "type": "object",
    "properties": properties,
    "required": Object.keys(properties)
  }
})

export const gptGenNodesS = (m: M) => {
  const promptJson = genPromptJsonS(m)
  const responseSchema = getResponseSchema({
    keywords: {type: "array", readOnly: true},
    suggestions: {type: "array"},
    insertParentId: {type: "string", readOnly: true}
  })
  const prompt = (`
    Disregard any previous context.
    Take the following ${getNodeByPath(m, ['r', 0]).content}: ${getNodeByPath(m, ['r', 0]).note}
    While keeping the following JSON schema, extract information from the ${getNodeByPath(m, ['r', 0]).content} by filling "suggestions" based on "keywords":
    ${JSON.stringify(responseSchema)}
    ${JSON.stringify(promptJson)}`
  )
  return {promptId: 'gptGenNodesS', promptJson, prompt: prompt.trim(), maxToken: 4000, timestamp: Date.now()} as GptData
}

export const gptGenNodesT = (m: M) => {
  const promptJson = genPromptJsonT(m)
  const responseSchema = getResponseSchema({
    keywords: {type: "array", readOnly: true},
    suggestions: {type: "array"},
    insertParentId: {type: "string", readOnly: true}
  })
  const prompt = (`
    Disregard any previous context.
    Take the following ${getNodeByPath(m, ['r', 0]).content}: ${getNodeByPath(m, ['r', 0]).note}
    While keeping the following JSON schema, extract information from the ${getNodeByPath(m, ['r', 0]).content} by filling "suggestions" based on "keywords":
    ${JSON.stringify(responseSchema)}
    ${JSON.stringify(promptJson)}`
  )
  return {promptId: 'gptGenNodesT', promptJson, prompt: prompt.trim(), maxToken: 4000, timestamp: Date.now()} as GptData
}

export const gptGenNodeMermaid = (m: M) => {
  const promptJson = [{
    description: getX(m).content,
    mermaidString: '',
    insertParentId: isXR(m) ? getXRiD0(m).nodeId : getX(m).nodeId
  }]
  const responseSchema = getResponseSchema({
    description: {type: "string", readOnly: true},
    mermaidString: {type: "string"},
    insertParentId: {type: "string", readOnly: true}
  })
  const prompt = (`
    Disregard any previous context.
    The response should match the following JSON schema.
    ${JSON.stringify(responseSchema)}
    Fill out the field "mermaidString" by generating a diagram in mermaid format based on "description". 
    ${JSON.stringify(promptJson)}`
  )
  return {promptId: 'gptGenNodeMermaid', promptJson, prompt: prompt.trim(), maxToken: 4000, timestamp: Date.now()} as GptData
}
