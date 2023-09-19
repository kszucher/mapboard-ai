import {M, N} from "../state/MapStateTypes"
import {getXSCC0, getXSCR0, getSIPL, getNodeByPath, getXSCYY, sortPath, isXR, getX, getCountNSO1, getXRD0, getXRD0SO, getXAEO, getG, getNodeById, getNRD0SO} from "./MapSelector"
import {GptData} from "../state/NodeApiStateTypes"

export const generateLlmInfo = (m: M) => ({
  inputContext: [
    ...getG(m).connections.filter(connection => connection.toNodeId === getX(m).nodeId).map(connection => getNodeById(m, connection.fromNodeId)).map(n => ({
      dataType: n.llmDataType,
      dataId: n.llmDataId,
      dataLabel: n.content,
      data: n.llmDataType === 'text'
        ? getNRD0SO(m, n).filter(n => getCountNSO1(m, n) === 0).map(n => ([...getSIPL(n.path), n.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== '')))
        : [[]]
    })),
    {
      dataType: 'text',
      dataId: '',
      dataLabel: getX(m).content,
      data: getXRD0SO(m).filter(n => getCountNSO1(m, n) === 0).map(n => ([...getSIPL(n.path), n.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== '')))
    }
  ],
  outputContext: {
    dataType: 'text',
    dataId: '',
    dataLabel: getX(m).content,
    data: getXRD0SO(m).filter(n => getCountNSO1(m, n) === 0).map(n => ([...getSIPL(n.path), n.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== ''))),
    responseJsonSchema: getResponseSchema({keywords: {type: "array", readOnly: true}, suggestions: {type: "array"}, insertParentId: {type: "string", readOnly: true}}),
    responseJson: getXRD0SO(m).filter(n => getCountNSO1(m, n) === 0).map(n => ({keywords: [...getSIPL(n.path), n.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== ''), suggestions: [], insertParentId: n.nodeId}))
  }
})

export const genPromptJsonS = (m: M) => {
  return getXRD0SO(m).filter(n => getCountNSO1(m, n) === 0).map(n => ({
    keywords: [...getSIPL(n.path), n.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== ''),
    suggestions: [],
    insertParentId: n.nodeId
  }))
}

export const genPromptJsonT = (m: M) => {
  const mr = getXAEO(m).slice().sort(sortPath)
  const rowHeader = getXSCR0(mr).map(n => getNodeByPath(mr, [...n.path, 's', 0])?.content || '')
  const colHeader = getXSCC0(mr).map(n => getNodeByPath(mr, [...n.path, 's', 0])?.content || '')
  return getXSCYY(mr).map((n: N) => ({
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
    While keeping the following JSON schema, extract information from the ${getNodeByPath(m, ['r', 0]).content} by filling "suggestions" based on "keywords" and only return the JSON:
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
    While keeping the following JSON schema, extract information from the ${getNodeByPath(m, ['r', 0]).content} by filling "suggestions" based on "keywords" and only return the JSON:
    ${JSON.stringify(responseSchema)}
    ${JSON.stringify(promptJson)}`
  )
  return {promptId: 'gptGenNodesT', promptJson, prompt: prompt.trim(), maxToken: 4000, timestamp: Date.now()} as GptData
}

export const gptGenNodeMermaid = (m: M) => {
  const promptJson = [{
    description: getX(m).content,
    mermaidString: '',
    insertParentId: isXR(m) ? getXRD0(m).nodeId : getX(m).nodeId
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
