import {M, T} from "../state/MapStateTypes"
import {getXSCC0, getXSCR0, getSIPL, getNodeByPath, getXSCYY, sortPath, isXR, getX, getCountTSO1, getXRD0, getXRD0SO, getXAEO, getNodeById, getTRD0SO, mL} from "./MapSelector"
import {GptData} from "../state/NodeApiStateTypes"

export const generateLlmInfo = (m: M) => ({
  inputContext: [
    ...mL(m)
      .filter(l => l.toNodeId === getX(m).nodeId)
      .map(l => getNodeById(m, l.fromNodeId))
      .map(t => ({
        dataType: t.llmDataType,
        dataId: t.llmDataId,
        dataLabel: t.content,
        data: t.llmDataType === 'text'
          ? getTRD0SO(m, t).filter(t => getCountTSO1(m, t) === 0).map(t => ([...getSIPL(t.path), t.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== '')))
          : [[]]
      })),
    {
      dataType: 'text',
      dataId: '',
      dataLabel: getX(m).content,
      data: getXRD0SO(m).filter(t => getCountTSO1(m, t) === 0).map(t => ([...getSIPL(t.path), t.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== '')))
    }
  ],
  outputContext: {
    dataType: 'text',
    dataId: '',
    dataLabel: getX(m).content,
    data: getXRD0SO(m).filter(t => getCountTSO1(m, t) === 0).map(t => ([...getSIPL(t.path), t.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== ''))),
    responseJsonSchema: getResponseSchema({keywords: {type: "array", readOnly: true}, suggestions: {type: "array"}, insertParentId: {type: "string", readOnly: true}}),
    responseJson: getXRD0SO(m).filter(t => getCountTSO1(m, t) === 0).map(t => ({keywords: [...getSIPL(t.path), t.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== ''), suggestions: [], insertParentId: t.nodeId}))
  }
})

export const genPromptJsonS = (m: M) => {
  return getXRD0SO(m).filter(t => getCountTSO1(m, t) === 0).map(t => ({
    keywords: [...getSIPL(t.path), t.path].map(p => getNodeByPath(m, p)?.content || '').filter(el => el !== ''),
    suggestions: [],
    insertParentId: t.nodeId
  }))
}

export const genPromptJsonT = (m: M) => {
  const mr = getXAEO(m).slice().sort(sortPath)
  const rowHeader = getXSCR0(mr).map(t => getNodeByPath(mr, [...t.path, 's', 0])?.content || '')
  const colHeader = getXSCC0(mr).map(t => getNodeByPath(mr, [...t.path, 's', 0])?.content || '')
  return getXSCYY(mr).map((t: T) => ({
    keywords: [colHeader[0], colHeader[t.path.at(-2) as number], rowHeader[t.path.at(-1) as number]],
    suggestions: [],
    insertParentId: t.nodeId
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
