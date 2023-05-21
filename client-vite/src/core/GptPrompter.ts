import {getSXSCC0S, getSXSCR0S, getX} from "./MapUtils";
import {GptData} from "../state/ApiStateTypes";
import {getMap} from "../state/EditorState";

export const gptPrompter = (action: string, payload: any) => {
  switch (action) {
    case 'genTaskNodes': {
      const {numNodes} = payload
      const m = getMap()
      return {
        prompt: `
        List the top ${numNodes} to do for ${getX(m).content}.
        Do not exceed 10 words per list item.`,
        context: '',
        content: getX(getMap()).content,
        typeNodes: 's',
        numNodes: numNodes
      } as GptData
    }
    case 'fillTable': {
      const m = getMap()
      const rowHeader = getSXSCR0S(m).map(el => el.content)
      const colHeader = getSXSCC0S(m).map(el => el.content)
      return {
        prompt: `
        Fill a table where header columns are [${rowHeader}] and header rows are [${colHeader}].
        Give me the results in a valid json.
        `,
        context: '',
        content: getX(m).content,
        typeNodes: 'sc',
        numNodes: rowHeader.length * colHeader.length
      } as GptData
    }
    default: { return {} as GptData }
  }
}
