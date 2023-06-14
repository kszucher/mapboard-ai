import {M, N} from "../state/MapPropTypes"
import {getXSSCC0S, getXSSCR0S, getXSSCYYS0, getX, m2cbS, getCountSS, getSIL, getNodeByPath} from "./MapUtils"
import {GptData} from "../state/ApiStateTypes"

export const getPromptJSON = (m: M) => {
  const cb = m2cbS(m)
  return m2cbS(m).filter(n => getCountSS(cb, n.path) === 0).map(n => ({
    keywords: [...getSIL(n.path), n.path].map(p => getNodeByPath(cb, p).content),
    suggestions: [],
    insertId: n.nodeId
  }))
}

const responseSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Generated schema for Root",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "keywords": {"type": "array"},
      "suggestions": {"type": "array"},
      "insertId": {"type": "string"},
    },
    "required": [
      "keywords",
      "suggestions",
      "insertId"
    ]
  }
}

export const gptPrompter = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'genNodes': {
      const promptJSON = getPromptJSON(m)
      const prompt = `
      Take the following meeting transcript: ${getX(m).note}
      Please extract information from the meeting transcript by filling "suggestions" based on "keywords" in the following JSON.
      Only change "suggestions", keep "insertId" and "keywords" as-is.
      ${promptJSON}
      Make sure to format the result according the following JSON schema.
      ${JSON.stringify(responseSchema)}
      Only return the JSON, no additional comments.
      `
      return {
        promptId: action,
        promptJSON: promptJSON,
        prompt: prompt.trim(),
        maxToken: 1200,
        timestamp: Date.now(),
      } as GptData
    }
    case 'fillTable': {
      const rowHeader = getXSSCR0S(m).map(el => el.content)
      const colHeader = getXSSCC0S(m).map(el => el.content)
      const MAX_ANSWER_LENGTH_IN_CHAR = 100
      const promptJSON = getXSSCYYS0(m).map((n: N) => ({
        nodeId: n.nodeId,
        content: colHeader[0] + ' - ' + colHeader[n.path.at(-4) as number] + ' - ' + rowHeader[n.path.at(-3) as number]
      }))
      const prompt = `
      Fill field 'c' by replacing its content in the following JSON. Keep the format of the JSON. ${JSON.stringify(promptJSON)}
      `
      const maxToken = Math.ceil(getXSSCYYS0(m).map((n: N) => ({
        nodeId: n.nodeId,
        content: 'x'.repeat(MAX_ANSWER_LENGTH_IN_CHAR)
      })).length / 4)
      console.log(prompt, maxToken)
      return {
        promptId: action,
        promptJSON,
        prompt: prompt.trim(),
        maxToken,
        timestamp: Date.now(),
      } as GptData
    }
    default: { return {} as GptData }
  }
}
