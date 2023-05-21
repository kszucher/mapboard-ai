import {M, N} from "../state/MapPropTypes"
import {getSXSCC0S, getSXSCR0S, getSXSCYYS0, getX} from "./MapUtils"
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
      const rowHeader = getSXSCR0S(m).map(el => el.content)
      const colHeader = getSXSCC0S(m).map(el => el.content)
      const MAX_ANSWER_LENGTH_IN_CHAR = 100
      const prompt = (
        `Fill field 'c', then remove field 'rh' and field 'ch' in the following JSON. ${
          JSON.stringify(getSXSCYYS0(m).map((n: N) => ({
            ni: n.nodeId, //.slice(4),
            c: '',
            rh: colHeader[0] + ' - ' + colHeader[n.path.at(-4) as number],
            ch: rowHeader[n.path.at(-3) as number]
          })))}`).trim()
      const maxToken = Math.ceil(JSON.stringify(getSXSCYYS0(m).map((n: N) => ({nodeId: n.nodeId, content: 'x'.repeat(MAX_ANSWER_LENGTH_IN_CHAR)}))).length / 4)
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
