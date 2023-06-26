import {M, N} from "../state/MapPropTypes"
import {getXSSCC0, getXSSCR0, m2cbS, getCountSS, getSIL, getNodeByPath, getXSSCYY, sortPath} from "./MapUtils"
import {GptData} from "../state/ApiStateTypes"

export const genPromptJsonS = (m: M) => {
  const cb = m2cbS(m)
  return m2cbS(m).filter(n => getCountSS(cb, n.path) === 0).map(n => ({
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

const responseSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "keywords": {"type": "array", "readOnly": true},
      "suggestions": {"type": "array"},
      "insertParentId": {"type": "string", "readOnly": true},
    },
    "required": [
      "keywords",
      "suggestions",
      "insertParentId"
    ]
  }
}

export const gptPrompter = (m: M, promptJson: any) => {
  const prompt = `
    Take the following meeting transcript: ${getNodeByPath(m, ['r', 0, 'd', 0, 's', 0]).note}
    Please extract information from the meeting transcript by filling "suggestions" based on "keywords" in the following JSON.
    Do not change "readOnly" fields.
    ${JSON.stringify(promptJson)}
    Make sure to format the result according the following JSON schema.
    ${JSON.stringify(responseSchema)}
    Only return the JSON, no additional comments, no extra characters.
  `
  return {
    promptId: 'gptGenNodes',
    promptJson,
    prompt: prompt.trim(),
    maxToken: 4000,
    timestamp: Date.now(),
  } as GptData
}
