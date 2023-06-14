import {M} from "../state/MapPropTypes"
import {getPromptJSON, gptPrompter} from "../core/GptPrompter"

const extendNotesTest = [
  {selected: 0, selection: 's', nodeId: 'a', path: ['g']},
  {selected: 0, selection: 's', nodeId: 'b', path: ['r', 0]},
  {selected: 0, selection: 's', nodeId: 'c', path: ['r', 0, 'd', 0]},
  {selected: 1, selection: 'f', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0], note: 'n', content: 's0'},
  {selected: 0, selection: 's', nodeId: 'd', path: ['r', 0, 'd', 0, 's', 0, 's', 0], note: 'n', content: 's0s0'},
  {selected: 0, selection: 's', nodeId: 'e', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 0], content: 's0s0s0'},
  {selected: 0, selection: 's', nodeId: 'f', path: ['r', 0, 'd', 0, 's', 0, 's', 0, 's', 1], content: 's0s0s1'},
  {selected: 0, selection: 's', nodeId: 'g', path: ['r', 0, 'd', 0, 's', 0, 's', 1], content: 's0s1'},
  {selected: 0, selection: 's', nodeId: 'h', path: ['r', 0, 'd', 0, 's', 0, 's', 2], content: 's0s2'},
] as M

const extendNotesResult = [
  {keywords: ['s0', 's0s0', 's0s0s0'], suggestions: [], insertId: 'e'},
  {keywords: ['s0', 's0s0', 's0s0s1'], suggestions: [], insertId: 'f'},
  {keywords: ['s0', 's0s1'], suggestions: [], insertId: 'g'},
  {keywords: ['s0', 's0s2'], suggestions: [], insertId: 'h'}
]

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

const fillTableResult = [
  {nodeId: 'n', content: 'Row 0 - Row 1 - Col 1'},
  {nodeId: 'p', content: 'Row 0 - Row 1 - Col 2'},
  {nodeId: 't', content: 'Row 0 - Row 2 - Col 1'},
  {nodeId: 'v', content: 'Row 0 - Row 2 - Col 2'},
]

describe("GptPrompterTests", () => {
  test('extendNotesTest', () => expect(getPromptJSON(extendNotesTest)).toEqual(extendNotesResult))

  // test('fillTable', () => expect(gptPrompter(fillTableTest, 'fillTable', {})).toEqual(fillTableResult))
})
