import {M} from "../state/MapPropTypes"
import {gptPrompter} from "../core/GptPrompter"

const fillTableTest = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0]},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 0, 's', 0], content: 'Row 0'},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1]},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 1, 's', 0], content: 'Col 1'},
  {selected: 0, selection: 's', nodeId: 'i', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2]},
  {selected: 0, selection: 's', nodeId: 'j', path: ['r', 0, 'd', 0, 's', 0, 'c', 0, 2, 's', 0], content: 'Col 2'},
  {selected: 0, selection: 's', nodeId: 'k', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0]},
  {selected: 0, selection: 's', nodeId: 'l', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 0, 's', 0], content: 'Row 1'},
  {selected: 0, selection: 's', nodeId: 'm', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1]},
  {selected: 0, selection: 's', nodeId: 'n', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'o', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2]},
  {selected: 0, selection: 's', nodeId: 'p', path: ['r', 0, 'd', 0, 's', 0, 'c', 1, 2, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'q', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0]},
  {selected: 0, selection: 's', nodeId: 'r', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 0, 's', 0], content: 'Row 2'},
  {selected: 0, selection: 's', nodeId: 's', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1]},
  {selected: 0, selection: 's', nodeId: 't', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 1, 's', 0]},
  {selected: 0, selection: 's', nodeId: 'u', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 2]},
  {selected: 0, selection: 's', nodeId: 'v', path: ['r', 0, 'd', 0, 's', 0, 'c', 2, 2, 's', 0]},
] as M

const fillTableResult = {
  prompt: (
    `Fill field 'c' by replacing its content in the following JSON. Keep the format of the JSON. ${
      JSON.stringify([
        {ni: 'n', c: 'Row 0 - Row 1 - Col 1'},
        {ni: 'p', c: 'Row 0 - Row 1 - Col 2'},
        {ni: 't', c: 'Row 0 - Row 2 - Col 1'},
        {ni: 'v', c: 'Row 0 - Row 2 - Col 2'},
      ])}
  `).trim(),
  context: '',
  content: '',
  typeNodes: 'sc',
  numNodes: 9,
  maxToken: 129,
}

describe("GptPrompterTests", () => {
  test('fillTable', () => expect(gptPrompter(fillTableTest, 'fillTable', {})).toEqual(fillTableResult))
})
