import {M, N} from "../state/MapPropTypes"
import {getXSSCC0S, getXSSCR0S, getXSSCYYS0, getX} from "./MapUtils"
import {GptData} from "../state/ApiStateTypes"

export const gptPrompter = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'genTaskNodes': {
      const {numNodes} = payload
      const prompt = `List the top ${numNodes} to do for ${getX(m).content}. Do not exceed 10 words per list item.`
      return {
        prompt,
        context: '',
        content: getX(m).content,
        typeNodes: 's',
        numNodes: numNodes,
        maxToken: numNodes * 12
      } as GptData
    }
    case 'fillTable': {
      const rowHeader = getXSSCR0S(m).map(el => el.content)
      const colHeader = getXSSCC0S(m).map(el => el.content)
      const MAX_ANSWER_LENGTH_IN_CHAR = 100
      const prompt = (
        `Fill field 'c' by replacing its content in the following JSON. Keep the format of the JSON. ${
          JSON.stringify(getXSSCYYS0(m).map((n: N) => ({
            ni: n.nodeId, //.slice(4),
            c: colHeader[0] + ' - ' + colHeader[n.path.at(-4) as number] + ' - ' + rowHeader[n.path.at(-3) as number]
          })))}`).trim()
      const maxToken = Math.ceil(JSON.stringify(getXSSCYYS0(m).map((n: N) => ({nodeId: n.nodeId, content: 'x'.repeat(MAX_ANSWER_LENGTH_IN_CHAR)}))).length / 4)
      console.log(prompt, maxToken)
      return {
        prompt,
        context: '',
        content: '',
        typeNodes: 'sc',
        numNodes: rowHeader.length * colHeader.length,
        maxToken
      } as GptData
    }
    default: { return {} as GptData }
  }
}
