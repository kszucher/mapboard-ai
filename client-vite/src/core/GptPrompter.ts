import {M, N} from "../state/MapPropTypes"
import {getSXSCC0S, getSXSCR0S, getSXSCYYS0, getX} from "./MapUtils"
import {GptData} from "../state/ApiStateTypes"

export const gptPrompter = (m: M, action: string, payload: any) => {
  switch (action) {
    case 'genTaskNodes': {
      const {numNodes} = payload
      return {
        prompt: `
        List the top ${numNodes} to do for ${getX(m).content}.
        Do not exceed 10 words per list item.`,
        context: '',
        content: getX(m).content,
        typeNodes: 's',
        numNodes: numNodes
      } as GptData
    }
    case 'fillTable': {
      const rowHeader = getSXSCR0S(m).map(el => el.content)
      const colHeader = getSXSCC0S(m).map(el => el.content)
      return {
        prompt: (
          `Replace 'content' by evaluating its expression limited by 10 words per expression in the following JSON. ${
            JSON.stringify(getSXSCYYS0(m).map((n: N) => ({
              nodeId: n.nodeId,
              content: `${colHeader[n.path.at(-4) as number]} - ${rowHeader[n.path.at(-3) as number]}`
            })))}
        `).trim(),
        context: '',
        content: '',
        typeNodes: 'sc',
        numNodes: rowHeader.length * colHeader.length
      } as GptData
    }
    default: { return {} as GptData }
  }
}
